#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const OPEN_FIELDS = 'number,headRefName'
const CLOSED_FIELDS = 'number,headRefName,state,mergedAt'
const READ_ATTEMPTS = 3
const READ_BACKOFF_MS = 2000

function compareByNumber(left, right) {
  return (left?.number ?? 0) - (right?.number ?? 0)
}

function tracksBranch(branch) {
  return pullRequest => !pullRequest?.headRefName || pullRequest.headRefName === branch
}

function defaultSleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

// The automation owns exactly one rolling branch. Deciding from the pull request state, not from the
// branch name, is what keeps a merged or closed pull request from freezing the branch forever: `gh pr
// view <branch>` resolves merged pull requests too, so it can never report "no pull request yet".
export function planPullRequest({ branch, base = 'main', openPullRequests = [], closedPullRequests = [], hasChanges = true } = {}) {
  if (typeof branch !== 'string' || branch.trim().length === 0) {
    throw new Error('a head branch is required to plan the automation pull request')
  }
  const target = base || 'main'
  if (hasChanges === false) {
    return {
      action: 'skip',
      number: null,
      branch,
      base: target,
      reason: `"${branch}" has no commits against "${target}"`
    }
  }
  const open = [...(openPullRequests || [])].filter(tracksBranch(branch)).sort(compareByNumber)
  if (open.length > 0) {
    return {
      action: 'update',
      number: open[0].number,
      branch,
      base: target,
      reason: `open pull request #${open[0].number} already tracks "${branch}"`
    }
  }
  const closed = [...(closedPullRequests || [])].filter(tracksBranch(branch)).sort(compareByNumber)
  const previous = closed.at(-1)
  return {
    action: 'create',
    number: null,
    branch,
    base: target,
    reason: previous
      ? `no open pull request tracks "${branch}"; reusing the branch after ${previous.state === 'MERGED' ? 'merged' : 'closed'} pull request #${previous.number}`
      : `no pull request has tracked "${branch}" yet`
  }
}

export function pullRequestCommand(plan, { title, body } = {}) {
  if (plan?.action === 'update') return ['pr', 'edit', String(plan.number), '--title', title, '--body', body]
  if (plan?.action === 'create') return ['pr', 'create', '--base', plan.base, '--head', plan.branch, '--title', title, '--body', body]
  return null
}

export function describeCommand(args) {
  const quote = part => (/^[A-Za-z0-9_@%+=:,./-]+$/.test(part) ? part : `'${part.replaceAll("'", "'\\''")}'`)
  return ['gh', ...args].map(quote).join(' ')
}

export function parsePullRequestList(stdout) {
  const trimmed = String(stdout ?? '').trim()
  if (trimmed.length === 0) return []
  const parsed = JSON.parse(trimmed)
  if (!Array.isArray(parsed)) throw new Error('gh pr list did not return a JSON array')
  return parsed.filter(pullRequest => Number.isInteger(pullRequest?.number) && pullRequest.number > 0)
}

export function readPullRequests(gh, branch, state, { attempts = READ_ATTEMPTS, sleep = defaultSleep } = {}) {
  if (!['open', 'closed'].includes(state)) throw new Error(`unsupported pull request state: ${state}`)
  const args = ['pr', 'list', '--head', branch, '--state', state, '--json', state === 'open' ? OPEN_FIELDS : CLOSED_FIELDS, '--limit', '100']
  let lastError
  for (let attempt = 1; attempt <= Math.max(1, attempts); attempt += 1) {
    try {
      return parsePullRequestList(gh(args))
    } catch (error) {
      lastError = error
      if (attempt < attempts) sleep(READ_BACKOFF_MS * attempt)
    }
  }
  throw lastError
}

export function runPullRequestStep({ branch, base = 'main', title, body, hasChanges = true, dryRun = false, gh, sleep = defaultSleep, log = () => {} }) {
  if (!title || !body) throw new Error('a title and body are required for the automation pull request')
  if (typeof gh !== 'function') throw new Error('a gh runner is required')
  const openPullRequests = readPullRequests(gh, branch, 'open', { sleep })
  // A closed pull request only explains why the branch is reused, so read that history once it matters.
  const closedPullRequests = openPullRequests.length === 0 && hasChanges !== false ? readPullRequests(gh, branch, 'closed', { sleep }) : []
  const plan = planPullRequest({ branch, base, openPullRequests, closedPullRequests, hasChanges })
  const command = pullRequestCommand(plan, { title, body })
  if (!command) {
    log(`[pr-state] skip: ${plan.reason}`)
    return { ...plan, url: null }
  }
  log(`[pr-state] ${plan.action}: ${plan.reason}`)
  if (dryRun) {
    log(`[pr-state] dry-run: would run ${describeCommand(command)}`)
    return { ...plan, url: null }
  }
  const url = String(gh(command) ?? '').trim().split('\n').filter(Boolean).at(-1) ?? null
  log(`[pr-state] ${url ?? '(no url returned)'}`)
  return { ...plan, url }
}

export function createGhRunner() {
  return args => {
    try {
      return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
    } catch (error) {
      const detail = String(error?.stderr ?? '').trim() || error?.message || String(error)
      throw new Error(`gh ${args.slice(0, 2).join(' ')} failed: ${detail}`)
    }
  }
}

export function parseArguments(argv = [], env = {}) {
  const options = {
    branch: env.PR_BRANCH || '',
    base: env.PR_BASE || 'main',
    title: env.PR_TITLE || '',
    body: env.PR_BODY || '',
    dryRun: env.PR_DRY_RUN === '1' || env.PR_DRY_RUN === 'true',
    hasChanges: true
  }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (argument === '--no-changes') {
      options.hasChanges = false
      continue
    }
    const match = /^--(branch|base|title|body)=([\s\S]*)$/.exec(argument)
    if (match) {
      options[match[1]] = match[2]
      continue
    }
    const flag = /^--(branch|base|title|body)$/.exec(argument)
    if (!flag) throw new Error(`unknown argument: ${argument}`)
    const value = argv[index + 1]
    if (value === undefined) throw new Error(`--${flag[1]} needs a value`)
    options[flag[1]] = value
    index += 1
  }
  if (!options.branch) throw new Error('a head branch is required (--branch or PR_BRANCH)')
  if (!options.title || !options.body) throw new Error('a title and body are required (--title/--body or PR_TITLE/PR_BODY)')
  return options
}

export async function main(argv = process.argv.slice(2), { env = process.env, gh = createGhRunner(), log = message => console.log(message) } = {}) {
  const options = parseArguments(argv, env)
  const result = runPullRequestStep({ ...options, gh, log })
  log(JSON.stringify({ action: result.action, pullRequest: result.number, branch: result.branch, url: result.url, reason: result.reason }))
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`[pr-state] ${error.message}`)
    process.exitCode = 1
  })
}

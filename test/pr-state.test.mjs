import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describeCommand, parseArguments, planPullRequest, pullRequestCommand, readPullRequests, runPullRequestStep } from '../scripts/pr-state.mjs'

const BRANCH = 'automation/plugin-radar'
const TITLE = 'Update verified DSH plugin radar'
const BODY = 'Automated four-hour scan of topic-tagged repositories.'
const PULL_REQUEST_URL = 'https://github.com/dongsheng123132/awesome-dsh-plugins/pull/46'

function fakeGh({ open = [], closed = [] } = {}) {
  const calls = []
  const gh = args => {
    calls.push(args)
    if (args[0] === 'pr' && args[1] === 'list') {
      const state = args[args.indexOf('--state') + 1]
      return JSON.stringify(state === 'open' ? open : closed)
    }
    if (args[0] === 'pr' && (args[1] === 'create' || args[1] === 'edit')) return `${PULL_REQUEST_URL}\n`
    throw new Error(`unexpected gh call: ${args.join(' ')}`)
  }
  return { gh, calls }
}

function step(options) {
  return runPullRequestStep({ branch: BRANCH, title: TITLE, body: BODY, sleep: () => {}, log: () => {}, ...options })
}

test('radar opens a pull request when the branch never had one', () => {
  const { gh, calls } = fakeGh()
  const result = step({ gh })
  assert.equal(result.action, 'create')
  assert.equal(result.number, null)
  assert.equal(result.url, PULL_REQUEST_URL)
  assert.match(result.reason, /no pull request has tracked/)
  assert.deepEqual(calls.map(args => args.slice(0, 2)), [['pr', 'list'], ['pr', 'list'], ['pr', 'create']])
  assert.deepEqual(calls.at(-1), ['pr', 'create', '--base', 'main', '--head', BRANCH, '--title', TITLE, '--body', BODY])
})

test('radar edits the open pull request instead of opening a second one', () => {
  const { gh, calls } = fakeGh({ open: [{ number: 46, headRefName: BRANCH }] })
  const result = step({ gh })
  assert.equal(result.action, 'update')
  assert.equal(result.number, 46)
  assert.equal(result.url, PULL_REQUEST_URL)
  assert.equal(calls.some(args => args[1] === 'create'), false, 'an open pull request must never be duplicated')
  assert.deepEqual(calls.at(-1), ['pr', 'edit', '46', '--title', TITLE, '--body', BODY])
  assert.equal(calls.filter(args => args[1] === 'list' && args.includes('closed')).length, 0, 'closed history is irrelevant while a pull request is open')
})

test('radar opens a new pull request after the previous one merged', () => {
  const { gh, calls } = fakeGh({ closed: [{ number: 1, headRefName: BRANCH, state: 'MERGED', mergedAt: '2026-08-25T09:17:06Z' }] })
  const result = step({ gh })
  assert.equal(result.action, 'create')
  assert.equal(result.number, null)
  assert.match(result.reason, /reusing the branch after merged pull request #1/)
  assert.equal(calls.some(args => args[1] === 'edit'), false, 'editing the merged pull request is exactly the regression')
  assert.deepEqual(calls.at(-1).slice(0, 5), ['pr', 'create', '--base', 'main', '--head'])
  assert.equal(calls.at(-1)[5], BRANCH)
})

test('radar opens a new pull request after the previous one was closed without merging', () => {
  const { gh } = fakeGh({ closed: [{ number: 12, headRefName: BRANCH, state: 'CLOSED', mergedAt: null }] })
  const result = step({ gh })
  assert.equal(result.action, 'create')
  assert.match(result.reason, /reusing the branch after closed pull request #12/)
})

test('radar keeps editing the oldest open pull request when history has several entries', () => {
  const { gh } = fakeGh({
    open: [{ number: 46, headRefName: BRANCH }, { number: 44, headRefName: BRANCH }],
    closed: [{ number: 1, headRefName: BRANCH, state: 'MERGED' }]
  })
  assert.equal(step({ gh }).number, 44, 'the decision must be deterministic, not dependent on list order')
})

test('radar plans nothing when the snapshot has no commits against the base', () => {
  const { gh, calls } = fakeGh({ closed: [{ number: 1, headRefName: BRANCH, state: 'MERGED' }] })
  const result = step({ gh, hasChanges: false })
  assert.equal(result.action, 'skip')
  assert.equal(result.url, null)
  assert.deepEqual(calls.map(args => args.slice(0, 2)), [['pr', 'list']], 'no history or mutation is needed for a skip')
  assert.equal(planPullRequest({ branch: BRANCH, hasChanges: false }).action, 'skip')
})

test('radar pull request planning rejects a missing branch', () => {
  assert.throws(() => planPullRequest({}), /head branch is required/)
  assert.throws(() => step({ gh: () => '[]', branch: undefined }), /head branch is required/)
})

test('radar pull request commands keep the title and body verbatim', () => {
  const plan = planPullRequest({ branch: BRANCH, closedPullRequests: [{ number: 1, headRefName: BRANCH, state: 'MERGED' }] })
  assert.deepEqual(pullRequestCommand(plan, { title: TITLE, body: BODY }), ['pr', 'create', '--base', 'main', '--head', BRANCH, '--title', TITLE, '--body', BODY])
  assert.equal(planPullRequest({ branch: BRANCH, openPullRequests: [{ number: 9, headRefName: BRANCH }] }).action, 'update')
  assert.equal(describeCommand(['pr', 'edit', '9', '--title', 'Update verified DSH plugin radar']), "gh pr edit 9 --title 'Update verified DSH plugin radar'")
})

test('radar pull request reads retry a transient gh failure', () => {
  let attempts = 0
  const gh = () => {
    attempts += 1
    if (attempts === 1) throw new Error('gh pr list failed: HTTP 502')
    return JSON.stringify([{ number: 7, headRefName: BRANCH }])
  }
  const sleeps = []
  assert.deepEqual(readPullRequests(gh, BRANCH, 'open', { attempts: 3, sleep: milliseconds => sleeps.push(milliseconds) }), [{ number: 7, headRefName: BRANCH }])
  assert.equal(attempts, 2)
  assert.deepEqual(sleeps, [2000])
  assert.equal(readPullRequests(() => '', BRANCH, 'closed').length, 0, 'an empty list is not a failure')
})

test('radar pull request arguments fall back to environment variables', () => {
  const options = parseArguments([], { PR_BRANCH: BRANCH, PR_TITLE: TITLE, PR_BODY: BODY })
  assert.deepEqual([options.branch, options.base, options.title, options.body, options.dryRun], [BRANCH, 'main', TITLE, BODY, false])
  assert.equal(parseArguments(['--branch', BRANCH, '--base=next', '--title', TITLE, '--body', BODY, '--dry-run']).base, 'next')
  assert.equal(parseArguments(['--branch', BRANCH, '--title', TITLE, '--body', BODY, '--dry-run']).dryRun, true)
  assert.equal(parseArguments(['--branch', BRANCH, '--title', TITLE, '--body', BODY, '--no-changes']).hasChanges, false)
  assert.throws(() => parseArguments(['--nope'], {}), /unknown argument/)
  assert.throws(() => parseArguments(['--branch', BRANCH, '--title', TITLE], {}), /title and body are required/)
})

test('radar dry-run reports the planned mutation without opening or editing anything', () => {
  const { gh, calls } = fakeGh({ closed: [{ number: 1, headRefName: BRANCH, state: 'MERGED', mergedAt: '2026-08-25T09:17:06Z' }] })
  const logs = []
  const result = step({ gh, dryRun: true, log: message => logs.push(message) })
  assert.equal(result.action, 'create')
  assert.equal(result.url, null)
  assert.deepEqual(calls.map(args => args.slice(0, 2)), [['pr', 'list'], ['pr', 'list']], 'a dry run only reads pull request state')
  assert.match(logs.join('\n'), /dry-run: would run gh pr create --base main --head automation\/plugin-radar/)
})

test('radar workflows decide from pull request state, not from the branch name', async () => {
  const radar = await readFile(new URL('../.github/workflows/radar.yml', import.meta.url), 'utf8')
  const port = await readFile(new URL('../.github/workflows/capability-port.yml', import.meta.url), 'utf8')
  for (const [name, workflow] of [['radar.yml', radar], ['capability-port.yml', port]]) {
    assert.ok(workflow.includes('node scripts/pr-state.mjs'), `${name} must delegate the pull request decision to the tested helper`)
    assert.equal(/gh pr (view|edit|create)/.test(workflow), false, `${name} must not branch on a name that also resolves merged pull requests`)
  }
  assert.ok(radar.includes('PR_BRANCH: ${{ env.RADAR_BRANCH }}'))
  assert.ok(radar.includes(TITLE))
  assert.ok(radar.includes('Automated four-hour scan of topic-tagged repositories. Every promoted entry has observable dsh.bundle.patch and patch-file evidence. Static review signals are triage hints, not a security certification. Review candidate removals and large count changes before merging.'))
  assert.ok(port.includes('Automated evidence snapshot of public SKILL.md candidates. Copy/Wrapper/Bridge and Capability Port Score are heuristic triage backed by pinned repository/blob observations; they are not compatibility, safety, quality, or license clearance.'))
})

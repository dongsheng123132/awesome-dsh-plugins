import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const MAX_CAPTURE_CHARS = 1600

export function tail(value, maxChars = MAX_CAPTURE_CHARS) {
  return value.length <= maxChars ? value : value.slice(-maxChars)
}

export function sanitizeOutput(value, replacements = []) {
  return replacements.reduce(
    (text, [secret, label]) => secret ? text.replaceAll(secret, label) : text,
    value
  )
}

const SENSITIVE_ENVIRONMENT_NAME = /(?:^|_)(?:api_?key|auth|credential|password|passwd|secret|token)(?:_|$)/i
const CI_CONTROL_ENVIRONMENT_NAME = /^(?:ACTIONS|GITHUB)_/i

export function sanitizeEnvironment(environment) {
  return Object.fromEntries(Object.entries(environment).filter(([name]) => (
    !SENSITIVE_ENVIRONMENT_NAME.test(name) && !CI_CONTROL_ENVIRONMENT_NAME.test(name)
  )))
}

function sortForJson(value) {
  if (Array.isArray(value)) return value.map(sortForJson)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortForJson(value[key])]))
  }
  return value
}

export function stableJson(value) {
  return `${JSON.stringify(sortForJson(value), null, 2)}\n`
}

export function declaredPackageEntrypoint(manifest) {
  const rootExport = manifest?.exports?.['.']
  if (typeof rootExport === 'string') return rootExport
  if (typeof rootExport?.default === 'string') return rootExport.default
  if (typeof rootExport?.import === 'string') return rootExport.import
  return typeof manifest?.main === 'string' ? manifest.main : null
}

export function classifyRuntimeFailure({ install, compose, boot, entrypoint, harnessBlocked, engineSatisfied }) {
  if (install?.ok && compose?.ok && boot?.ok) return null
  if (!install?.ok) return 'install-failed'
  if (entrypoint?.declared && entrypoint.exists === false) return 'package-artifact-missing'
  if (!compose?.ok) return 'composition-failed'
  if (harnessBlocked) return 'blocked-harness'
  if (!engineSatisfied) return 'blocked-environment'
  return 'boot-failed'
}

export async function writeImmutableRuntimeArtifact(directory, report) {
  const content = stableJson(report)
  const sha256 = createHash('sha256').update(content).digest('hex')
  const filename = `runtime-${sha256}.json`
  await mkdir(directory, { recursive: true })
  const path = join(directory, filename)
  try {
    await writeFile(path, content, { encoding: 'utf8', flag: 'wx' })
    return { filename, sha256, replayed: false }
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error
    if (await readFile(path, 'utf8') !== content) throw new Error(`runtime artifact collision: ${filename}`)
    return { filename, sha256, replayed: true }
  }
}

export async function sha256File(path) {
  const content = await readFile(path)
  return createHash('sha256').update(content).digest('hex')
}

export function runProcess(command, args, options = {}) {
  const started = performance.now()
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      windowsHide: true,
      shell: false
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, options.timeoutMs ?? 120000)
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', error => { stderr += `\n${error.stack || error.message}` })
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer)
      const replacements = options.replacements ?? []
      resolve({
        ok: exitCode === 0 && !timedOut,
        exitCode,
        signal,
        timedOut,
        durationMs: Math.round(performance.now() - started),
        stdoutTail: tail(sanitizeOutput(stdout, replacements)),
        stderrTail: tail(sanitizeOutput(stderr, replacements))
      })
    })
  })
}

export function bootUntilReady(command, args, options = {}) {
  const started = performance.now()
  const readyPattern = options.readyPattern ?? /dsh web: http:\/\/127\.0\.0\.1:\d+/
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      windowsHide: true,
      shell: false
    })
    let stdout = ''
    let stderr = ''
    let readyLine = null
    let timedOut = false
    let stopping = false
    let forceTimer

    const stop = () => {
      if (stopping) return
      stopping = true
      child.kill('SIGTERM')
      forceTimer = setTimeout(() => child.kill('SIGKILL'), 5000)
    }
    const observe = chunk => {
      stdout += chunk
      const match = stdout.match(readyPattern)
      if (match && readyLine === null) {
        readyLine = match[0]
        stop()
      }
    }
    child.stdout.on('data', observe)
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', error => { stderr += `\n${error.stack || error.message}` })
    const timeout = setTimeout(() => {
      timedOut = true
      stop()
    }, options.timeoutMs ?? 45000)
    child.on('close', (exitCode, signal) => {
      clearTimeout(timeout)
      if (forceTimer) clearTimeout(forceTimer)
      const replacements = options.replacements ?? []
      resolve({
        ok: readyLine !== null && !timedOut,
        exitCode,
        signal,
        timedOut,
        readyLine,
        durationMs: Math.round(performance.now() - started),
        stdoutTail: tail(sanitizeOutput(stdout, replacements)),
        stderrTail: tail(sanitizeOutput(stderr, replacements))
      })
    })
  })
}

export async function appendRuntimeReport(path, report) {
  const document = JSON.parse(await readFile(path, 'utf8'))
  if (document.schemaVersion !== 1 || !Array.isArray(document.reports)) {
    throw new Error('runtime report store must use schemaVersion 1 and a reports array')
  }
  const reports = document.reports.filter(item => item.id !== report.id)
  reports.push(report)
  reports.sort((left, right) => String(right.checkedAt).localeCompare(String(left.checkedAt)))
  await writeFile(path, `${JSON.stringify({ ...document, reports }, null, 2)}\n`, 'utf8')
}

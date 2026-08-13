import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

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

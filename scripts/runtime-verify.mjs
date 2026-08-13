#!/usr/bin/env node
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, isAbsolute, join, resolve } from 'node:path'
import { appendRuntimeReport, bootUntilReady, runProcess, sha256File } from './runtime-lib.mjs'

const argv = process.argv.slice(2)
const value = flag => {
  const index = argv.indexOf(flag)
  return index === -1 ? undefined : argv[index + 1]
}
const positional = argv.filter((entry, index) => !entry.startsWith('--') && (index === 0 || !argv[index - 1].startsWith('--')))
const spec = value('--spec') ?? positional[0]
const dshRepo = value('--dsh-repo') ?? positional[1]
const profile = value('--profile') ?? 'web'
const recordPath = value('--record') ?? positional[2]
const timeoutMs = Number.parseInt(value('--timeout-ms') ?? positional[3] ?? '60000', 10)
const keepHome = argv.includes('--keep-home')
const displaySpec = value('--display-spec') ?? spec
const nodeExecutable = resolve(value('--node') ?? process.execPath)

if (!spec || !dshRepo) {
  throw new Error('usage: runtime-verify --spec <package> --dsh-repo <checkout> [--record <json>] [--profile web]; positional spec/repo/record/timeout are also accepted')
}
if (!Number.isInteger(timeoutMs) || timeoutMs < 1000) throw new Error('--timeout-ms must be an integer >= 1000')

const repo = resolve(dshRepo)
const home = await mkdtemp(join(tmpdir(), 'awesome-dsh-runtime-'))
const replacements = [
  [home, '<TEMP_DSH_HOME>'],
  [repo, '<DSH_REPO>'],
  ...(isAbsolute(spec) ? [[resolve(spec), '<PLUGIN_CHECKOUT>']] : [])
]
const env = { ...process.env, DSH_HOME: home, NO_COLOR: '1', FORCE_COLOR: '0' }
const dshBin = join(repo, 'apps', 'cli', 'src', 'bin.ts')
const dshArgs = args => ['--import', 'tsx/esm', dshBin, ...args]

function supportsDsh(version) {
  const match = /^v?(\d+)\.(\d+)\./.exec(version)
  if (!match) return false
  const major = Number.parseInt(match[1], 10)
  const minor = Number.parseInt(match[2], 10)
  return major >= 24 || (major === 22 && minor >= 19)
}

async function git(...args) {
  return runProcess('git', ['-C', repo, ...args], { timeoutMs: 15000, replacements })
}

let report
try {
  const revisionResult = await git('rev-parse', 'HEAD')
  const dirtyResult = await git('status', '--porcelain')
  const nodeResult = await runProcess(nodeExecutable, ['--version'], { timeoutMs: 15000, replacements })
  if (!revisionResult.ok) throw new Error(`cannot resolve DSH revision: ${revisionResult.stderrTail}`)
  if (!nodeResult.ok) throw new Error(`cannot execute selected Node runtime: ${nodeResult.stderrTail}`)
  const revision = revisionResult.stdoutTail.trim()
  const nodeVersion = nodeResult.stdoutTail.trim()

  const install = await runProcess(nodeExecutable, dshArgs([
    'plugin', '--profile', profile, 'add', spec, '--config.minimumReleaseAge=0'
  ]), { cwd: repo, env, timeoutMs: Math.max(timeoutMs, 180000), replacements })

  const profileDir = join(home, 'profiles', profile)
  const profileManifestPath = join(profileDir, 'package.json')
  let resolvedPackage = null
  let manifestPath = null
  let patchPath = null
  let packageManifest = null
  if (install.ok) {
    const profileManifest = JSON.parse(await readFile(profileManifestPath, 'utf8'))
    const bundles = profileManifest.dsh?.profile?.bundles ?? []
    resolvedPackage = [...bundles].reverse().find(name => !name.startsWith('@deepseek-ai/dsh-')) ?? bundles.at(-1) ?? null
    if (resolvedPackage) {
      manifestPath = join(profileDir, 'node_modules', ...resolvedPackage.split('/'), 'package.json')
      packageManifest = JSON.parse(await readFile(manifestPath, 'utf8'))
      patchPath = resolve(join(manifestPath, '..'), packageManifest.dsh.bundle.patch)
    }
  }

  const compose = install.ok
    ? await runProcess(nodeExecutable, dshArgs(['--profile', profile, '--dump-config']), {
        cwd: repo, env, timeoutMs, replacements
      })
    : { ok: false, skipped: true, reason: 'install failed' }

  const boot = install.ok && compose.ok
    ? await bootUntilReady(nodeExecutable, dshArgs([
        '--profile', profile, '--host', '127.0.0.1', '--port', '0'
      ]), { cwd: repo, env, timeoutMs, replacements })
    : { ok: false, skipped: true, reason: install.ok ? 'composition failed' : 'install failed' }

  const checkedAt = new Date().toISOString()
  const harnessBlocked = boot.stderrTail?.includes('MissingClientBundleError') === true
  const status = install.ok && compose.ok && boot.ok
    ? 'passed'
    : install.ok && compose.ok && harnessBlocked ? 'blocked-harness'
    : install.ok && compose.ok && !supportsDsh(nodeVersion) ? 'blocked-environment' : 'failed'
  const identity = (packageManifest?.name ?? spec).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
  report = {
    id: `${identity}-${revision.slice(0, 12)}-${checkedAt.replace(/[-:.]/g, '').slice(0, 15)}z`,
    status,
    checkedAt,
    dsh: {
      repository: 'deepseek-ai/deepseek-harness',
      revision,
      dirty: dirtyResult.stdoutTail.trim().length > 0
    },
    environment: {
      platform: process.platform,
      arch: process.arch,
      node: nodeVersion,
      dshEngineSatisfied: supportsDsh(nodeVersion)
    },
    package: {
      spec: displaySpec,
      resolvedName: packageManifest?.name ?? resolvedPackage,
      resolvedVersion: packageManifest?.version ?? null,
      manifestSha256: manifestPath ? await sha256File(manifestPath) : null,
      patchPath: patchPath ? basename(patchPath) : null,
      patchSha256: patchPath ? await sha256File(patchPath) : null
    },
    stages: [
      { name: 'install', ...install },
      { name: 'compose', ...compose },
      { name: 'boot', ...boot }
    ]
  }

  if (recordPath) await appendRuntimeReport(resolve(recordPath), report)
  console.log(JSON.stringify(report, null, 2))
  if (status !== 'passed') process.exitCode = 1
} finally {
  if (!keepHome) {
    const safePrefix = resolve(tmpdir(), 'awesome-dsh-runtime-')
    if (!resolve(home).startsWith(safePrefix)) throw new Error(`refusing to remove unexpected runtime home: ${home}`)
    await rm(home, { recursive: true, force: true })
  } else {
    process.stderr.write(`runtime home retained: ${home}\n`)
  }
}

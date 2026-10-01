// Run from the pinned DSH checkout with node --import tsx/esm.
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, relative, isAbsolute } from 'node:path'
import { PassThrough } from 'node:stream'
import { pathToFileURL } from 'node:url'

const [dshArg, dshRevision, profile, supportArg, windowsArg] = process.argv.slice(2)
assert.equal(process.argv.length, 7, 'provide DSH checkout, revision, profile, support checkout and Windows checkout')
assert.ok(profile === 'web' || profile === 'headless', 'profile must be web or headless')
const dsh = resolve(dshArg)
const support = resolve(supportArg)
const windows = resolve(windowsArg)
const revisions = [
  [dsh, dshRevision],
  [support, 'df33364fee39fbb55b53b8c290df6b28d0f072c6'],
  [windows, '46cc6b8dbaa0f970ffa326615cb1e52683516929'],
]
for (const [dir, revision] of revisions) {
  assert.match(revision, /^[a-f0-9]{40}$/)
  assert.equal(execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { timeout: 10000 }).toString().trim(), revision)
}
assert.ok(process.env.DSH_HOME, 'fresh DSH_HOME required')

// Never inherit account credentials or other task-specific settings into the profile.
const allowed = new Set(['DSH_HOME', 'PATH', 'Path', 'PATHEXT', 'SystemRoot', 'SystemDrive', 'ComSpec', 'TEMP', 'TMP', 'HOME', 'USERPROFILE'])
for (const key of Object.keys(process.env)) if (!allowed.has(key)) delete process.env[key]
process.env.DSH_TELEMETRY_DISABLED = '1'

const workspace = await mkdtemp(join(tmpdir(), 'dsh-profile-business-'))
const supportFixture = await readFile(join(support, 'examples/closed.json'), 'utf8')
assert.ok(supportFixture.length < 65536, 'support fixture exceeds 64 KiB')
await writeFile(join(workspace, 'closed.json'), supportFixture, { flag: 'wx' })
const incomplete = JSON.parse(supportFixture)
incomplete.retirements = []
await writeFile(join(workspace, 'incomplete.json'), JSON.stringify(incomplete), { flag: 'wx' })
execFileSync(process.execPath, [join(windows, 'examples/create-sanitized-example.mjs'), workspace], { timeout: 10000, maxBuffer: 65536 })
process.chdir(workspace)

const importFromDsh = file => import(pathToFileURL(join(dsh, file)).href)
const { loadLayeredEnv } = await importFromDsh('packages/boot/app-boot/src/index.ts')
const { runProfile } = await importFromDsh('apps/cli/src/profile-boot.ts')
const stdout = process.stdout.write.bind(process.stdout)
const stderr = process.stderr.write.bind(process.stderr)
const stdinDescriptor = Object.getOwnPropertyDescriptor(process, 'stdin')
// Park the headless task on an open, empty stdin so its real Loader can settle
// without racing an agent failure or sending a prompt to a model.
if (profile === 'headless') Object.defineProperty(process, 'stdin', { configurable: true, enumerable: true, value: new PassThrough() })
// Web emits a bearer URL and headless emits model diagnostics. Neither belongs in evidence.
process.stdout.write = () => true
process.stderr.write = () => true
const deadline = setTimeout(() => { stderr('profile business probe timed out\n'); process.exit(1) }, 60000)
let booted
try {
  const args = profile === 'web' ? ['--no-open', '--host', '127.0.0.1', '--port', '0'] : ['-']
  booted = await runProfile({ environment: loadLayeredEnv('dsh'), profile, patchFiles: [], args })
  const { ctx, shutdown } = booted
  let report
  try {
    assert.ok(ctx.get('loader'), 'real Loader service absent')
    const names = ctx.tools.schemas().map(x => x.name)
    const expected = ['dsh_support_lifecycle_inspect', 'dsh_support_lifecycle_verify', 'dsh_windows_readiness_inspect', 'dsh_windows_readiness_verify']
    for (const name of expected) assert.ok(names.includes(name), `missing ${name}`)
    const call = (name, arguments_) => ctx.tools.execute({ signal: AbortSignal.timeout(10000), callId: randomUUID(), name, arguments: arguments_ })
    const good = async (name, arguments_) => {
      const result = await call(name, arguments_)
      assert.equal(result.isError, false, `${name} failed`)
      return result.value
    }
    const checkedArtifact = async (artifact, expectReadBackFlag = false) => {
      if (expectReadBackFlag) assert.equal(artifact.verifiedByReadBack, true)
      const target = resolve(workspace, artifact.path)
      const rel = relative(workspace, target)
      assert.ok(rel && !rel.startsWith('..') && !isAbsolute(rel), 'artifact outside probe workspace')
      const bytes = await readFile(target)
      assert.equal(createHash('sha256').update(bytes).digest('hex'), artifact.sha256)
      return artifact.sha256
    }
    const supportInspect = await good('dsh_support_lifecycle_inspect', { manifestJson: supportFixture })
    assert.equal(supportInspect.componentCount, 2)
    const supportClosed = await good('dsh_support_lifecycle_verify', { manifestPath: 'closed.json', artifactDir: 'artifacts' })
    assert.equal(supportClosed.verdict, 'support-lifecycle-closed')
    const supportSha256 = await checkedArtifact(supportClosed.artifact, true)
    const supportIncomplete = await good('dsh_support_lifecycle_verify', { manifestPath: 'incomplete.json', artifactDir: 'artifacts' })
    assert.equal(supportIncomplete.verdict, 'not-closed')
    const windowsInspect = await good('dsh_windows_readiness_inspect', { manifestPath: 'manifest.json' })
    assert.equal(windowsInspect.requiredControlCount, 26)
    const windowsVerified = await good('dsh_windows_readiness_verify', { manifestPath: 'manifest.json', artifactDir: 'artifacts' })
    assert.equal(windowsVerified.status, 'verified')
    assert.equal(windowsVerified.controls.length, 26)
    assert.equal(windowsVerified.modifiesHost, false)
    const windowsSha256 = await checkedArtifact(windowsVerified.artifact)
    const rejected = await call('dsh_windows_readiness_verify', { manifestPath: '../manifest.json', artifactDir: 'artifacts' })
    assert.equal(rejected.isError, true, 'workspace traversal was accepted')
    report = { ok: true, profile, dshRevision, registeredToolCount: names.length, supportSha256, windowsSha256, cases: ['support-inspect', 'support-closed-readback', 'support-incomplete', 'windows-inspect', 'windows-verified-readback', 'windows-traversal-rejected'], scope: 'full profile Loader direct ToolRuntime calls, no model task success claim' }
  } finally {
    if (profile === 'headless') await shutdown.shutdown(0)
    else await ctx.fiber.dispose()
  }
  process.exitCode = 0
  stdout(JSON.stringify(report) + '\n')
} finally {
  clearTimeout(deadline)
  process.stdout.write = stdout
  process.stderr.write = stderr
  if (stdinDescriptor) Object.defineProperty(process, 'stdin', stdinDescriptor)
  if (booted === undefined) process.exitCode = 1
}

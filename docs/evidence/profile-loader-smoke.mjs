// Run with node --import tsx/esm from a pinned DSH source checkout.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const [checkoutArg, expectedRevision, profile = 'headless', ...rest] = process.argv.slice(2)
const fixtureFlag = rest.indexOf('--support-fixture')
const expectedTools = fixtureFlag < 0 ? rest : rest.slice(0, fixtureFlag)
const supportFixture = fixtureFlag < 0 ? undefined : rest[fixtureFlag + 1]
if (fixtureFlag >= 0) assert.equal(rest.length, fixtureFlag + 2, 'support fixture must be the last path argument')
assert.ok(checkoutArg && expectedRevision, 'provide checkout, fixed revision, profile and optional expected tool names')
assert.match(expectedRevision, /^[a-f0-9]{40}$/)
const checkout = resolve(checkoutArg)
assert.equal(execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { timeout: 10000 }).toString().trim(), expectedRevision)
assert.ok(process.env.DSH_HOME, 'fresh DSH_HOME required')

// The replay must not inherit model keys, tokens or unrelated account configuration.
const allowed = new Set(['DSH_HOME', 'PATH', 'Path', 'PATHEXT', 'SystemRoot', 'SystemDrive', 'ComSpec', 'TEMP', 'TMP', 'HOME', 'USERPROFILE'])
for (const key of Object.keys(process.env)) if (!allowed.has(key)) delete process.env[key]
process.env.DSH_TELEMETRY_DISABLED = '1'

const importFromCheckout = async (file) => import(pathToFileURL(join(checkout, file)).href)
const { loadLayeredEnv } = await importFromCheckout('packages/boot/app-boot/src/index.ts')
const { runProfile } = await importFromCheckout('apps/cli/src/profile-boot.ts')
const originalStdoutWrite = process.stdout.write.bind(process.stdout)
const originalStderrWrite = process.stderr.write.bind(process.stderr)
// Web startup emits a bearer URL; never let it enter CI logs or evidence.
process.stdout.write = () => true
process.stderr.write = () => true
let booted
let bootError
const deadline = setTimeout(() => {
  originalStderrWrite('profile boot timed out after 45 seconds\n')
  process.exit(1)
}, 45_000)
try {
  const args = profile === 'web' ? ['--no-open', '--host', '127.0.0.1', '--port', '0']
    : profile === 'headless' ? ['__loader_probe_no_model__'] : []
  booted = await runProfile({ environment: loadLayeredEnv('dsh'), profile, patchFiles: [], args })
} catch (error) {
  bootError = error
}
try {
  if (bootError) throw new Error(`profile boot failed: ${bootError?.name ?? 'Error'}`)
  const { ctx, shutdown } = booted
  let actual
  let supportComponentCount
  try {
    assert.ok(ctx.get('loader'), 'real Loader service absent')
    actual = ctx.tools.schemas().map(x => x.name)
    for (const name of expectedTools) assert.ok(actual.includes(name), `profile Loader did not register ${name}`)
    if (supportFixture) {
      assert.ok(actual.includes('dsh_support_lifecycle_inspect'), 'support inspect tool absent')
      const fixture = readFileSync(resolve(supportFixture), 'utf8')
      assert.ok(fixture.length < 65536, 'fixture exceeds 64 KiB')
      const inspected = await ctx.tools.execute({ signal: AbortSignal.timeout(10000), callId: randomUUID(), name: 'dsh_support_lifecycle_inspect', arguments: { manifestJson: fixture } })
      assert.equal(inspected.isError, false, 'support inspect business call failed')
      supportComponentCount = inspected.value.componentCount
      assert.equal(supportComponentCount, 2, 'unexpected support fixture component count')
    }
  } finally {
    if (profile === 'headless') await shutdown.shutdown(0)
    else await ctx.fiber.dispose()
  }
  process.exitCode = 0
  originalStdoutWrite(JSON.stringify({ ok: true, dshRevision: expectedRevision, profile, expectedTools, registeredToolCount: actual.length, supportComponentCount, loader: 'real profile boot', scope: 'tool registration and optional support inspect through full profile Loader; no model task success claim' }) + '\n')
} finally {
  clearTimeout(deadline)
  process.stdout.write = originalStdoutWrite
  process.stderr.write = originalStderrWrite
}

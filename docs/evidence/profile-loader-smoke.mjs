// Run with node --import tsx/esm from a pinned DSH source checkout.
import assert from 'node:assert/strict'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const [checkoutArg, expectedRevision, profile = 'headless', ...expectedTools] = process.argv.slice(2)
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
  booted = await runProfile({ environment: loadLayeredEnv('dsh'), profile, patchFiles: [], args: ['--no-open', '--host', '127.0.0.1', '--port', '0'] })
} catch (error) {
  bootError = error
} finally {
  clearTimeout(deadline)
  process.stdout.write = originalStdoutWrite
  process.stderr.write = originalStderrWrite
}
if (bootError) throw new Error(`profile boot failed: ${bootError?.name ?? 'Error'}`)
const { ctx } = booted
try {
  assert.ok(ctx.get('loader'), 'real Loader service absent')
  const actual = ctx.tools.schemas().map(x => x.name)
  for (const name of expectedTools) assert.ok(actual.includes(name), `profile Loader did not register ${name}`)
  console.log(JSON.stringify({ ok: true, dshRevision: expectedRevision, profile, expectedTools, registeredToolCount: actual.length, loader: 'real profile boot', scope: 'tool registration through full profile Loader; no model call' }))
} finally {
  await ctx.fiber.dispose()
}

// Run from a pinned DSH checkout with: node --import tsx/esm <this-file> <installed-plugin-directory> <plugin-source-checkout>
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash, randomUUID } from 'node:crypto'
import { Context } from '@deepseek-ai/cordis'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { ToolCallId } from '@deepseek-ai/dsh-llm'

const dshRevision = process.env.DSH_EXPECTED_REVISION ?? '4878cdabd87d4041bdaff61d04c966883b9fd07a'
const pluginRevision = process.env.PLUGIN_EXPECTED_REVISION
assert.match(dshRevision, /^[a-f0-9]{40}$/)
assert.equal(process.argv.length, 4, 'provide installed plugin directory and source checkout')
const installed = resolve(process.argv[2])
const checkout = resolve(process.argv[3])
const git = (...args) => execFileSync('git', args, { timeout: 10000, maxBuffer: 1024 * 1024 })
assert.equal(git('rev-parse', 'HEAD').toString().trim(), dshRevision)
git('diff', '--exit-code', 'HEAD', '--', 'packages', 'vendor', 'tsconfig.base.json')
if (pluginRevision) assert.equal(git('-C', checkout, 'rev-parse', 'HEAD').toString().trim(), pluginRevision)
for (const file of ['index.js', 'lib/windows-readiness-proof.mjs', 'package.json']) {
  const expected = pluginRevision ? git('-C', checkout, 'show', `${pluginRevision}:${file}`) : await readFile(join(checkout, file))
  assert.deepEqual(await readFile(join(installed, file)), expected, `installed bytes differ: ${file}`)
}
const plugin = await import(pathToFileURL(join(installed, 'index.js')).href)
const workspaceRoot = await mkdtemp(join(tmpdir(), 'dsh-windows-readiness-business-'))
const generator = join(checkout, 'examples/create-sanitized-example.mjs')
const generated = JSON.parse(execFileSync(process.execPath, [generator, workspaceRoot], { timeout: 10000, maxBuffer: 1024 * 1024 }).toString())
const ctx = new Context()
try {
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(plugin, { workspaceRoot })
  const names = ctx.tools.schemas().map(x => x.name).sort()
  assert.deepEqual(names, ['dsh_windows_readiness_inspect', 'dsh_windows_readiness_verify'])
  const call = (name, args) => ctx.tools.execute({ signal: AbortSignal.timeout(10000), callId: ToolCallId(randomUUID()), name, arguments: args })
  const inspect = await call('dsh_windows_readiness_inspect', { manifestPath: generated.manifest })
  assert.equal(inspect.isError, false)
  const verified = await call('dsh_windows_readiness_verify', { manifestPath: generated.manifest, artifactDir: 'artifacts' })
  assert.equal(verified.isError, false)
  assert.equal(verified.value.status, 'verified')
  assert.equal(verified.value.controls.length, 26)
  assert.equal(verified.value.modifiesHost, false)
  const reportBytes = await readFile(join(workspaceRoot, verified.value.artifact.path))
  assert.equal(createHash('sha256').update(reportBytes).digest('hex'), verified.value.artifact.sha256)
  const traversal = await call('dsh_windows_readiness_verify', { manifestPath: '../manifest.json', artifactDir: 'artifacts' })
  assert.equal(traversal.isError, true)
  console.log(JSON.stringify({ ok: true, dshRevision, pluginRevision: pluginRevision ?? 'local-working-tree', names, cases: ['inspect', 'verified-readback', 'traversal-rejected'], reportSha256: verified.value.artifact.sha256, platform: process.platform, node: process.version, scope: 'ToolRuntime service only; not full profile Loader or model task' }))
} finally {
  await ctx.fiber.dispose()
}

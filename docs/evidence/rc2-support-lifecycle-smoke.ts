// Run from the isolated DSH checkout with: node --import tsx/esm <this-file> <installed-package-directory> <plugin-git-checkout>
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, writeFile, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash, randomUUID } from 'node:crypto'
import { Context } from '@deepseek-ai/cordis'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { ToolCallId } from '@deepseek-ai/dsh-llm'

const dshRevision = '477b4f420553e8a52c2fbccc464d7561b239c443'
const pluginRevision = 'df33364fee39fbb55b53b8c290df6b28d0f072c6'
assert.equal(process.argv.length, 4, 'provide installed package directory and plugin Git checkout')
const installed = resolve(process.argv[2])
const checkout = resolve(process.argv[3])
const git = (...args) => execFileSync('git', args, { timeout: 10000, maxBuffer: 1024 * 1024 })
assert.equal(git('rev-parse', 'HEAD').toString().trim(), dshRevision)
git('diff', '--exit-code', 'HEAD', '--', 'packages', 'vendor', 'tsconfig.base.json')
for (const file of ['index.js', 'lib/support-lifecycle-proof.mjs', 'package.json']) {
  assert.deepEqual(await readFile(join(installed, file)), git('-C', checkout, 'show', `${pluginRevision}:${file}`), `installed source differs: ${file}`)
}
const plugin = await import(pathToFileURL(join(installed, 'index.js')).href)
const workspaceRoot = await mkdtemp(join(tmpdir(), 'dsh-rc2-business-'))
const fixture = git('-C', checkout, 'show', `${pluginRevision}:examples/closed.json`).toString()
await writeFile(join(workspaceRoot, 'closed.json'), fixture, { flag: 'wx' })
const incomplete = JSON.parse(fixture)
incomplete.retirements = []
await writeFile(join(workspaceRoot, 'incomplete.json'), JSON.stringify(incomplete), { flag: 'wx' })
const ctx = new Context()
try {
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(plugin, { workspaceRoot })
  const tools = ctx.tools.schemas().map(x => x.name).sort()
  assert.deepEqual(tools, ['dsh_support_lifecycle_inspect', 'dsh_support_lifecycle_verify'])
  const call = (name, args) => ctx.tools.execute({ signal: AbortSignal.timeout(10000), callId: ToolCallId(randomUUID()), name, arguments: args })
  const inspect = await call('dsh_support_lifecycle_inspect', { manifestJson: fixture })
  assert.equal(inspect.isError, false)
  assert.equal(inspect.value.componentCount, 2)
  const closed = await call('dsh_support_lifecycle_verify', { manifestPath: 'closed.json', artifactDir: 'artifacts' })
  assert.equal(closed.isError, false)
  assert.equal(closed.value.verdict, 'support-lifecycle-closed')
  assert.equal(closed.value.artifact.verifiedByReadBack, true)
  const bytes = await readFile(join(workspaceRoot, closed.value.artifact.path))
  assert.equal(createHash('sha256').update(bytes).digest('hex'), closed.value.artifact.sha256)
  const missing = await call('dsh_support_lifecycle_verify', { manifestPath: 'incomplete.json', artifactDir: 'artifacts' })
  assert.equal(missing.isError, false)
  assert.equal(missing.value.verdict, 'not-closed')
  console.log(JSON.stringify({ ok: true, dshRevision, pluginRevision, tools, cases: ['inspect', 'closed-readback', 'missing-retirement'], reportSha256: closed.value.artifact.sha256, platform: process.platform, node: process.version, scope: 'real ToolRuntime service execution; no full profile Loader or Linux verification' }))
} finally { await ctx.fiber.dispose() }

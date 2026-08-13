import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyRepository, deriveReviewSignals, extractBundle, replaceGeneratedSection, resolveCategory } from '../scripts/lib.mjs'
import { appendRuntimeReport, sanitizeOutput, tail } from '../scripts/runtime-lib.mjs'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { analyzeCapability, inferEcosystem, mergeSearchHits, parseSkillFrontmatter } from '../scripts/capability-lib.mjs'

test('extractBundle verifies a root bundle and produces a GitHub install target', () => {
  const manifest = {
    __repository: 'owner/plugin',
    name: 'dsh-example',
    version: '1.0.0',
    dsh: { bundle: { patch: './cordis.patch.yml' } }
  }
  const result = extractBundle(manifest, 'package.json', new Set(['package.json', 'cordis.patch.yml']))
  assert.equal(result.patchExists, true)
  assert.equal(result.patchPath, 'cordis.patch.yml')
  assert.equal(result.installTarget, 'github:owner/plugin')
})

test('extractBundle does not verify a missing patch file', () => {
  const manifest = {
    __repository: 'owner/plugin',
    dsh: { bundle: { patch: './missing.yml' } }
  }
  const result = extractBundle(manifest, 'package.json', new Set(['package.json']))
  assert.equal(result.patchExists, false)
})

test('extractBundle ignores ordinary packages', () => {
  assert.equal(extractBundle({ name: 'library' }, 'package.json', new Set()), null)
})

test('static review signals retain evidence source without claiming certification', () => {
  const bundle = { dependencies: ['@modelcontextprotocol/sdk', 'playwright'] }
  const signals = deriveReviewSignals(bundle, 'service:\n  command: node\n  token: ${API_TOKEN}')
  assert.deepEqual(signals, [
    { id: 'secret-bearing-config', sources: ['patch'] },
    { id: 'process-execution', sources: ['patch'] },
    { id: 'network-or-browser', sources: ['dependencies'] },
    { id: 'mcp-external-tooling', sources: ['dependencies'] }
  ])
})

test('classification prefers specialist categories', () => {
  assert.equal(classifyRepository({ name: 'dsh-cad-review', full_name: 'x/dsh-cad-review', topics: [] }), 'cad-engineering')
  assert.equal(classifyRepository({ name: 'dsh-cost', full_name: 'x/dsh-cost', topics: ['token-budget'] }), 'token-cost')
  assert.equal(classifyRepository({ name: 'dsh-sidebar', full_name: 'x/dsh-sidebar', topics: ['web-ui'] }), 'ui-tui')
  assert.notEqual(classifyRepository({ name: 'dsh-agent-arcade', full_name: 'x/dsh-agent-arcade', topics: [] }), 'cad-engineering')
  assert.notEqual(classifyRepository({ name: 'vision', full_name: 'x/vision', topics: ['harness-engineering'] }), 'cad-engineering')
})

test('audited category overrides beat heuristics and retain their evidence', () => {
  const repository = { name: 'skillport', full_name: 'owner/skillport', topics: ['mcp-bridge'] }
  const override = {
    scope: 'repo', id: 'owner/skillport', category: 'developer-tools',
    reason: 'The repository compiles and transports skills.', source: 'https://example.com/README.md'
  }
  const result = resolveCategory(repository, [], [override], 'owner/skillport:package.json')
  assert.equal(result.category, 'developer-tools')
  assert.deepEqual(result.override, override)
})

test('plugin override wins over repository override', () => {
  const repository = { name: 'suite', full_name: 'owner/suite', topics: [] }
  const overrides = [
    { scope: 'repo', id: 'owner/suite', category: 'developer-tools' },
    { scope: 'plugin', id: 'owner/suite:finance/package.json', category: 'finance' }
  ]
  assert.equal(resolveCategory(repository, [], overrides, 'owner/suite:finance/package.json').category, 'finance')
})

test('generated sections preserve surrounding prose', () => {
  const source = 'before\n<!-- X:START -->\nold\n<!-- X:END -->\nafter\n'
  assert.equal(replaceGeneratedSection(source, 'X', 'new'), 'before\n<!-- X:START -->\nnew\n<!-- X:END -->\nafter\n')
})

test('runtime evidence sanitizes local paths and bounds command output', () => {
  assert.equal(sanitizeOutput('at C:\\secret\\home', [['C:\\secret\\home', '<HOME>']]), 'at <HOME>')
  assert.equal(tail('abcdef', 3), 'def')
})

test('runtime evidence store replaces the same immutable report id', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'awesome-dsh-test-'))
  const path = join(directory, 'runtime.json')
  await writeFile(path, '{"schemaVersion":1,"reports":[]}\n')
  const first = { id: 'same', checkedAt: '2026-01-01T00:00:00Z', status: 'failed' }
  const second = { id: 'same', checkedAt: '2026-01-02T00:00:00Z', status: 'passed' }
  await appendRuntimeReport(path, first)
  await appendRuntimeReport(path, second)
  const stored = JSON.parse(await readFile(path, 'utf8'))
  assert.deepEqual(stored.reports, [second])
})

test('capability analysis classifies self-contained instructions as copy with auditable scoring', () => {
  const result = analyzeCapability('---\nname: concise-review\ndescription: Review prose against a checklist.\n---\nReturn a concise report.', { repositoryLicense: 'MIT' })
  assert.equal(result.port.classification, 'copy')
  assert.equal(result.port.score, 85)
  assert.equal(result.metadata.license.source, 'github-repository')
  assert.deepEqual(result.evidence.bridge, [])
})

test('capability analysis requires wrapper evidence for scripts and bridge evidence for hooks', () => {
  const wrapper = analyzeCapability('---\nname: build\ndescription: Run the bundled checker.\n---\nRun node scripts/check.mjs.')
  assert.equal(wrapper.port.classification, 'wrapper')
  assert.equal(wrapper.evidence.executable[0].signal, 'script-reference')
  const bridge = analyzeCapability('---\nname: guard\ndescription: Gate dangerous actions.\n---\nInstall this as a PreToolUse hook in .claude/settings.json.')
  assert.equal(bridge.port.classification, 'bridge')
  assert.equal(bridge.port.score, 39)
  assert.equal(bridge.evidence.bridge[0].signal, 'harness-hook')
})

test('permission-bearing instructions cannot be presented as a direct copy', () => {
  const result = analyzeCapability('---\nname: remote\ndescription: Query a remote service.\n---\nSet API_KEY and use network access.')
  assert.equal(result.port.classification, 'wrapper')
  assert.equal(result.port.score, 65)
  assert.deepEqual(result.evidence.permissions.map(item => item.signal), ['network', 'secrets'])
})

test('frontmatter, ecosystem and duplicate search provenance remain observable', () => {
  assert.equal(parseSkillFrontmatter('---\nname: x\ndescription: y\n---\nbody').fields.name, 'x')
  assert.equal(inferEcosystem('.codex/skills/x/SKILL.md', 'unknown'), 'codex')
  const item = { repository: { full_name: 'owner/repo' }, path: 'SKILL.md', sha: 'a'.repeat(40) }
  assert.deepEqual(mergeSearchHits([{ id: 'openclaw', items: [item] }, { id: 'skillhub', items: [item] }])[0].queryIds, ['openclaw', 'skillhub'])
})

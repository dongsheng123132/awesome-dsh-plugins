import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyRepository, extractBundle, replaceGeneratedSection, resolveCategory } from '../scripts/lib.mjs'
import { appendRuntimeReport, sanitizeOutput, tail } from '../scripts/runtime-lib.mjs'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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

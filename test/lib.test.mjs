import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyRepository, collectUnscannableRepositories, deriveReviewSignals, describeMissingRuntimeTarget, extractBundle, radarIsPublishable, replaceGeneratedSection, resolveCategory } from '../scripts/lib.mjs'
import { appendRuntimeReport, sanitizeEnvironment, sanitizeOutput, tail, writeImmutableRuntimeArtifact } from '../scripts/runtime-lib.mjs'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { analyzeCapability, inferEcosystem, mergeSearchHits, parseSkillFrontmatter } from '../scripts/capability-lib.mjs'
import { expandRuntimeMatrix, loadRuntimeConfig, pinnedRepositories, validateRuntimeConfig } from '../scripts/runtime-matrix.mjs'
import { retryDelay } from '../scripts/github.mjs'

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
  assert.equal(sanitizeOutput('at C:\\secret\\home\\AppData', [['C:\\secret\\home\\AppData', '<APP_DATA>'], ['C:\\secret\\home', '<HOME>']]), 'at <APP_DATA>')
  assert.equal(tail('abcdef', 3), 'def')
})

test('runtime subprocess environment removes credential-shaped names', () => {
  assert.deepEqual(
    sanitizeEnvironment({ PATH: 'bin', API_KEY: 'x', GH_TOKEN: 'y', GITHUB_ENV: '/control', ACTIONS_RUNTIME_URL: 'https://control', NORMAL: 'z' }),
    { PATH: 'bin', NORMAL: 'z' }
  )
})

test('runtime artifacts are content-addressed and replay safe', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'awesome-dsh-artifact-test-'))
  const report = { id: 'sample', status: 'passed', stages: [] }
  const first = await writeImmutableRuntimeArtifact(directory, report)
  const second = await writeImmutableRuntimeArtifact(directory, report)
  assert.match(first.filename, /^runtime-[0-9a-f]{64}\.json$/)
  assert.equal(first.sha256, second.sha256)
  assert.equal(second.replayed, true)
  assert.deepEqual(JSON.parse(await readFile(join(directory, first.filename), 'utf8')), report)
})

test('runtime matrix requires pinned revisions and expands every platform-target pair', () => {
  const config = {
    schemaVersion: 1,
    dsh: { cloneUrl: 'https://github.com/deepseek-ai/deepseek-harness.git', revision: 'a'.repeat(40), packageManager: 'pnpm@11.7.0' },
    platforms: ['ubuntu-latest', 'windows-latest'],
    targets: [{
      id: 'plugin-one', sourcePluginId: 'owner/plugin:package.json', repository: 'owner/plugin', revision: 'b'.repeat(40),
      spec: `github:owner/plugin#${'b'.repeat(40)}`, allowBuild: '@owner/plugin', profile: 'web', enforcement: 'observe', selection: 'test', rationale: 'A sufficiently explicit test rationale.'
    }]
  }
  assert.equal(expandRuntimeMatrix(config).include.length, 2)
  assert.equal(expandRuntimeMatrix(config).include[0].enforcement, 'observe')
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], spec: 'github:owner/plugin' }] }), /pin repository and revision/)
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], enforcement: 'ignore' }] }), /observe or required/)
})

test('every runtime target repository stays inspectable outside the search window', async () => {
  const config = await loadRuntimeConfig()
  const pinned = new Set(pinnedRepositories(config))
  for (const target of config.targets) assert.ok(pinned.has(target.repository), `${target.id} is not pinned for inspection`)
  assert.deepEqual(pinnedRepositories({ targets: [{ repository: 'owner/one' }, { repository: 'owner/one' }] }), ['owner/one'])
  assert.deepEqual(pinnedRepositories({}), [])
  const discover = await readFile(new URL('../scripts/discover.mjs', import.meta.url), 'utf8')
  assert.ok(discover.includes('pinnedRepositories('), 'discover must inspect pinned repositories by name')
})

test('an unscannable pinned repository is not reported as a missing plugin', () => {
  const target = { id: 'skillport', repository: 'owner/plugin', sourcePluginId: 'owner/plugin:package.json' }
  const absent = describeMissingRuntimeTarget(target, collectUnscannableRepositories({}))
  assert.match(absent, /not present in the verified structural radar/)

  const throttled = collectUnscannableRepositories({ pinnedInspection: [{ repo: 'owner/plugin', reason: 'scan-error', error: 'GitHub 403' }] })
  const message = describeMissingRuntimeTarget(target, throttled)
  assert.match(message, /could not be scanned \(GitHub 403\)/)
  assert.doesNotMatch(message, /not present in the verified structural radar/)

  const unreachable = collectUnscannableRepositories({ pinnedUnreachable: [{ repo: 'owner/plugin' }] })
  assert.match(describeMissingRuntimeTarget(target, unreachable), /could not be scanned \(unreachable\)/)

  const discover = readFileSync(new URL('../scripts/discover.mjs', import.meta.url), 'utf8')
  assert.ok(discover.includes('repositories.unshift(repository)'), 'pinned repositories must be inspected before the bulk scan')
})

test('a sweep we could not complete is not published as a shrinking ecosystem', () => {
  assert.equal(radarIsPublishable(1000, 0).publishable, true)
  assert.equal(radarIsPublishable(1000, 200).publishable, true)
  assert.equal(radarIsPublishable(1000, 201).publishable, false)
  assert.equal(radarIsPublishable(1000, 1000).ratio, 1)
  assert.equal(radarIsPublishable(0, 0).publishable, false)
  const discover = readFileSync(new URL('../scripts/discover.mjs', import.meta.url), 'utf8')
  const guard = discover.indexOf('radarIsPublishable(')
  assert.ok(guard > 0 && guard < discover.indexOf("writeJson(new URL('../data/plugins.json'"), 'the guard must run before the radar is written')
})

test('search transport retries the timeouts the search API asks us to retry', async () => {
  const github = await readFile(new URL('../scripts/github.mjs', import.meta.url), 'utf8')
  for (const status of ['403', '408', '429']) {
    assert.ok(github.includes(`response.status === ${status}`), `${status} must stay retryable`)
  }
})

test('a secondary rate limit states its wait in the body, and that wait is a growing floor', () => {
  const noHeaders = { headers: { get: () => null } }
  // The body states a floor, not a gate: the limiter re-arms on every request, so a wait that only
  // matches the hint retries at the boundary and stays throttled. Add growing margin on top of it.
  // Observed twice: a 310ms hint cycling for five seconds, then an 8s hint that re-armed across all six retries.
  assert.equal(retryDelay(noHeaders, '{"message":"try again in 8s"}', 0), 9000)
  assert.equal(retryDelay(noHeaders, '{"message":"try again in 8s"}', 3), 16000)
  assert.equal(retryDelay(noHeaders, '{"message":"try again in 45s"}', 0), 46000)
  assert.equal(retryDelay({ headers: { get: name => (name === 'retry-after' ? '30' : null) } }, '', 0), 30000)
  assert.equal(retryDelay(noHeaders, '', 5), 32000)
})

test('runtime workflow delegates baseline build approval to the pinned DSH policy', async () => {
  const workflow = await readFile(new URL('../.github/workflows/runtime-compat.yml', import.meta.url), 'utf8')
  assert.ok(workflow.includes('pnpm --dir "$DSH_DIR" install --frozen-lockfile'))
  assert.ok(!workflow.includes('--ignore-scripts'))
  assert.ok(!workflow.includes('rebuild node-pty'))
  assert.ok(!workflow.includes('rebuild --pending node-pty'))
  assert.ok(workflow.includes('dsh-runtime-baseline-${{ runner.os }}-${{ needs.plan.outputs.dsh_revision }}-v4'))
  assert.ok(!workflow.includes('dsh-runtime-baseline-${{ runner.os }}-${{ needs.plan.outputs.dsh_revision }}-v3'))
  const rehydrate = 'pnpm --dir "$DSH_DIR" install --frozen-lockfile --offline --config.optimisticRepeatInstall=false'
  assert.equal(workflow.split(rehydrate).length - 1, 0)
  assert.equal(workflow.split('git clone --filter=blob:none --no-checkout "$DSH_CLONE_URL" "$DSH_DIR"').length - 1, 2)
  assert.ok(workflow.includes("if: runner.os != 'Windows'"))
  assert.ok(workflow.includes("if: runner.os == 'Windows' || steps.baseline-cache.outputs.cache-hit != 'true'"))
  assert.ok(workflow.includes("if: runner.os == 'Windows'"))
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

import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyRepository, collectUnscannableRepositories, deriveReviewSignals, describeMissingRuntimeTarget, extractBundle, radarIsPublishable, replaceGeneratedSection, resolveCategory } from '../scripts/lib.mjs'
import { appendRuntimeReport, classifyRuntimeFailure, declaredPackageEntrypoint, sanitizeEnvironment, sanitizeOutput, tail, writeImmutableRuntimeArtifact } from '../scripts/runtime-lib.mjs'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { allInitialInspectionsThrottled, analyzeCapability, capabilityScanHealth, inferEcosystem, inspectionStatusCounts, mergeSearchHits, parseSkillFrontmatter } from '../scripts/capability-lib.mjs'
import { classifyPreflightFailure, probeExternalPublicRepository } from '../scripts/capability-preflight.mjs'

test('capability preflight pins an external public file without reading its body', async () => {
  const paths = []
  const revision = 'a'.repeat(40)
  const result = await probeExternalPublicRepository(async path => {
    paths.push(path)
    if (paths.length === 1) return { full_name: 'deepseek-ai/deepseek-harness', default_branch: 'main' }
    if (paths.length === 2) return { sha: revision }
    return { type: 'file', encoding: 'base64', sha: 'b'.repeat(40), content: 'secret-that-must-not-appear' }
  })
  assert.deepEqual(paths, [
    '/repos/deepseek-ai/deepseek-harness',
    '/repos/deepseek-ai/deepseek-harness/commits/main',
    `/repos/deepseek-ai/deepseek-harness/contents/README.md?ref=${revision}`
  ])
  assert.equal(result.ok, true)
  assert.equal(JSON.stringify(result).includes('secret-that-must-not-appear'), false)
})

test('capability preflight discloses status but not response text or token', () => {
  const result = classifyPreflightFailure(new Error('GitHub 403 for https://api.github.com/repos/example: token-secret'))
  assert.deepEqual(result, { ok: false, reason: 'secondary-limit-or-permission-denial', httpStatus: 403, rateLimitRemaining: null, rateLimitReset: null, rateLimitResource: null })
  assert.deepEqual(classifyPreflightFailure({ httpStatus: 403, rateLimitRemaining: '0', rateLimitReset: '1791239000', rateLimitResource: 'core' }), {
    ok: false, reason: 'primary-rate-limit-exhausted', httpStatus: 403, rateLimitRemaining: 0, rateLimitReset: 1791239000, rateLimitResource: 'core'
  })
})

test('capability scan refuses an all-rate-limited snapshot', () => {
  assert.deepEqual(capabilityScanHealth({ uniqueHits: 246, capabilities: [], errors: Array(246).fill({}) }), {
    ok: false, reason: 'insufficient-successful-inspections'
  })
})

test('capability scan accepts disclosed partial failures only at majority coverage', () => {
  assert.equal(capabilityScanHealth({ uniqueHits: 10, capabilities: Array(5).fill({}), errors: Array(5).fill({}) }).ok, true)
  assert.equal(capabilityScanHealth({ uniqueHits: 10, capabilities: Array(4).fill({}), errors: Array(6).fill({}) }).ok, false)
})

test('capability scan rejects empty and incomplete observations', () => {
  assert.equal(capabilityScanHealth({ uniqueHits: 0, capabilities: [], errors: [] }).reason, 'no-search-hits')
  assert.equal(capabilityScanHealth({ uniqueHits: 4, capabilities: [{}], errors: [] }).reason, 'incomplete-inspection')
})

test('capability scan stops only a systemic initial throttle and reports counts without response bodies', () => {
  const blocked = [{ ok: false, error: { httpStatus: 403 } }, { ok: false, error: { httpStatus: 429 } }, { ok: false, error: { httpStatus: 403 } }]
  assert.equal(allInitialInspectionsThrottled(blocked), true)
  assert.equal(allInitialInspectionsThrottled(blocked.slice(0, 2)), false)
  assert.equal(allInitialInspectionsThrottled([...blocked, { ok: true, value: {} }]), false)
  assert.deepEqual(inspectionStatusCounts([{ httpStatus: 403, message: 'secret' }, { httpStatus: 403 }, { httpStatus: 404 }]), { 403: 2, 404: 1 })
})
import { expandBaselineMatrix, expandRuntimeMatrix, loadRuntimeConfig, pinnedRepositories, validateRuntimeConfig } from '../scripts/runtime-matrix.mjs'
import { reserveSearchSlot, retryDelay, REST_MIN_GAP_MS, SEARCH_MIN_GAP_MS, searchRepositories } from '../scripts/github.mjs'

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

test('runtime evidence separates missing package artifacts from DSH boot failures', () => {
  assert.equal(declaredPackageEntrypoint({ exports: { '.': { default: './lib/index.js' } }, main: './fallback.js' }), './lib/index.js')
  assert.equal(declaredPackageEntrypoint({ main: './dist/index.js' }), './dist/index.js')
  assert.equal(classifyRuntimeFailure({
    install: { ok: true }, compose: { ok: true }, boot: { ok: false },
    entrypoint: { declared: './lib/index.js', exists: false }, harnessBlocked: false, engineSatisfied: true
  }), 'package-artifact-missing')
  assert.equal(classifyRuntimeFailure({
    install: { ok: true }, compose: { ok: true }, boot: { ok: false },
    entrypoint: { declared: './lib/index.js', exists: true }, harnessBlocked: false, engineSatisfied: true
  }), 'boot-failed')
  assert.equal(classifyRuntimeFailure({ install: { ok: true }, compose: { ok: true }, boot: { ok: true } }), null)
})

test('runtime matrix requires pinned revisions and expands every baseline-platform-target tuple', () => {
  const config = {
    schemaVersion: 2,
    baselines: [
      { id: 'old', label: 'old baseline', cloneUrl: 'https://github.com/deepseek-ai/deepseek-harness.git', revision: 'a'.repeat(40), packageManager: 'pnpm@11.7.0' },
      { id: 'new', label: 'new baseline', cloneUrl: 'https://github.com/deepseek-ai/deepseek-harness.git', revision: 'c'.repeat(40), packageManager: 'pnpm@11.7.0' }
    ],
    platforms: ['ubuntu-latest', 'windows-latest'],
    targets: [{
      id: 'plugin-one', sourcePluginId: 'owner/plugin:package.json', repository: 'owner/plugin', revision: 'b'.repeat(40),
      spec: `github:owner/plugin#${'b'.repeat(40)}`, allowBuild: '@owner/plugin', profile: 'web', enforcement: 'observe', selection: 'test', rationale: 'A sufficiently explicit test rationale.'
    }]
  }
  assert.equal(expandRuntimeMatrix(config).include.length, 4)
  assert.equal(expandBaselineMatrix(config).include.length, 4)
  assert.deepEqual(new Set(expandRuntimeMatrix(config).include.map(item => item.baseline)), new Set(['old', 'new']))
  assert.equal(expandRuntimeMatrix(config).include[0].enforcement, 'observe')
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], spec: 'github:owner/plugin' }] }), /pin repository and revision/)
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], enforcement: 'ignore' }] }), /observe or required/)
  assert.throws(() => validateRuntimeConfig({ ...config, baselines: [...config.baselines, config.baselines[0]] }), /duplicate baseline id/)
  const scoped = { ...config, targets: [{ ...config.targets[0], baselineIds: ['new'] }] }
  assert.deepEqual(expandRuntimeMatrix(scoped).include.map(item => item.baseline), ['new', 'new'])
  assert.equal(expandBaselineMatrix(scoped).include.length, 4, 'stock controls still cover every baseline')
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], baselineIds: ['missing'] }] }), /unknown baselineId/)
  assert.throws(() => validateRuntimeConfig({ ...config, targets: [{ ...config.targets[0], baselineIds: ['old', 'old'] }] }), /baselineIds must be unique/)
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

test('code search pacing outlasts the observed rolling limiter window', () => {
  assert.ok(SEARCH_MIN_GAP_MS >= 8000)
  assert.ok(REST_MIN_GAP_MS >= 250)
})

test('unhinted GitHub secondary throttles cool down for at least one minute', () => {
  const throttled = { status: 403, headers: { get: () => null } }
  assert.equal(retryDelay(throttled, '{"message":"secondary rate limit"}', 0), 60000)
  assert.equal(retryDelay(throttled, '{"message":"secondary rate limit"}', 1), 120000)
})

test('concurrent search callers reserve different limiter slots before yielding', () => {
  const now = 1000
  const first = reserveSearchSlot(now, 0)
  const second = reserveSearchSlot(now, first.nextSearchAt)
  const third = reserveSearchSlot(now, second.nextSearchAt)
  assert.deepEqual([first.delayMs, second.delayMs, third.delayMs], [0, SEARCH_MIN_GAP_MS, SEARCH_MIN_GAP_MS * 2])
})

test('a repository the moving ranking shows on two pages is carried once', async () => {
  // Observed 2026-08-19: the sweep read the topic while it was gaining repositories, one crossed a
  // page boundary we had already passed, and the check announced "duplicate plugin id" against a
  // third-party repository. Nothing about the ecosystem had changed; our paging saw it twice.
  const pages = [
    [{ full_name: 'owner/a' }, { full_name: 'owner/b' }, { full_name: 'owner/b' }],
    [{ full_name: 'owner/b' }, { full_name: 'owner/c' }, { full_name: 'owner/d' }]
  ]
  const pageSizes = []
  const original = globalThis.fetch
  globalThis.fetch = async url => {
    const parameters = new URL(url).searchParams
    pageSizes.push(parameters.get('per_page'))
    return { ok: true, json: async () => ({ total_count: 8184, items: pages[Number(parameters.get('page')) - 1] ?? [] }) }
  }
  try {
    const { repositories, reportedTotal } = await searchRepositories('topic:dsh-plugin', 3)
    assert.deepEqual(repositories.map(repository => repository.full_name), ['owner/a', 'owner/b', 'owner/c'])
    assert.equal(reportedTotal, 8184, 'the reported total stays what the search claims, not what we kept')
    assert.deepEqual(pageSizes, ['3', '3'], 'page size must not shrink as duplicates are dropped, or the offsets misalign')
  } finally {
    globalThis.fetch = original
  }
})

test('runtime workflow delegates baseline build approval to the pinned DSH policy', async () => {
  const workflow = await readFile(new URL('../.github/workflows/runtime-compat.yml', import.meta.url), 'utf8')
  assert.ok(workflow.includes('pnpm --dir "$DSH_DIR" install --frozen-lockfile'))
  assert.ok(!workflow.includes('--ignore-scripts'))
  assert.ok(!workflow.includes('rebuild node-pty'))
  assert.ok(!workflow.includes('rebuild --pending node-pty'))
  assert.ok(workflow.includes('dsh-runtime-baseline-${{ runner.os }}-${{ matrix.dshRevision }}-v5'))
  assert.ok(workflow.includes('matrix: ${{ fromJSON(needs.plan.outputs.baseline_matrix) }}'))
  const rehydrate = 'pnpm --dir "$DSH_DIR" install --frozen-lockfile --offline --config.optimisticRepeatInstall=false'
  assert.equal(workflow.split(rehydrate).length - 1, 0)
  assert.equal(workflow.split('git clone --filter=blob:none --no-checkout "$DSH_CLONE_URL" "$DSH_DIR"').length - 1, 2)
  assert.ok(workflow.includes("if: runner.os != 'Windows'"))
  assert.ok(workflow.includes("if: runner.os == 'Windows' || steps.baseline-cache.outputs.cache-hit != 'true'"))
  assert.ok(workflow.includes("if: runner.os == 'Windows'"))
})

test('full-profile business CI replays RC2 and alpha on both operating systems', async () => {
  const workflow = await readFile(new URL('../.github/workflows/profile-business-parity.yml', import.meta.url), 'utf8')
  assert.ok(workflow.includes('os: [ubuntu-latest, windows-latest]'))
  assert.ok(workflow.includes('id: v0-2-0-rc-2\n            revision: 639ed015397290b3745d163aafe02ffee4aa3f84'))
  assert.ok(workflow.includes('id: v0-2-1-alpha-1\n            revision: 5badb15009ae1756c3afe0ae0cef1faafc290ccc'))
  assert.ok(workflow.includes('ref: ${{ matrix.baseline.revision }}'))
  assert.ok(workflow.includes('$env:DSH_REVISION $profile $support $windows'))
  assert.ok(workflow.includes('github:dongsheng123132/dsh-support-lifecycle-proof#df33364fee39fbb55b53b8c290df6b28d0f072c6'))
  assert.ok(workflow.includes('github:dongsheng123132/dsh-windows-readiness-proof#46cc6b8dbaa0f970ffa326615cb1e52683516929'))
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

test('a skill index pointing to nested SKILL.md files needs a wrapper, not a direct copy', () => {
  // Pinned source: https://github.com/TencentEdgeOne/edgeone-makers-tools/blob/008dd4dfd987de3d33932fe243db8e248d221c1d/SKILL.md
  const index = analyzeCapability('---\nname: edgeone-makers-tools\ndescription: Route platform tasks.\nlicense: MIT\n---\nRead skills/makers-agents/SKILL.md for Agent development.')
  assert.equal(index.port.classification, 'wrapper')
  assert.equal(index.evidence.resources[0].signal, 'nested-skill')
  assert.equal(index.port.score, 79)
  const standalone = analyzeCapability('---\nname: reference\ndescription: Read a website.\n---\nSee https://example.com/skills/reference/SKILL.md.')
  assert.equal(standalone.evidence.resources.some(item => item.signal === 'nested-skill'), false,
    'external URLs are not bundled relative dependencies')
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

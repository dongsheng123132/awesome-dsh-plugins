#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { CATEGORY_LABELS, readJson, REVIEW_SIGNAL_LABELS } from './lib.mjs'
import { validateRuntimeConfig } from './runtime-matrix.mjs'

const root = new URL('../', import.meta.url)
const radar = await readJson(new URL('data/plugins.json', root))
const candidates = await readJson(new URL('data/candidates.json', root))
const labs = await readJson(new URL('data/labs.json', root))
const categoryOverrides = await readJson(new URL('data/category-overrides.json', root))
const runtime = await readJson(new URL('data/runtime-compat.json', root))
const runtimeTargets = await readJson(new URL('data/runtime-targets.json', root))
const capabilities = await readJson(new URL('data/capabilities.json', root))
const failures = []

if (radar.schemaVersion !== 1) failures.push('data/plugins.json schemaVersion must be 1')
if (!Array.isArray(radar.plugins)) failures.push('data/plugins.json plugins must be an array')
if (!Array.isArray(candidates.candidates)) failures.push('data/candidates.json candidates must be an array')
if (!Array.isArray(labs.projects)) failures.push('data/labs.json projects must be an array')
if (categoryOverrides.schemaVersion !== 1 || !Array.isArray(categoryOverrides.overrides)) {
  failures.push('data/category-overrides.json must use schemaVersion 1 and an overrides array')
}
if (runtime.schemaVersion !== 1 || !Array.isArray(runtime.reports)) {
  failures.push('data/runtime-compat.json must use schemaVersion 1 and a reports array')
}
try {
  validateRuntimeConfig(runtimeTargets)
} catch (error) {
  failures.push(...String(error.message).split('\n').map(message => `runtime targets: ${message}`))
}
if (capabilities.schemaVersion !== 1 || !Array.isArray(capabilities.capabilities) || !Array.isArray(capabilities.errors)) {
  failures.push('data/capabilities.json must use schemaVersion 1 with capabilities and errors arrays')
}

const ids = new Set()
for (const plugin of radar.plugins || []) {
  if (ids.has(plugin.id)) failures.push(`duplicate plugin id: ${plugin.id}`)
  ids.add(plugin.id)
  if (!plugin.id?.startsWith(`${plugin.repo}:`)) failures.push(`${plugin.repo}: invalid plugin id`)
  if (plugin.verification?.status !== 'verified-bundle') failures.push(`${plugin.repo}: invalid verification status`)
  if (!plugin.verification?.manifestPath) failures.push(`${plugin.repo}: manifest evidence missing`)
  if (!plugin.verification?.patchPath) failures.push(`${plugin.repo}: patch evidence missing`)
  if (!CATEGORY_LABELS[plugin.category]) failures.push(`${plugin.repo}: unknown category ${plugin.category}`)
  if (!['signals-only', 'unavailable'].includes(plugin.reviewSignals?.status)) failures.push(`${plugin.repo}: invalid review signal status`)
  for (const signal of plugin.reviewSignals?.signals || []) {
    if (!REVIEW_SIGNAL_LABELS[signal.id]) failures.push(`${plugin.repo}: unknown review signal ${signal.id}`)
    if (!Array.isArray(signal.sources) || signal.sources.some(source => !['patch', 'dependencies'].includes(source))) {
      failures.push(`${plugin.repo}: invalid review signal evidence sources`)
    }
  }
  if (plugin.installCommand && !plugin.installCommand.startsWith('dsh plugin --profile ')) {
    failures.push(`${plugin.repo}: invalid install command`)
  }
}

const overrideKeys = new Set()
for (const override of categoryOverrides.overrides || []) {
  const key = `${override.scope}:${override.id}`
  if (overrideKeys.has(key)) failures.push(`duplicate category override: ${key}`)
  overrideKeys.add(key)
  if (!['repo', 'plugin'].includes(override.scope)) failures.push(`${key}: invalid scope`)
  if (!CATEGORY_LABELS[override.category]) failures.push(`${key}: unknown category ${override.category}`)
  if (typeof override.reason !== 'string' || override.reason.trim().length < 10) failures.push(`${key}: reason is required`)
  if (typeof override.source !== 'string' || !override.source.startsWith('https://')) failures.push(`${key}: HTTPS source is required`)
}

const reportIds = new Set()
for (const report of runtime.reports || []) {
  if (reportIds.has(report.id)) failures.push(`duplicate runtime report id: ${report.id}`)
  reportIds.add(report.id)
  if (!['passed', 'failed', 'blocked-environment', 'blocked-harness'].includes(report.status)) failures.push(`${report.id}: invalid runtime status`)
  if (!/^[0-9a-f]{40}$/i.test(report.dsh?.revision || '')) failures.push(`${report.id}: invalid DSH revision`)
  if (!report.package?.spec) failures.push(`${report.id}: package spec missing`)
  if (!Array.isArray(report.stages) || report.stages.length < 3) failures.push(`${report.id}: at least three stages required`)
}

const pluginIds = new Set((radar.plugins || []).map(plugin => plugin.id))
const knownLabIds = new Set((labs.projects || []).map(project => project.id))
for (const target of runtimeTargets.targets || []) {
  if (target.sourcePluginId && !pluginIds.has(target.sourcePluginId)) failures.push(`${target.id}: runtime target is not present in the verified structural radar`)
  if (target.sourceLabId && !knownLabIds.has(target.sourceLabId)) failures.push(`${target.id}: runtime target is not present in the 2Origin lab`)
}

const capabilityIds = new Set()
for (const capability of capabilities.capabilities || []) {
  if (capabilityIds.has(capability.id)) failures.push(`duplicate capability id: ${capability.id}`)
  capabilityIds.add(capability.id)
  if (!/^[0-9a-f]{40}$/i.test(capability.provenance?.revision || '')) failures.push(`${capability.id}: invalid revision`)
  if (!/^[0-9a-f]{40}$/i.test(capability.provenance?.blobSha || '')) failures.push(`${capability.id}: invalid blob SHA`)
  if (!/^[0-9a-f]{64}$/i.test(capability.content?.sha256 || '')) failures.push(`${capability.id}: invalid content SHA-256`)
  if (!['copy', 'wrapper', 'bridge', 'unclassified'].includes(capability.port?.classification)) {
    failures.push(`${capability.id}: invalid port classification`)
  }
  if (!Number.isInteger(capability.port?.score) || capability.port.score < 0 || capability.port.score > 100) {
    failures.push(`${capability.id}: invalid port score`)
  }
  const componentTotal = Object.values(capability.port?.components || {}).reduce((sum, value) => sum + value, 0)
  if (capability.port?.rawScore !== componentTotal) failures.push(`${capability.id}: score components do not match raw score`)
  const expectedCap = { copy: 100, wrapper: 79, bridge: 39, unclassified: 49 }[capability.port?.classification]
  if (capability.port?.classificationCap !== expectedCap || capability.port.score > expectedCap) {
    failures.push(`${capability.id}: classification score cap is not enforced`)
  }
  if (!['skill-frontmatter', 'github-repository', 'unobserved'].includes(capability.metadata?.license?.source)) {
    failures.push(`${capability.id}: invalid license evidence source`)
  }
}

const labIds = new Set()
for (const project of labs.projects || []) {
  if (labIds.has(project.id)) failures.push(`duplicate lab id: ${project.id}`)
  labIds.add(project.id)
  if (!['planned', 'experimental', 'verified', 'deprecated'].includes(project.status)) {
    failures.push(`${project.id}: invalid lab status ${project.status}`)
  }
  if (project.status === 'verified' && (!project.repo || project.evidence.length === 0)) {
    failures.push(`${project.id}: verified lab requires repo and evidence`)
  }
}

for (const filename of ['README.md', 'README.zh-CN.md']) {
  const readme = await readFile(new URL(filename, root), 'utf8')
  for (const marker of ['RADAR', 'CAPABILITIES', 'LABS']) {
    if (!readme.includes(`<!-- ${marker}:START -->`) || !readme.includes(`<!-- ${marker}:END -->`)) {
      failures.push(`${filename}: missing ${marker} markers`)
    }
  }
  if (radar.generatedAt && !readme.includes(radar.generatedAt)) {
    failures.push(`${filename}: generated snapshot timestamp is stale`)
  }
  if (capabilities.generatedAt && !readme.includes(capabilities.generatedAt)) {
    failures.push(`${filename}: generated capability snapshot timestamp is stale`)
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`)
  process.exit(1)
}
console.log(JSON.stringify({
  ok: true,
  verifiedBundles: radar.plugins.length,
  candidates: candidates.candidates.length,
  labs: labs.projects.length,
  runtimeReports: runtime.reports.length
  , runtimeTargets: runtimeTargets.targets?.length ?? 0
  , capabilityCandidates: capabilities.capabilities.length
}))

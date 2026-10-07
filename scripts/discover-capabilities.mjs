#!/usr/bin/env node
import { allInitialInspectionsThrottled, analyzeCapability, capabilityScanHealth, inferEcosystem, inspectionStatusCounts, mergeSearchHits } from './capability-lib.mjs'
import { githubJson, mapConcurrent, searchCode } from './github.mjs'
import { classifyPreflightFailure, probeExternalPublicRepository } from './capability-preflight.mjs'
import { parseIntegerFlag, writeJson } from './lib.mjs'

const argv = process.argv.slice(2)
const perSource = parseIntegerFlag(argv, '--per-source', 25)
const concurrency = parseIntegerFlag(argv, '--concurrency', 6)
const generatedAt = new Date().toISOString()
const queries = [
  { id: 'claude', query: 'filename:SKILL.md path:.claude/skills' },
  { id: 'codex', query: 'filename:SKILL.md path:.codex/skills' },
  { id: 'agents', query: 'filename:SKILL.md path:.agents/skills' },
  { id: 'openclaw', query: 'filename:SKILL.md openclaw' },
  { id: 'skillhub', query: 'filename:SKILL.md skillhub' }
]

const groups = []
for (const query of queries) {
  const result = await searchCode(query.query, perSource)
  groups.push({
    ...query,
    ...result,
    items: result.items.filter(item => item.path.split('/').at(-1)?.toLowerCase() === 'skill.md')
  })
}
const hits = mergeSearchHits(groups)
if (hits.length > 0) {
  // Code search can leave the token under a secondary limit even when a pre-search read passed.
  // Re-check a known public file before touching hundreds of candidate repositories. One bounded
  // cooldown is preferable to 245 identical per-file retry loops and cannot alter the old snapshot.
  try {
    await probeExternalPublicRepository()
  } catch (firstError) {
    const first = classifyPreflightFailure(firstError)
    if (![403, 429].includes(first.httpStatus)) {
      throw new Error(`Capability scan source unavailable after search: ${first.reason}; HTTP ${first.httpStatus ?? 'unknown'}`)
    }
    await new Promise(resolve => setTimeout(resolve, 60_000))
    try {
      await probeExternalPublicRepository()
    } catch (secondError) {
      const second = classifyPreflightFailure(secondError)
      throw new Error(`Capability scan source unavailable after cooldown: ${second.reason}; HTTP ${second.httpStatus ?? 'unknown'}`)
    }
  }
}
const repositoryCache = new Map()

async function repositoryFacts(repo) {
  if (!repositoryCache.has(repo)) {
    repositoryCache.set(repo, (async () => {
      const metadata = await githubJson(`/repos/${repo}`, { retries: 0 })
      const commit = await githubJson(`/repos/${repo}/commits/${encodeURIComponent(metadata.default_branch)}`, { retries: 0 })
      return { metadata, revision: commit.sha }
    })())
  }
  return repositoryCache.get(repo)
}

async function inspect(hit) {
  const repo = hit.repository.full_name
  try {
    const { metadata, revision } = await repositoryFacts(repo)
    const encodedPath = encodeURIComponent(hit.path).replaceAll('%2F', '/')
    const file = await githubJson(`/repos/${repo}/contents/${encodedPath}?ref=${revision}`, { retries: 0 })
    if (file.type !== 'file' || file.encoding !== 'base64') throw new Error('SKILL.md is not a base64 GitHub file response')
    const content = Buffer.from(String(file.content).replaceAll('\n', ''), 'base64').toString('utf8')
    if (Buffer.byteLength(content) > 256 * 1024) throw new Error('SKILL.md exceeds 256 KiB scan limit')
    const queryId = hit.queryIds[0]
    return {
      ok: true,
      value: {
        id: `${repo}:${hit.path}`,
        name: metadata.name,
        repo,
        url: `https://github.com/${repo}/blob/${revision}/${hit.path}`,
        path: hit.path,
        ecosystem: inferEcosystem(hit.path, queryId),
        ecosystemEvidence: hit.path.toLowerCase().includes(`.${queryId}/skills/`)
          ? { source: 'path', value: hit.path }
          : { source: 'search-query', value: hit.queryIds },
        discoveredBy: hit.queryIds,
        stars: metadata.stargazers_count,
        archived: metadata.archived,
        pushedAt: metadata.pushed_at,
        provenance: {
          repository: `https://github.com/${repo}`,
          revision,
          path: hit.path,
          blobSha: file.sha,
          searchBlobSha: hit.sha,
          searchBlobMatchesRevision: hit.sha === file.sha,
          observedAt: generatedAt
        },
        ...analyzeCapability(content, { repositoryLicense: metadata.license?.spdx_id || null })
      }
    }
  } catch (error) {
    const failure = classifyPreflightFailure(error)
    return { ok: false, error: { repo, path: hit.path, queryIds: hit.queryIds, reason: failure.reason, httpStatus: failure.httpStatus } }
  }
}

const initial = await mapConcurrent(hits.slice(0, 5), 1, inspect)
if (allInitialInspectionsThrottled(initial)) {
  throw new Error(`Capability scan stopped after ${initial.length} consecutive throttled inspections; prior snapshot preserved`)
}
const inspected = [...initial, ...await mapConcurrent(hits.slice(initial.length), concurrency, inspect)]
const capabilities = inspected.filter(item => item.ok).map(item => item.value)
  .sort((left, right) => right.port.score - left.port.score || right.stars - left.stars || left.id.localeCompare(right.id))
const errors = inspected.filter(item => !item.ok).map(item => item.error)
const health = capabilityScanHealth({ uniqueHits: hits.length, capabilities, errors })
if (!health.ok) {
  const statusCounts = inspectionStatusCounts(errors)
  throw new Error(`Capability scan refused to replace snapshot: ${health.reason}; ${capabilities.length}/${hits.length} inspected successfully; failureStatusCounts=${JSON.stringify(statusCounts)}`)
}

await writeJson(new URL('../data/capabilities.json', import.meta.url), {
  schemaVersion: 1,
  generatedAt,
  score: {
    name: 'Capability Port Score',
    version: 1,
    range: [0, 100],
    meaning: 'Higher means less observed adaptation work. It is triage, not compatibility, safety, quality, or license clearance.'
  },
  source: {
    queries: groups.map(group => ({ id: group.id, query: group.query, reportedTotal: group.reportedTotal, examined: group.items.length })),
    uniqueHits: hits.length
  },
  capabilities,
  errors
})

console.log(JSON.stringify({
  ok: true,
  generatedAt,
  uniqueHits: hits.length,
  capabilities: capabilities.length,
  errors: errors.length,
  classes: Object.fromEntries(['copy', 'wrapper', 'bridge', 'unclassified'].map(kind => [kind, capabilities.filter(item => item.port.classification === kind).length]))
}))

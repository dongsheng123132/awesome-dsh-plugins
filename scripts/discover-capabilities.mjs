#!/usr/bin/env node
import { analyzeCapability, inferEcosystem, mergeSearchHits } from './capability-lib.mjs'
import { githubJson, mapConcurrent, searchCode } from './github.mjs'
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
const repositoryCache = new Map()

async function repositoryFacts(repo) {
  if (!repositoryCache.has(repo)) {
    repositoryCache.set(repo, (async () => {
      const metadata = await githubJson(`/repos/${repo}`)
      const commit = await githubJson(`/repos/${repo}/commits/${encodeURIComponent(metadata.default_branch)}`)
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
    const file = await githubJson(`/repos/${repo}/contents/${encodedPath}?ref=${revision}`)
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
    return { ok: false, error: { repo, path: hit.path, queryIds: hit.queryIds, message: error.message } }
  }
}

const inspected = await mapConcurrent(hits, concurrency, inspect)
const capabilities = inspected.filter(item => item.ok).map(item => item.value)
  .sort((left, right) => right.port.score - left.port.score || right.stars - left.stars || left.id.localeCompare(right.id))
const errors = inspected.filter(item => !item.ok).map(item => item.error)

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

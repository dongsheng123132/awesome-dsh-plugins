#!/usr/bin/env node
import { posix } from 'node:path'
import { deriveReviewSignals, extractBundle, parseIntegerFlag, readJson, resolveCategory, writeJson } from './lib.mjs'
import { githubJson, githubText, mapConcurrent, searchRepositories } from './github.mjs'
import { pinnedRepositories } from './runtime-matrix.mjs'

const argv = process.argv.slice(2)
const positional = argv.filter(value => /^\d+$/.test(value)).map(value => Number.parseInt(value, 10))
const limit = parseIntegerFlag(argv, '--limit', positional[0] || 1000)
const concurrency = parseIntegerFlag(argv, '--concurrency', positional[1] || 8)
const verbose = argv.includes('--verbose')
const query = 'topic:dsh-plugin'
const generatedAt = new Date().toISOString()
const excludedRepositories = new Set(['deepseek-ai/deepseek-harness'])
const categoryOverrides = (await readJson(new URL('../data/category-overrides.json', import.meta.url))).overrides

async function inspectRepository(repository, index) {
  const repo = repository.full_name
  if (verbose || (index + 1) % 25 === 0) process.stderr.write(`[${index + 1}/${limit}] ${repo}\n`)
  try {
    const tree = await githubJson(`/repos/${repo}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`)
    const entries = Array.isArray(tree.tree) ? tree.tree : []
    const treePaths = new Set(entries.filter(item => item.type === 'blob').map(item => item.path))
    const manifestPaths = entries
      .filter(item => item.type === 'blob' && posix.basename(item.path) === 'package.json')
      .filter(item => !item.path.includes('node_modules/') && item.path.split('/').length <= 6)
      .slice(0, 30)
      .map(item => item.path)

    const manifests = []
    for (const manifestPath of manifestPaths) {
      let manifest
      try {
        manifest = JSON.parse(await githubText(`/repos/${repo}/contents/${encodeURIComponent(manifestPath).replaceAll('%2F', '/')}?ref=${encodeURIComponent(repository.default_branch)}`))
      } catch {
        continue
      }
      manifest.__repository = repo
      const bundle = extractBundle(manifest, manifestPath, treePaths)
      if (bundle) manifests.push(bundle)
    }

    const validBundles = manifests.filter(item => item.patchExists)
    const patchScans = new Map()
    for (const bundle of validBundles) {
      if (!patchScans.has(bundle.patchPath)) {
        try {
          const patchText = await githubText(`/repos/${repo}/contents/${encodeURIComponent(bundle.patchPath).replaceAll('%2F', '/')}?ref=${encodeURIComponent(repository.default_branch)}`)
          patchScans.set(bundle.patchPath, { status: 'signals-only', signals: deriveReviewSignals(bundle, patchText) })
        } catch (error) {
          patchScans.set(bundle.patchPath, { status: 'unavailable', signals: [], error: error.message })
        }
      }
    }
    const base = {
      repo,
      name: repository.name,
      url: repository.html_url,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      license: repository.license?.spdx_id || null,
      archived: repository.archived,
      treeTruncated: tree.truncated === true,
      defaultBranch: repository.default_branch,
      pushedAt: repository.pushed_at,
      updatedAt: repository.updated_at,
      topics: repository.topics || [],
      manifests,
      checkedAt: generatedAt
    }

    if (validBundles.length > 0 && !excludedRepositories.has(repo)) {
      return {
        type: 'plugins',
        values: validBundles.map(bundle => {
          const id = `${repo}:${bundle.manifestPath}`
          const classification = resolveCategory(repository, [bundle], categoryOverrides, id)
          return {
          ...base,
          id,
          name: bundle.packageName || repository.name,
          description: bundle.description || repository.description,
          category: classification.category,
          ...(classification.override === null ? {} : { categoryOverride: classification.override }),
          repositoryBundleCount: validBundles.length,
          verification: {
            status: 'verified-bundle',
            manifestPath: bundle.manifestPath,
            patchPath: bundle.patchPath,
            checkedAt: generatedAt
          },
          reviewSignals: {
            ...patchScans.get(bundle.patchPath),
            checkedAt: generatedAt,
            disclaimer: 'Static triage signals only; not a security certification.'
          },
          installTarget: bundle.installTarget,
          installCommand: bundle.installTarget
            ? `dsh plugin --profile web add ${bundle.installTarget}`
            : null
          }
        })
      }
    }

    return {
      type: 'candidate',
      value: {
        ...base,
        reason: excludedRepositories.has(repo)
          ? 'official-harness-source'
          : manifests.length > 0 ? 'bundle-patch-missing' : 'no-dsh-bundle-manifest'
      }
    }
  } catch (error) {
    return {
      type: 'candidate',
      value: {
        repo,
        name: repository.name,
        url: repository.html_url,
        description: repository.description,
        stars: repository.stargazers_count,
        reason: 'scan-error',
        error: error.message,
        checkedAt: generatedAt
      }
    }
  }
}

const { repositories, reportedTotal } = await searchRepositories(query, limit)

// GitHub search returns at most 1000 results, ranked by stars. Repositories we already pinned a
// runtime report against can fall out of that window as the topic grows, and the resulting radar
// gap is a limit of the instrument, not evidence that the plugin disappeared. Inspect them by name.
const pinned = pinnedRepositories(await readJson(new URL('../data/runtime-targets.json', import.meta.url)))
const knownRepositories = new Set(repositories.map(repository => repository.full_name))
const pinnedOutsideSearchWindow = []
const pinnedUnreachable = []
const pinnedNames = new Set()
for (const repo of pinned) {
  if (knownRepositories.has(repo)) {
    pinnedNames.add(repo)
    continue
  }
  try {
    const repository = await githubJson(`/repos/${repo}`)
    if (knownRepositories.has(repository.full_name)) continue
    knownRepositories.add(repository.full_name)
    // Ahead of the bulk scan: a thousand concurrent tree reads exhaust the API budget, and a pinned
    // repository that gets throttled comes back looking exactly like a repository with no bundle.
    repositories.unshift(repository)
    pinnedNames.add(repository.full_name)
    pinnedOutsideSearchWindow.push(repository.full_name)
  } catch (error) {
    pinnedUnreachable.push({ repo, error: error.message })
    process.stderr.write(`pinned repository unreachable: ${repo}: ${error.message}\n`)
  }
}

const inspected = await mapConcurrent(repositories, concurrency, inspectRepository)

// A pinned repository that fails to scan must not be filed as "no DSH bundle here". Keep the
// distinction the radar check will need: unscannable is an instrument failure, absent is a finding.
const pinnedInspection = []
for (const [index, repository] of repositories.entries()) {
  if (!pinnedNames.has(repository.full_name)) continue
  const item = inspected[index]
  if (item?.type === 'plugins') continue
  pinnedInspection.push({ repo: repository.full_name, reason: item?.value?.reason ?? 'not-inspected', error: item?.value?.error })
  process.stderr.write(`pinned repository not promoted: ${repository.full_name}: ${item?.value?.reason ?? 'not-inspected'}\n`)
}
const plugins = inspected.filter(item => item.type === 'plugins').flatMap(item => item.values)
  .sort((left, right) => right.stars - left.stars || left.id.localeCompare(right.id))
const candidates = inspected.filter(item => item.type === 'candidate').map(item => item.value)
  .sort((left, right) => right.stars - left.stars || left.repo.localeCompare(right.repo))

await writeJson(new URL('../data/plugins.json', import.meta.url), {
  schemaVersion: 1,
  generatedAt,
  source: {
    query,
    examined: repositories.length,
    searchWindow: repositories.length - pinnedOutsideSearchWindow.length,
    reportedTotal,
    pinnedOutsideSearchWindow,
    ...(pinnedUnreachable.length > 0 ? { pinnedUnreachable } : {}),
    ...(pinnedInspection.length > 0 ? { pinnedInspection } : {})
  },
  plugins
})
await writeJson(new URL('../data/candidates.json', import.meta.url), {
  schemaVersion: 1,
  generatedAt,
  candidates
})

console.log(JSON.stringify({
  ok: true,
  generatedAt,
  reportedTotal,
  examined: repositories.length,
  pinnedOutsideSearchWindow: pinnedOutsideSearchWindow.length,
  pinnedUnreachable: pinnedUnreachable.length,
  verifiedBundles: plugins.length,
  candidates: candidates.length
}))

#!/usr/bin/env node
import { posix } from 'node:path'
import { classifyRepository, extractBundle, parseIntegerFlag, writeJson } from './lib.mjs'
import { githubJson, githubText, mapConcurrent, searchRepositories } from './github.mjs'

const argv = process.argv.slice(2)
const positional = argv.filter(value => /^\d+$/.test(value)).map(value => Number.parseInt(value, 10))
const limit = parseIntegerFlag(argv, '--limit', positional[0] || 1000)
const concurrency = parseIntegerFlag(argv, '--concurrency', positional[1] || 8)
const verbose = argv.includes('--verbose')
const query = 'topic:dsh-plugin'
const generatedAt = new Date().toISOString()
const excludedRepositories = new Set(['deepseek-ai/deepseek-harness'])

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
          const category = classifyRepository(repository, [bundle])
          return {
          ...base,
          id: `${repo}:${bundle.manifestPath}`,
          name: bundle.packageName || repository.name,
          description: bundle.description || repository.description,
          category,
          repositoryBundleCount: validBundles.length,
          verification: {
            status: 'verified-bundle',
            manifestPath: bundle.manifestPath,
            patchPath: bundle.patchPath,
            checkedAt: generatedAt
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
const inspected = await mapConcurrent(repositories, concurrency, inspectRepository)
const plugins = inspected.filter(item => item.type === 'plugins').flatMap(item => item.values)
  .sort((left, right) => right.stars - left.stars || left.id.localeCompare(right.id))
const candidates = inspected.filter(item => item.type === 'candidate').map(item => item.value)
  .sort((left, right) => right.stars - left.stars || left.repo.localeCompare(right.repo))

await writeJson(new URL('../data/plugins.json', import.meta.url), {
  schemaVersion: 1,
  generatedAt,
  source: { query, examined: repositories.length, reportedTotal },
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
  verifiedBundles: plugins.length,
  candidates: candidates.length
}))

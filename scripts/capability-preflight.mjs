#!/usr/bin/env node
import { pathToFileURL } from 'node:url'
import { githubRequest } from './github.mjs'

const PUBLIC_REPO = 'deepseek-ai/deepseek-harness'

const readOnce = async path => (await githubRequest(path, { retries: 0 })).json()

export async function probeExternalPublicRepository(readJson = readOnce) {
  const repository = await readJson(`/repos/${PUBLIC_REPO}`)
  if (repository.full_name !== PUBLIC_REPO || !repository.default_branch) {
    throw new Error('unexpected-public-repository-metadata')
  }
  const commit = await readJson(`/repos/${PUBLIC_REPO}/commits/${encodeURIComponent(repository.default_branch)}`)
  if (!/^[a-f0-9]{40}$/i.test(commit.sha || '')) throw new Error('missing-public-revision')
  const file = await readJson(`/repos/${PUBLIC_REPO}/contents/README.md?ref=${commit.sha}`)
  if (file.type !== 'file' || file.encoding !== 'base64' || !/^[a-f0-9]{40}$/i.test(file.sha || '')) {
    throw new Error('missing-public-file-evidence')
  }
  return { ok: true, repository: PUBLIC_REPO, revision: commit.sha, path: 'README.md', blobSha: file.sha }
}

export function classifyPreflightFailure(error) {
  const status = /^GitHub (\d{3})\b/.exec(String(error?.message || ''))?.[1]
  return { ok: false, reason: status ? 'external-public-read-http-error' : 'external-public-read-invalid-response', httpStatus: status ? Number(status) : null }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await probeExternalPublicRepository()))
  } catch (error) {
    console.error(JSON.stringify(classifyPreflightFailure(error)))
    process.exitCode = 1
  }
}

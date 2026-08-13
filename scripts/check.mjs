#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { CATEGORY_LABELS, readJson } from './lib.mjs'

const root = new URL('../', import.meta.url)
const radar = await readJson(new URL('data/plugins.json', root))
const candidates = await readJson(new URL('data/candidates.json', root))
const labs = await readJson(new URL('data/labs.json', root))
const failures = []

if (radar.schemaVersion !== 1) failures.push('data/plugins.json schemaVersion must be 1')
if (!Array.isArray(radar.plugins)) failures.push('data/plugins.json plugins must be an array')
if (!Array.isArray(candidates.candidates)) failures.push('data/candidates.json candidates must be an array')
if (!Array.isArray(labs.projects)) failures.push('data/labs.json projects must be an array')

const ids = new Set()
for (const plugin of radar.plugins || []) {
  if (ids.has(plugin.id)) failures.push(`duplicate plugin id: ${plugin.id}`)
  ids.add(plugin.id)
  if (!plugin.id?.startsWith(`${plugin.repo}:`)) failures.push(`${plugin.repo}: invalid plugin id`)
  if (plugin.verification?.status !== 'verified-bundle') failures.push(`${plugin.repo}: invalid verification status`)
  if (!plugin.verification?.manifestPath) failures.push(`${plugin.repo}: manifest evidence missing`)
  if (!plugin.verification?.patchPath) failures.push(`${plugin.repo}: patch evidence missing`)
  if (!CATEGORY_LABELS[plugin.category]) failures.push(`${plugin.repo}: unknown category ${plugin.category}`)
  if (plugin.installCommand && !plugin.installCommand.startsWith('dsh plugin --profile ')) {
    failures.push(`${plugin.repo}: invalid install command`)
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
  for (const marker of ['RADAR', 'LABS']) {
    if (!readme.includes(`<!-- ${marker}:START -->`) || !readme.includes(`<!-- ${marker}:END -->`)) {
      failures.push(`${filename}: missing ${marker} markers`)
    }
  }
  if (radar.generatedAt && !readme.includes(radar.generatedAt)) {
    failures.push(`${filename}: generated snapshot timestamp is stale`)
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
  labs: labs.projects.length
}))

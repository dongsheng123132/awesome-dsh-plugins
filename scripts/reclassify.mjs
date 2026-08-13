#!/usr/bin/env node
import { classifyRepository, readJson, writeJson } from './lib.mjs'

const path = new URL('../data/plugins.json', import.meta.url)
const radar = await readJson(path)
for (const plugin of radar.plugins) {
  const repository = {
    name: plugin.repo.split('/').at(-1),
    full_name: plugin.repo,
    description: plugin.description,
    topics: plugin.topics || []
  }
  const manifest = plugin.manifests.find(item => item.manifestPath === plugin.verification.manifestPath)
  plugin.category = classifyRepository(repository, manifest ? [manifest] : [])
}
await writeJson(path, radar)
console.log(JSON.stringify({ ok: true, reclassified: radar.plugins.length }))

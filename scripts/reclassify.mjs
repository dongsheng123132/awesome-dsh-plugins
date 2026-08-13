#!/usr/bin/env node
import { readJson, resolveCategory, writeJson } from './lib.mjs'

const path = new URL('../data/plugins.json', import.meta.url)
const radar = await readJson(path)
const overrides = (await readJson(new URL('../data/category-overrides.json', import.meta.url))).overrides
for (const plugin of radar.plugins) {
  const repository = {
    name: plugin.repo.split('/').at(-1),
    full_name: plugin.repo,
    description: plugin.description,
    topics: plugin.topics || []
  }
  const manifest = plugin.manifests.find(item => item.manifestPath === plugin.verification.manifestPath)
  const classification = resolveCategory(repository, manifest ? [manifest] : [], overrides, plugin.id)
  plugin.category = classification.category
  if (classification.override === null) delete plugin.categoryOverride
  else plugin.categoryOverride = classification.override
}
await writeJson(path, radar)
console.log(JSON.stringify({ ok: true, reclassified: radar.plugins.length }))

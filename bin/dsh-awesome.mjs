#!/usr/bin/env node
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const radar = JSON.parse(await readFile(new URL('data/plugins.json', root), 'utf8'))
const labs = JSON.parse(await readFile(new URL('data/labs.json', root), 'utf8'))
const argv = process.argv.slice(2)
const command = argv[0] || 'help'
const json = argv.includes('--json')
const limitFlag = argv.indexOf('--limit')
const limit = limitFlag === -1 ? 20 : Number.parseInt(argv[limitFlag + 1], 10)

function printable(plugin) {
  return {
    id: plugin.id,
    name: plugin.name,
    repo: plugin.repo,
    description: plugin.description,
    category: plugin.category,
    stars: plugin.stars,
    license: plugin.license,
    install: plugin.installCommand,
    evidence: `${plugin.verification.manifestPath} -> ${plugin.verification.patchPath}`,
    url: plugin.url
  }
}

function output(items) {
  const sliced = items.slice(0, Number.isInteger(limit) && limit > 0 ? limit : 20)
  if (json) {
    console.log(JSON.stringify(sliced, null, 2))
    return
  }
  if (sliced.length === 0) {
    console.log('No matching plugins.')
    return
  }
  for (const item of sliced) {
    if (item.repo) {
      console.log(`${item.name}  ★${item.stars}  ${item.category}`)
      if (item.name !== item.repo) console.log(`  ${item.repo}`)
      console.log(`  ${item.description || 'No description'}`)
      console.log(`  ${item.install || item.url}`)
    } else {
      console.log(`${item.name}  ${item.status}  ${item.category}`)
      console.log(`  ${item.summary}`)
    }
  }
}

function uniqueRepositories(items) {
  const seen = new Set()
  return items.filter(item => {
    if (seen.has(item.repo)) return false
    seen.add(item.repo)
    return true
  })
}

switch (command) {
  case 'search': {
    const query = argv[1]?.toLowerCase()
    if (!query || query.startsWith('--')) throw new Error('search requires a query')
    const results = radar.plugins
      .filter(plugin => [plugin.repo, plugin.description, plugin.category, ...(plugin.topics || [])]
        .filter(Boolean).join(' ').toLowerCase().includes(query))
      .map(printable)
    output(results)
    break
  }
  case 'trending':
    output(uniqueRepositories(radar.plugins).map(printable))
    break
  case 'verified':
    output(radar.plugins.map(printable))
    break
  case 'new':
    output([...radar.plugins].sort((left, right) => String(right.pushedAt).localeCompare(String(left.pushedAt))).map(printable))
    break
  case 'experimental':
    output(labs.projects)
    break
  case 'help':
    console.log(`dsh-awesome <command> [options]\n\nCommands:\n  search <query>   Search verified bundles\n  trending        Rank verified bundles by stars\n  new             Show recently pushed bundles\n  verified        List structurally verified bundles\n  experimental    Show the 2Origin plugin lab\n\nOptions:\n  --limit <n>      Limit results (default 20)\n  --json           Emit JSON`)
    break
  default:
    throw new Error(`unknown command: ${command}`)
}

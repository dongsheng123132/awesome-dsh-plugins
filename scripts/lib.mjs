import { readFile, writeFile } from 'node:fs/promises'
import { dirname, posix } from 'node:path'

export const CATEGORY_LABELS = Object.freeze({
  'model-routing': 'Model & Routing',
  'token-cost': 'Token & Cost',
  coding: 'Coding',
  research: 'Research',
  browser: 'Browser',
  memory: 'Memory',
  'long-running': 'Long-running',
  office: 'Office',
  'cad-engineering': 'CAD / Engineering',
  'writing-novel': 'Writing / Novel',
  finance: 'Finance',
  security: 'Security',
  'mcp-bridge': 'MCP Bridge',
  'ui-tui': 'UI / TUI',
  'developer-tools': 'Developer Tools',
  other: 'Other'
})

const CATEGORY_RULES = [
  ['token-cost', ['token', 'cost', 'usage', 'meter', 'budget', 'billing']],
  ['model-routing', ['model route', 'router', 'provider', 'fallback', 'gateway']],
  ['cad-engineering', ['cad', 'dxf', 'dwg', 'drawing review', 'blueprint', 'mechanical', 'aec', 'bim']],
  ['writing-novel', ['novel', 'story', 'writing', 'character', 'roleplay', 'tavern']],
  ['finance', ['finance', 'stock', 'trading', 'market', 'econometric', 'stata']],
  ['security', ['security', 'guardrail', 'audit', 'sandbox', 'permission', 'secret']],
  ['browser', ['browser', 'chrome', 'playwright', 'web review', 'webview']],
  ['office', ['office', 'spreadsheet', 'excel', 'powerpoint', 'document', 'pdf']],
  ['memory', ['memory', 'knowledge', 'obsidian', 'context recall', 'mnemon']],
  ['long-running', ['workflow', 'scheduler', 'scheduled task', 'long-running', 'background', 'agent team']],
  ['mcp-bridge', ['mcp', 'model context protocol', 'acp', 'bridge', 'interconnect']],
  ['ui-tui', ['ui', 'tui', 'theme', 'skin', 'sidebar', 'panel', 'terminal', 'visual']],
  ['research', ['research', 'paper', 'academic', 'science', 'theorem', 'literature']],
  ['coding', ['coding', 'code intelligence', 'git', 'debug', 'lsp', 'reverse engineer']],
  ['developer-tools', ['developer', 'toolkit', 'plugin dev', 'diagnostic', 'profil', 'runtime', 'ops']]
]

export function classifyRepository(repository, manifests = []) {
  const primary = [
    repository.name,
    repository.full_name,
    repository.description,
    ...manifests.flatMap(item => [item.packageName, item.description])
  ].filter(Boolean).join(' ').toLowerCase()
  const secondary = [
    ...(repository.topics || []),
    ...manifests.flatMap(item => item.keywords || [])
  ].filter(Boolean).join(' ').toLowerCase()

  const matchesTerm = term => {
    const pattern = term
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .trim()
      .split(/[\s_-]+/)
      .join('[\\s_-]+')
    return new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, 'i')
  }

  let best = { category: 'other', score: 0 }
  for (const [category, terms] of CATEGORY_RULES) {
    const score = terms.reduce((sum, term) => {
      const pattern = matchesTerm(term)
      return sum + (pattern.test(primary) ? 3 : pattern.test(secondary) ? 1 : 0)
    }, 0)
    if (score > best.score) best = { category, score }
  }
  return best.score >= 2 ? best.category : 'other'
}

export function extractBundle(manifest, manifestPath, treePaths) {
  const patch = manifest?.dsh?.bundle?.patch
  if (typeof patch !== 'string' || patch.trim() === '') return null

  const base = dirname(manifestPath).replaceAll('\\', '/')
  const patchPath = posix.normalize(posix.join(base === '.' ? '' : base, patch))
  const patchExists = treePaths.has(patchPath)
  const packageName = typeof manifest.name === 'string' ? manifest.name : null
  const rootPackage = manifestPath === 'package.json'
  const installTarget = rootPackage ? `github:${manifest.__repository}` : null

  return {
    manifestPath,
    patchPath,
    patchExists,
    packageName,
    packageVersion: typeof manifest.version === 'string' ? manifest.version : null,
    private: manifest.private === true,
    installTarget,
    description: typeof manifest.description === 'string' ? manifest.description : null,
    keywords: Array.isArray(manifest.keywords) ? manifest.keywords.filter(item => typeof item === 'string') : []
  }
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

export async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export function parseIntegerFlag(argv, flag, fallback) {
  const index = argv.indexOf(flag)
  if (index === -1) return fallback
  const value = Number.parseInt(argv[index + 1], 10)
  if (!Number.isInteger(value) || value < 1) throw new Error(`${flag} requires a positive integer`)
  return value
}

export function replaceGeneratedSection(source, name, body) {
  const start = `<!-- ${name}:START -->`
  const end = `<!-- ${name}:END -->`
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end)
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`missing generated section ${name}`)
  }
  return `${source.slice(0, startIndex + start.length)}\n${body.trim()}\n${source.slice(endIndex)}`
}

export function markdownEscape(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ')
}

const API_ROOT = 'https://api.github.com'

function headers(accept = 'application/vnd.github+json') {
  const result = {
    Accept: accept,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'awesome-dsh-plugins-radar'
  }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

async function wait(milliseconds) {
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}

const SEARCH_PATH = '/search/'
// GitHub code search enforced an approximately eight-second rolling window on the 2026-08-25
// scheduled run ("try again in 7.768s"). Stay beyond the observed gate instead of exhausting the
// retry budget across the ordinary five-query capability sweep.
export const SEARCH_MIN_GAP_MS = 8000
const SEARCH_RETRIES = 6
let nextSearchAt = 0

export function reserveSearchSlot(now, currentNextAt, gap = SEARCH_MIN_GAP_MS) {
  const reservedAt = Math.max(now, currentNextAt)
  return { delayMs: reservedAt - now, nextSearchAt: reservedAt + gap }
}

// Search is metered far more tightly than the rest of the API, and the five capability queries are
// fired back to back. Space them out instead of finding out from a 429.
async function paceSearch(url) {
  if (!url.includes(SEARCH_PATH)) return
  const now = Date.now()
  // Reserve before yielding. Capability discovery starts its source searches concurrently; if
  // callers wait before reserving, they all wake on the same boundary and burst into the limiter.
  const reservation = reserveSearchSlot(now, nextSearchAt)
  nextSearchAt = reservation.nextSearchAt
  if (reservation.delayMs > 0) await wait(reservation.delayMs)
}

// A secondary rate limit states its wait in the body, not in a header:
// {"message":"try again in 309.763326ms", ..., "status":"429"}
export function retryDelay(response, detail, attempt) {
  const retryAfter = Number.parseInt(response.headers?.get?.('retry-after') || '', 10)
  if (Number.isInteger(retryAfter)) return Math.max(retryAfter * 1000, 1000)
  const hint = /try again in ([\d.]+)\s*(ms|s)\b/i.exec(detail || '')
  const hinted = hint ? Number(hint[1]) * (hint[2].toLowerCase() === 's' ? 1000 : 1) : 0
  // The body states a floor, not a gate: the limiter re-arms on every request, so a wait that only
  // matches the hint retries at the boundary and stays throttled. Add growing margin on top of it.
  // Observed twice: a 310ms hint cycling for five seconds, then an 8s hint that re-armed across all six retries.
  return hinted + 1000 * 2 ** attempt
}

export async function githubRequest(path, { accept, retries } = {}) {
  const url = path.startsWith('http') ? path : `${API_ROOT}${path}`
  // The observed 429 kept answering "try again in 310ms" for five straight seconds, so the wait it
  // states is a floor, not the gate. Give search a budget that outlasts the limiter.
  const budget = retries ?? (url.includes(SEARCH_PATH) ? SEARCH_RETRIES : 3)
  for (let attempt = 0; attempt <= budget; attempt += 1) {
    await paceSearch(url)
    const response = await fetch(url, { headers: headers(accept) })
    if (response.ok) return response

    // 408 and 429 are the search API asking us to wait; neither is a verdict about the query.
    const retryable = response.status === 403 || response.status === 408 || response.status === 429 || response.status >= 500
    const detail = (await response.text()).slice(0, 500)
    if (!retryable || attempt === budget) throw new Error(`GitHub ${response.status} for ${url}: ${detail}`)
    await wait(retryDelay(response, detail, attempt))
  }
  throw new Error(`unreachable retry loop for ${url}`)
}

export async function githubJson(path) {
  const response = await githubRequest(path)
  return response.json()
}

export async function githubText(path) {
  const response = await githubRequest(path, { accept: 'application/vnd.github.raw+json' })
  return response.text()
}

// Paging a search is not reading a snapshot. The result set is ranked, the ranking moves while we
// walk it, and a topic gaining repositories mid-sweep pushes one across a page boundary we already
// crossed — so the same repository arrives on two pages. Undeduped it reaches the radar twice and
// the check reports "duplicate plugin id", which reads as a statement about the ecosystem when it is
// an artifact of our own paging. Key the pages so the instrument stops inventing findings.
// Page size stays fixed: deriving it from what is left makes page N cover a different span than the
// offset GitHub computes from it, which is a second way to see the same item twice.
async function searchPages(path, query, limit, identify, sort = '') {
  const seen = new Set()
  const items = []
  const perPage = Math.min(100, limit)
  let reportedTotal = 0
  for (let page = 1; items.length < limit && page <= 10; page += 1) {
    const search = await githubJson(`${path}?q=${encodeURIComponent(query)}${sort}&per_page=${perPage}&page=${page}`)
    reportedTotal = search.total_count
    for (const item of search.items) {
      const id = identify(item)
      if (seen.has(id)) continue
      seen.add(id)
      items.push(item)
    }
    if (search.items.length < perPage) break
  }
  return { items: items.slice(0, limit), reportedTotal }
}

export async function searchRepositories(query, limit) {
  const { items, reportedTotal } = await searchPages('/search/repositories', query, limit, item => item.full_name, '&sort=stars&order=desc')
  return { repositories: items, reportedTotal }
}

export async function searchCode(query, limit) {
  return searchPages('/search/code', query, limit, item => `${item.repository.full_name}:${item.path}`)
}

export async function mapConcurrent(items, concurrency, mapper) {
  const output = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) return
      output[index] = await mapper(items[index], index)
    }
  })
  await Promise.all(workers)
  return output
}

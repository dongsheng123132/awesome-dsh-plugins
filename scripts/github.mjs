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
const SEARCH_MIN_GAP_MS = 2000
const SEARCH_RETRIES = 6
let nextSearchAt = 0

// Search is metered far more tightly than the rest of the API, and the five capability queries are
// fired back to back. Space them out instead of finding out from a 429.
async function paceSearch(url) {
  if (!url.includes(SEARCH_PATH)) return
  const now = Date.now()
  if (now < nextSearchAt) await wait(nextSearchAt - now)
  nextSearchAt = Math.max(now, nextSearchAt) + SEARCH_MIN_GAP_MS
}

// A secondary rate limit states its wait in the body, not in a header:
// {"message":"try again in 309.763326ms", ..., "status":"429"}
export function retryDelay(response, detail, attempt) {
  const retryAfter = Number.parseInt(response.headers?.get?.('retry-after') || '', 10)
  if (Number.isInteger(retryAfter)) return Math.max(retryAfter * 1000, 1000)
  const hint = /try again in ([\d.]+)\s*(ms|s)\b/i.exec(detail || '')
  const hinted = hint ? Number(hint[1]) * (hint[2].toLowerCase() === 's' ? 1000 : 1) : 0
  return Math.max(hinted, 1000 * 2 ** attempt)
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

export async function searchRepositories(query, limit) {
  const repositories = []
  let reportedTotal = 0
  for (let page = 1; repositories.length < limit && page <= 10; page += 1) {
    const remaining = limit - repositories.length
    const perPage = Math.min(100, remaining)
    const search = await githubJson(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`)
    reportedTotal = search.total_count
    repositories.push(...search.items)
    if (search.items.length < perPage) break
  }
  return { repositories: repositories.slice(0, limit), reportedTotal }
}

export async function searchCode(query, limit) {
  const items = []
  let reportedTotal = 0
  for (let page = 1; items.length < limit && page <= 10; page += 1) {
    const remaining = limit - items.length
    const perPage = Math.min(100, remaining)
    const search = await githubJson(`/search/code?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`)
    reportedTotal = search.total_count
    items.push(...search.items)
    if (search.items.length < perPage) break
  }
  return { items: items.slice(0, limit), reportedTotal }
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

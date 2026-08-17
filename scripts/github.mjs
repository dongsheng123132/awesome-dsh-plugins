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

export async function githubRequest(path, { accept, retries = 3 } = {}) {
  const url = path.startsWith('http') ? path : `${API_ROOT}${path}`
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, { headers: headers(accept) })
    if (response.ok) return response

    // 408 is the search API asking us to try again; it is not a verdict about the query.
    const retryable = response.status === 403 || response.status === 408 || response.status === 429 || response.status >= 500
    if (!retryable || attempt === retries) {
      const detail = (await response.text()).slice(0, 500)
      throw new Error(`GitHub ${response.status} for ${url}: ${detail}`)
    }
    const retryAfter = Number.parseInt(response.headers.get('retry-after') || '', 10)
    await wait(Number.isInteger(retryAfter) ? retryAfter * 1000 : 750 * (2 ** attempt))
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

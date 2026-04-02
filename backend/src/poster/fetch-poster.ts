function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id))
}

async function tryTmdb(title: string, year: number): Promise<string | null> {
  const key = process.env.TMDB_API_KEY
  if (!key) return null
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(title)}&year=${year}&language=en-US`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const data = (await res.json()) as { results?: { poster_path?: string }[] }
    const path = data.results?.[0]?.poster_path
    return path ? `https://image.tmdb.org/t/p/w500${path}` : null
  } catch {
    return null
  }
}

async function tryOmdb(title: string, year: number): Promise<string | null> {
  const key = process.env.OMDB_API_KEY
  if (!key) return null
  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${key}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const data = (await res.json()) as { Poster?: string }
    const poster = data.Poster
    return poster && poster !== 'N/A' ? poster : null
  } catch {
    return null
  }
}

async function tryWikipedia(title: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} film`)
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=500`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source?: string } }> }
    }
    const pages = data.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

export async function fetchPosterUrl(title: string, year: number): Promise<string | null> {
  return (await tryTmdb(title, year)) ?? (await tryOmdb(title, year)) ?? (await tryWikipedia(title))
}

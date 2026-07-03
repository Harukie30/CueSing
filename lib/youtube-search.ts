import type { YoutubeSearchResult } from "@/lib/types"

type YoutubeSearchResponse = {
  items?: Array<{
    id?: { videoId?: string }
    snippet?: {
      title?: string
      channelTitle?: string
      thumbnails?: {
        medium?: { url?: string }
        high?: { url?: string }
        default?: { url?: string }
      }
    }
  }>
  error?: {
    message?: string
    errors?: Array<{ reason?: string }>
  }
}

const CACHE_TTL_MS = 60 * 60 * 1000
const searchCache = new Map<string, { at: number; results: YoutubeSearchResult[] }>()

function getApiKey() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw new Error(
      "YouTube API key is not configured. Add YOUTUBE_API_KEY to .env.local"
    )
  }
  return apiKey
}

export async function searchYoutubeVideos(query: string): Promise<YoutubeSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const cacheKey = trimmed.toLowerCase()
  const cached = searchCache.get(cacheKey)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.results
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "15",
    q: trimmed,
    videoEmbeddable: "true",
    safeSearch: "moderate",
    key: getApiKey(),
  })

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 0 } }
  )

  const data = (await response.json()) as YoutubeSearchResponse

  if (!response.ok) {
    const reason = data.error?.errors?.[0]?.reason
    const apiMessage = data.error?.message ?? "YouTube search failed"

    if (reason === "quotaExceeded") {
      throw new Error(
        "YouTube search limit reached for today. Try the family list or again tomorrow."
      )
    }

    if (
      apiMessage.includes("are blocked") ||
      apiMessage.includes("API_KEY_HTTP_REFERRER_BLOCKED")
    ) {
      throw new Error(
        "YouTube API key is blocked. In Google Cloud Console: enable YouTube Data API v3, then set the key to “Don’t restrict” (or allow YouTube Data API v3 only — not HTTP referrer, since search runs on the server)."
      )
    }

    throw new Error(apiMessage)
  }

  const results =
    data.items
      ?.map((item) => {
        const youtubeId = item.id?.videoId
        const snippet = item.snippet
        if (!youtubeId || !snippet?.title) return null

        const thumbnailUrl =
          snippet.thumbnails?.medium?.url ??
          snippet.thumbnails?.high?.url ??
          snippet.thumbnails?.default?.url ??
          ""

        return {
          youtubeId,
          title: snippet.title,
          channelTitle: snippet.channelTitle ?? "YouTube",
          thumbnailUrl,
        }
      })
      .filter((item): item is YoutubeSearchResult => item !== null) ?? []

  searchCache.set(cacheKey, { at: Date.now(), results })
  return results
}

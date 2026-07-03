export function extractYoutubeId(input: string): string | null {
  const value = input.trim()
  if (!value) return null

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, "")

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0]
      return id.length === 11 ? id : null
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = url.searchParams.get("v")
      if (fromQuery && fromQuery.length === 11) return fromQuery

      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
      if (embedMatch) return embedMatch[1]

      const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)
      if (shortsMatch) return shortsMatch[1]
    }
  } catch {
    return null
  }

  return null
}

type YoutubeOEmbed = {
  title: string
  author_name: string
}

export async function fetchYoutubeMetadata(videoId: string): Promise<YoutubeOEmbed> {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}&format=json`,
    { next: { revalidate: 0 } }
  )

  if (!response.ok) {
    throw new Error("Could not load video info. Check the link and try again.")
  }

  return (await response.json()) as YoutubeOEmbed
}

export function slugifySongId(title: string, artist: string) {
  return `${artist}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

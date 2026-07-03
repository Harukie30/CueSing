import { NextResponse } from "next/server"

import { searchYoutubeVideos } from "@/lib/youtube-search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    )
  }

  try {
    const results = await searchYoutubeVideos(query)
    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : "YouTube search failed"
    const status = message.includes("not configured") ? 503 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

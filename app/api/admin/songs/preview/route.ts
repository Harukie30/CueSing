import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { previewSongFromUrl } from "@/lib/songs-store"

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = (await request.json()) as { youtubeUrl?: string }
    if (!body.youtubeUrl) {
      return NextResponse.json({ error: "youtubeUrl is required" }, { status: 400 })
    }

    const preview = await previewSongFromUrl(body.youtubeUrl)
    return NextResponse.json(preview)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to preview song"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

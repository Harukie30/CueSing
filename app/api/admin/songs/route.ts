import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { addSong, getSongs } from "@/lib/songs-store"

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  const songs = await getSongs()
  return NextResponse.json({ songs })
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      youtubeUrl?: string
      title?: string
      artist?: string
      tags?: string[]
    }

    if (!body.youtubeUrl || !body.title || !body.artist) {
      return NextResponse.json(
        { error: "youtubeUrl, title, and artist are required" },
        { status: 400 }
      )
    }

    const song = await addSong({
      youtubeUrl: body.youtubeUrl,
      title: body.title,
      artist: body.artist,
      tags: body.tags,
    })

    return NextResponse.json({ song }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add song"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

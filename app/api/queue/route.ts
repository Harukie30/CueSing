import { NextResponse } from "next/server"

import { addToQueue, addYoutubeToQueue, getQueueState } from "@/lib/queue-store"

export async function GET() {
  return NextResponse.json(getQueueState())
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      songId?: string
      youtubeId?: string
      title?: string
      artist?: string
      requestedBy?: string
    }

    if (!body.requestedBy) {
      return NextResponse.json({ error: "requestedBy is required" }, { status: 400 })
    }

    if (body.songId) {
      const item = await addToQueue({
        songId: body.songId,
        requestedBy: body.requestedBy,
      })
      return NextResponse.json({ item, queue: getQueueState() }, { status: 201 })
    }

    if (body.youtubeId && body.title) {
      const { item, savedToCatalog } = await addYoutubeToQueue({
        youtubeId: body.youtubeId,
        title: body.title,
        artist: body.artist ?? "YouTube",
        requestedBy: body.requestedBy,
      })
      return NextResponse.json(
        { item, savedToCatalog, queue: getQueueState() },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { error: "Provide songId or youtubeId with title" },
      { status: 400 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add song"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

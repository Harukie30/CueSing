import { NextResponse } from "next/server"

import { getSongs, searchSongs } from "@/lib/songs-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  const results = query ? await searchSongs(query) : await getSongs()

  return NextResponse.json({ songs: results })
}

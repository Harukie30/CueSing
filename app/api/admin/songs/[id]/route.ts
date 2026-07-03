import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import { removeSong } from "@/lib/songs-store"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await context.params
    const removed = await removeSong(id)
    return NextResponse.json({ removed })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove song"
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

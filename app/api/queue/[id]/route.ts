import { NextResponse } from "next/server"

import { removeFromQueue } from "@/lib/queue-store"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const removed = removeFromQueue(id)
    return NextResponse.json({ removed })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove song"
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

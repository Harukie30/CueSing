import { NextResponse } from "next/server"

import { advanceQueue } from "@/lib/queue-store"

export async function POST() {
  const queue = advanceQueue()
  return NextResponse.json(queue)
}

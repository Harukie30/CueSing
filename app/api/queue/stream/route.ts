import { subscribeQueue } from "@/lib/queue-events"
import { getQueueState } from "@/lib/queue-store"
import type { QueueResponse } from "@/lib/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (state: QueueResponse) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(state)}\n\n`)
          )
        } catch {
          // Stream already closed.
        }
      }

      send(getQueueState())

      const unsubscribe = subscribeQueue(send)

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"))
        } catch {
          clearInterval(heartbeat)
        }
      }, 25000)

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        unsubscribe()
        try {
          controller.close()
        } catch {
          // Already closed.
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}

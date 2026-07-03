"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { QueueResponse } from "@/lib/types"

const EMPTY_QUEUE: QueueResponse = {
  nowPlaying: null,
  upNext: [],
}

const FALLBACK_POLL_MS = 5000
const SSE_RETRY_MS = 8000

async function fetchQueueState(): Promise<QueueResponse | null> {
  const response = await fetch("/api/queue", { cache: "no-store" })
  if (!response.ok) return null
  return (await response.json()) as QueueResponse
}

export function useQueue() {
  const [queue, setQueue] = useState<QueueResponse>(EMPTY_QUEUE)
  const [isLive, setIsLive] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollTimerRef = useRef<number | null>(null)
  const retryTimerRef = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    const state = await fetchQueueState()
    if (state) setQueue(state)
  }, [])

  useEffect(() => {
    let closed = false

    const stopPolling = () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
    }

    const startPolling = () => {
      if (pollTimerRef.current !== null) return
      void refresh()
      pollTimerRef.current = window.setInterval(() => {
        void refresh()
      }, FALLBACK_POLL_MS)
    }

    const scheduleReconnect = () => {
      if (retryTimerRef.current !== null) return
      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null
        if (!closed) connect()
      }, SSE_RETRY_MS)
    }

    const connect = () => {
      eventSourceRef.current?.close()

      const source = new EventSource("/api/queue/stream")
      eventSourceRef.current = source

      source.onopen = () => {
        setIsLive(true)
        stopPolling()
      }

      source.onmessage = (event) => {
        try {
          const state = JSON.parse(event.data) as QueueResponse
          setQueue(state)
        } catch {
          // Ignore malformed events.
        }
      }

      source.onerror = () => {
        setIsLive(false)
        source.close()
        if (eventSourceRef.current === source) {
          eventSourceRef.current = null
        }
        startPolling()
        scheduleReconnect()
      }
    }

    connect()

    return () => {
      closed = true
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      stopPolling()
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
  }, [refresh])

  return { queue, isLive, refresh }
}

"use client"

import { useEffect, useRef } from "react"

type YouTubePlayerProps = {
  videoId: string
  onEnded: () => void
}

type YTPlayer = {
  destroy: () => void
  loadVideoById: (videoId: string) => void
}

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      playerVars?: Record<string, number | string>
      events?: {
        onStateChange?: (event: { data: number }) => void
      }
    }
  ) => YTPlayer
  PlayerState: {
    ENDED: number
  }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiLoading: Promise<void> | null = null

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve()
  if (apiLoading) return apiLoading

  apiLoading = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    )

    if (existing) {
      window.onYouTubeIframeAPIReady = () => resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    window.onYouTubeIframeAPIReady = () => resolve()
    document.body.appendChild(script)
  })

  return apiLoading
}

export function YouTubePlayer({ videoId, onEnded }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const onEndedRef = useRef(onEnded)

  useEffect(() => {
    onEndedRef.current = onEnded
  }, [onEnded])

  useEffect(() => {
    let cancelled = false

    async function setup() {
      await loadYouTubeApi()
      if (cancelled || !containerRef.current || !window.YT) return

      playerRef.current?.destroy()

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              onEndedRef.current()
            }
          },
        },
      })
    }

    setup()

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId])

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black landscape-short:h-full landscape-short:max-h-[calc(100dvh-5rem)] landscape-short:min-h-40 landscape-short:w-full">
      <div ref={containerRef} className="size-full [&_iframe]:size-full" />
    </div>
  )
}

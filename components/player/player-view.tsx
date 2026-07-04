"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ListMusic,
  Mic2,
  SkipForward,
  Sparkles,
  Tv,
} from "lucide-react"
import { toast } from "sonner"

import { useQueue } from "@/hooks/use-queue"
import { LandingBackground } from "@/components/landing/landing-background"
import { PlayerQueuePanel } from "@/components/player/player-queue-panel"
import { YouTubePlayer } from "@/components/player/youtube-player"
import { QueueRequester } from "@/components/queue/queue-requester"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function PlayerView() {
  const { queue } = useQueue()

  async function handleAdvance() {
    const response = await fetch("/api/queue/advance", { method: "POST" })
    if (!response.ok) {
      toast.error("Could not skip song")
    }
  }

  const queueCount = queue.upNext.length + (queue.nowPlaying ? 1 : 0)

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden landscape-short:h-dvh landscape-short:min-h-0">
      <LandingBackground />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 landscape-short:h-full landscape-short:max-w-none landscape-short:gap-3 landscape-short:overflow-hidden landscape-short:py-3 landscape-short:sm:px-4">
        <div className="flex items-center justify-between gap-4 landscape-short:shrink-0 landscape-short:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Home
            </Link>
          </Button>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Tv />
            Player
          </Badge>
        </div>

        <section className="relative overflow-hidden rounded-2xl bg-card/55 px-5 py-5 backdrop-blur-sm sm:px-6 sm:py-6 landscape-short:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 size-36 rounded-full bg-primary/15 blur-2xl"
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/smart-tv.png"
                alt=""
                width={64}
                height={64}
                className="size-14 object-contain sm:size-16"
              />
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-primary uppercase">
                  {APP_NAME}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Now playing
                </h1>
                <p className="text-sm text-muted-foreground">
                  Host screen for your family karaoke night
                </p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1">
              <Sparkles />
              {queueCount} in queue
            </Badge>
          </div>
        </section>

        <div
          className={cn(
            "grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:items-start",
            "landscape-short:grid landscape-short:min-h-0 landscape-short:flex-1 landscape-short:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.95fr)] landscape-short:items-stretch landscape-short:gap-3"
          )}
        >
          <section className="min-h-0 space-y-4 landscape-short:flex landscape-short:space-y-0">
            {queue.nowPlaying ? (
              <div
                className={cn(
                  "space-y-4 rounded-2xl border border-border/40 bg-card/55 p-3 backdrop-blur-sm sm:p-4",
                  "landscape-short:flex landscape-short:min-h-0 landscape-short:w-full landscape-short:gap-3 landscape-short:overflow-hidden landscape-short:space-y-0 landscape-short:p-2"
                )}
              >
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl shadow-[0_0_40px_oklch(0.5_0.12_285/0.15)]",
                    "landscape-short:min-w-0 landscape-short:flex-1"
                  )}
                >
                  <YouTubePlayer
                    key={queue.nowPlaying.id}
                    videoId={queue.nowPlaying.youtubeId}
                    onEnded={handleAdvance}
                  />
                </div>

                <div
                  className={cn(
                    "space-y-4 px-1 sm:px-2",
                    "landscape-short:flex landscape-short:w-52 landscape-short:shrink-0 landscape-short:flex-col landscape-short:justify-between landscape-short:gap-2 landscape-short:overflow-y-auto landscape-short:px-0 landscape-short:pr-1 landscape-short:sm:px-0 landscape-short:sm:pr-1"
                  )}
                >
                  <div className="space-y-3 landscape-short:space-y-2">
                    <Badge className="gap-1.5 landscape-short:text-xs">
                      <Mic2 />
                      Live
                    </Badge>

                    <div className="space-y-1 rounded-xl bg-muted/20 px-4 py-3 landscape-short:px-3 landscape-short:py-2">
                      <p className="text-xs font-medium tracking-wide text-primary uppercase">
                        On stage
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl landscape-short:text-base landscape-short:line-clamp-2">
                        {queue.nowPlaying.title}
                      </h2>
                      <p className="text-base text-muted-foreground landscape-short:text-xs landscape-short:truncate">
                        {queue.nowPlaying.artist}
                      </p>
                    </div>

                    <QueueRequester
                      name={queue.nowPlaying.requestedBy}
                      display="hero"
                      className="landscape-short:hidden"
                    />
                    <QueueRequester
                      name={queue.nowPlaying.requestedBy}
                      display="compact"
                      className="hidden landscape-short:block"
                    />
                  </div>

                  <Button
                    onClick={handleAdvance}
                    size="lg"
                    className="w-full sm:w-auto landscape-short:h-9 landscape-short:w-full landscape-short:text-sm"
                  >
                    <SkipForward data-icon="inline-start" />
                    Skip song
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 rounded-2xl bg-card/55 px-6 py-12 text-center backdrop-blur-sm sm:py-16 landscape-short:min-h-0 landscape-short:w-full landscape-short:justify-center landscape-short:gap-3 landscape-short:px-4 landscape-short:py-4 landscape-short:sm:py-4">
                <Image
                  src="/scan.png"
                  alt=""
                  width={96}
                  height={96}
                  className="size-20 object-contain sm:size-24 landscape-short:size-14"
                />
                <div className="max-w-md space-y-2 landscape-short:space-y-1">
                  <h2 className="text-xl font-semibold landscape-short:text-lg">
                    Waiting for a song
                  </h2>
                  <p className="text-sm text-muted-foreground text-balance landscape-short:text-xs">
                    Open the request page on a phone, pick a karaoke track, and it
                    will show up here automatically.
                  </p>
                </div>
                <Button asChild size="lg" className="landscape-short:h-9">
                  <Link href="/request">
                    <ListMusic data-icon="inline-start" />
                    Open request page
                  </Link>
                </Button>
              </div>
            )}
          </section>

          <PlayerQueuePanel queue={queue} />
        </div>
      </div>
    </div>
  )
}

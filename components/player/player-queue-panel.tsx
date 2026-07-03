import Image from "next/image"
import Link from "next/link"
import { ListMusic, Sparkles } from "lucide-react"

import { PlayerQueueItem } from "@/components/player/player-queue-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { QueueResponse } from "@/lib/types"

type PlayerQueuePanelProps = {
  queue: QueueResponse
}

export function PlayerQueuePanel({ queue }: PlayerQueuePanelProps) {
  const total = queue.upNext.length + (queue.nowPlaying ? 1 : 0)
  const upNextCount = queue.upNext.length

  return (
    <aside className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-card/55 backdrop-blur-sm lg:min-h-0 lg:max-h-[calc(100vh-12rem)] landscape-short:min-h-0 landscape-short:max-h-[calc(100dvh-4.5rem)]">
      <div className="flex items-start justify-between gap-3 border-b border-border/50 px-4 py-4 sm:px-5 landscape-short:px-3 landscape-short:py-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ListMusic className="size-4 text-primary" />
            <h2 className="text-base font-semibold sm:text-lg">Song queue</h2>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {total === 0
              ? "Waiting for requests from phones"
              : `${total} song${total === 1 ? "" : "s"} in line`}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 tabular-nums">
          <Sparkles className="size-3" />
          {total}
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5 landscape-short:gap-2 landscape-short:px-3 landscape-short:py-2">
        {queue.nowPlaying ? (
          <div className="space-y-2.5">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">
              Now playing
            </p>
            <PlayerQueueItem
              item={queue.nowPlaying}
              position={1}
              variant="now-playing"
            />
          </div>
        ) : null}

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Up next
            </p>
            {upNextCount > 0 ? (
              <span className="text-xs text-muted-foreground tabular-nums">
                {upNextCount} waiting
              </span>
            ) : null}
          </div>

          {upNextCount === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/15 px-4 py-8 text-center">
              {queue.nowPlaying ? (
                <>
                  <p className="text-sm font-medium">No more songs lined up</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Queue another track from a phone before this one ends.
                  </p>
                </>
              ) : (
                <>
                  <Image
                    src="/music.png"
                    alt=""
                    width={48}
                    height={48}
                    className="mx-auto mb-3 size-12 object-contain opacity-80"
                  />
                  <p className="text-sm font-medium">Queue is empty</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Family members can request from their phones.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/request">Open request page</Link>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {queue.upNext.map((item, index) => (
                <PlayerQueueItem
                  key={item.id}
                  item={item}
                  position={queue.nowPlaying ? index + 2 : index + 1}
                  isNext={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

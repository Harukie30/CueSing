import Image from "next/image"
import { Mic2 } from "lucide-react"

import { QueueRequester } from "@/components/queue/queue-requester"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { QueueItem } from "@/lib/types"

function youtubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`
}

type PlayerQueueItemProps = {
  item: QueueItem
  position: number
  variant?: "up-next" | "now-playing"
  isNext?: boolean
}

export function PlayerQueueItem({
  item,
  position,
  variant = "up-next",
  isNext = false,
}: PlayerQueueItemProps) {
  const isNowPlaying = variant === "now-playing"

  return (
    <article
      className={cn(
        "flex gap-3 rounded-xl border p-3 transition-colors",
        isNowPlaying
          ? "border-primary/25 bg-primary/10"
          : isNext
            ? "border-primary/20 bg-primary/5 shadow-[0_0_24px_oklch(0.5_0.12_285/0.08)]"
            : "border-border/40 bg-muted/20"
      )}
    >
      <div className="relative shrink-0">
        <div className="relative size-14 overflow-hidden rounded-lg bg-muted sm:size-16">
          <Image
            src={youtubeThumbnail(item.youtubeId)}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        </div>
        <span
          className={cn(
            "absolute -top-1.5 -left-1.5 inline-flex size-6 items-center justify-center rounded-md text-[11px] font-semibold tabular-nums shadow-sm",
            isNowPlaying
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground ring-1 ring-border/60"
          )}
        >
          {position}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0 space-y-0.5">
          <p className="line-clamp-2 text-sm leading-snug font-medium sm:text-[0.95rem]">
            {item.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{item.artist}</p>
        </div>

        <QueueRequester name={item.requestedBy} />

        <div className="flex flex-wrap items-center gap-1.5">
          {isNowPlaying ? (
            <Badge className="gap-1">
              <Mic2 className="size-3" />
              Live
            </Badge>
          ) : isNext ? (
            <Badge variant="secondary" className="bg-primary/15 text-primary">
              Next up
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Queued
            </Badge>
          )}
        </div>
      </div>
    </article>
  )
}

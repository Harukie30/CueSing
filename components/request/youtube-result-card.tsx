import Image from "next/image"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { YoutubeSearchResult } from "@/lib/types"

type YoutubeResultCardProps = {
  result: YoutubeSearchResult
  disabled?: boolean
  isRequesting?: boolean
  onRequest: (result: YoutubeSearchResult) => void
}

export function YoutubeResultCard({
  result,
  disabled,
  isRequesting,
  onRequest,
}: YoutubeResultCardProps) {
  return (
    <article className="flex gap-3 rounded-2xl bg-card/70 p-3 backdrop-blur-sm sm:gap-4 sm:p-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        {result.thumbnailUrl ? (
          <Image
            src={result.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0 space-y-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug sm:text-base">
            {result.title}
          </h3>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {result.channelTitle}
          </p>
        </div>

        <Button
          size="sm"
          className="mt-auto w-full sm:w-fit"
          disabled={disabled || isRequesting}
          onClick={() => onRequest(result)}
        >
          <Plus data-icon="inline-start" />
          {isRequesting ? "Adding..." : "Add to queue"}
        </Button>
      </div>
    </article>
  )
}

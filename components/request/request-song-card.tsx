import Image from "next/image"
import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Song } from "@/lib/types"

type RequestSongCardProps = {
  song: Song
  disabled?: boolean
  isRequesting?: boolean
  onRequest: (song: Song) => void
}

export function RequestSongCard({
  song,
  disabled,
  isRequesting,
  onRequest,
}: RequestSongCardProps) {
  return (
    <article className="flex gap-3 rounded-2xl bg-card/70 p-3 backdrop-blur-sm transition-colors active:bg-card/90 sm:gap-4 sm:p-4">
      <div className="flex size-12 shrink-0 items-center justify-center sm:size-14">
        <Image
          src="/music (1).png"
          alt=""
          width={48}
          height={48}
          className="size-10 object-contain sm:size-12"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0 space-y-0.5">
          <h3 className="truncate font-medium leading-snug">{song.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        </div>

        {song.tags && song.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {song.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <Button
          size="sm"
          className="mt-1 w-full sm:w-fit"
          disabled={disabled || isRequesting}
          onClick={() => onRequest(song)}
        >
          <Plus data-icon="inline-start" />
          {isRequesting ? "Adding..." : "Add to queue"}
        </Button>
      </div>
    </article>
  )
}

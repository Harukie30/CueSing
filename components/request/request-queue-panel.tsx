import { ListMusic, Mic2 } from "lucide-react"

import { QueueRequester } from "@/components/queue/queue-requester"
import { Badge } from "@/components/ui/badge"
import type { QueueItem, QueueResponse } from "@/lib/types"

type QueueRow = QueueItem & {
  position: number
  isNowPlaying: boolean
}

function buildRows(queue: QueueResponse): QueueRow[] {
  const rows: QueueRow[] = []

  if (queue.nowPlaying) {
    rows.push({
      ...queue.nowPlaying,
      position: 1,
      isNowPlaying: true,
    })
  }

  queue.upNext.forEach((item, index) => {
    rows.push({
      ...item,
      position: (queue.nowPlaying ? 2 : 1) + index,
      isNowPlaying: false,
    })
  })

  return rows
}

type RequestQueuePanelProps = {
  queue: QueueResponse
}

export function RequestQueuePanel({ queue }: RequestQueuePanelProps) {
  const rows = buildRows(queue)
  const total = rows.length

  return (
    <section className="overflow-hidden rounded-2xl bg-card/55 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border/50 px-4 py-3.5 sm:px-5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ListMusic className="size-4 text-primary" />
            <h2 className="text-sm font-semibold sm:text-base">Current queue</h2>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {total === 0
              ? "Nothing queued yet — add a song below."
              : `${total} song${total === 1 ? "" : "s"} waiting to play`}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 tabular-nums">
          {total}
        </Badge>
      </div>

      {total === 0 ? (
        <div className="px-4 py-8 text-center sm:px-5 sm:py-10">
          <p className="text-sm font-medium">Queue is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your picks will show up here and on the TV player.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 text-xs text-muted-foreground">
                <th className="w-10 px-3 py-2.5 font-medium sm:px-4">#</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Song</th>
                <th className="hidden px-2 py-2.5 font-medium sm:table-cell sm:min-w-[7.5rem] sm:px-3">
                  Singer
                </th>
                <th className="w-24 px-3 py-2.5 text-right font-medium sm:px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.isNowPlaying
                      ? "border-b border-border/30 bg-primary/8 last:border-b-0"
                      : "border-b border-border/20 last:border-b-0"
                  }
                >
                  <td className="px-3 py-3 align-top tabular-nums sm:px-4">
                    <span
                      className={
                        row.isNowPlaying
                          ? "inline-flex size-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary"
                          : "inline-flex size-7 items-center justify-center rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="max-w-0 px-2 py-3 align-top sm:px-3">
                    <p className="truncate font-medium leading-snug">{row.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {row.artist}
                    </p>
                    <div className="mt-2 sm:hidden">
                      <QueueRequester name={row.requestedBy} display="compact" />
                    </div>
                  </td>
                  <td className="hidden px-2 py-3 align-top sm:table-cell sm:px-3">
                    <QueueRequester name={row.requestedBy} display="compact" />
                  </td>
                  <td className="px-3 py-3 text-right align-top sm:px-4">
                    {row.isNowPlaying ? (
                      <Badge className="gap-1">
                        <Mic2 className="size-3" />
                        Now
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Up next
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

import { User } from "lucide-react"

import { cn } from "@/lib/utils"

type QueueRequesterProps = {
  name: string
  className?: string
  display?: "compact" | "card" | "hero"
}

export function QueueRequester({
  name,
  className,
  display = "card",
}: QueueRequesterProps) {
  if (display === "hero") {
    return (
      <div
        className={cn(
          "rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 sm:px-5 sm:py-4",
          className
        )}
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Requested by
        </p>
        <p className="mt-1.5 flex items-center gap-2.5 text-xl font-semibold sm:text-2xl">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="size-4" />
          </span>
          <span className="truncate">{name}</span>
        </p>
      </div>
    )
  }

  if (display === "compact") {
    return (
      <div className={cn("min-w-0 space-y-0.5", className)}>
        <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
          Requested by
        </p>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <User className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{name}</span>
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-lg border border-border/50 bg-background/70 px-2.5 py-2",
        className
      )}
    >
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
        Requested by
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground sm:text-base">
        <User className="size-3.5 shrink-0 text-primary sm:size-4" />
        <span className="truncate">{name}</span>
      </p>
    </div>
  )
}

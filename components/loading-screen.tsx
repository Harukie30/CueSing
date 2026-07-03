"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { Progress } from "@/components/ui/progress"
import { APP_LOGO, APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

type LoadingScreenProps = {
  message?: string
  fullScreen?: boolean
  className?: string
  value?: number
}

export function LoadingScreen({
  message = "Getting things ready...",
  fullScreen = true,
  className,
  value,
}: LoadingScreenProps) {
  const [internalProgress, setInternalProgress] = useState(10)
  const progress = value ?? internalProgress

  useEffect(() => {
    if (value !== undefined) return

    const timer = window.setInterval(() => {
      setInternalProgress((current) => {
        if (current >= 92) return current
        const step = Math.max(1, Math.round((92 - current) * 0.14))
        return Math.min(current + step, 92)
      })
    }, 160)

    return () => window.clearInterval(timer)
  }, [value])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-6",
        fullScreen && "fixed inset-0 z-50 bg-background/90 backdrop-blur-sm",
        !fullScreen && "w-full py-16",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex size-28 items-center justify-center sm:size-32">
          <div
            aria-hidden
            className="absolute inset-1 rounded-full bg-primary/15 motion-safe:animate-pulse"
          />
          <Image
            src={APP_LOGO}
            alt={`${APP_NAME} logo`}
            width={112}
            height={112}
            priority
            className="relative z-10 size-24 object-contain motion-safe:animate-loading-float motion-reduce:animate-none sm:size-28"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-xs text-muted-foreground tabular-nums">
          {progress}%
        </p>
      </div>
    </div>
  )
}

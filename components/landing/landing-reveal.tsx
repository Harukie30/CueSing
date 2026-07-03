"use client"

import type { ReactNode } from "react"

import { useAppReady } from "@/components/app-splash"
import { cn } from "@/lib/utils"

type LandingRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function LandingReveal({
  children,
  className,
  delay = 5,
}: LandingRevealProps) {
  const isAppReady = useAppReady()

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        isAppReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
      style={{ transitionDelay: isAppReady ? `${delay}ms` : "500ms" }}
    >
      {children}
    </div>
  )
}

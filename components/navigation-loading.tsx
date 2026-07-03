"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useAppReady } from "@/components/app-splash"
import { LoadingScreen } from "@/components/loading-screen"
import { cn } from "@/lib/utils"

const MIN_NAV_MS = 650
const FADE_MS = 280

function isInternalNavigation(href: string, pathname: string) {
  if (!href || href.startsWith("#")) return false
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false

  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return false
    if (url.pathname === pathname && url.search === "" && url.hash === "") {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function NavigationLoading() {
  const pathname = usePathname()
  const isAppReady = useAppReady()
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(12)

  const isFirstPath = useRef(true)
  const pendingNav = useRef(false)
  const hideTimerRef = useRef<number | null>(null)

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const show = () => {
    clearHideTimer()
    pendingNav.current = true
    setVisible(true)
    setFadeOut(false)
    setProgress(12)
  }

  const hide = () => {
    setProgress(100)
    setFadeOut(true)
    window.setTimeout(() => {
      setVisible(false)
      pendingNav.current = false
    }, FADE_MS)
  }

  useEffect(() => {
    if (!isAppReady) return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a")
      if (!anchor || anchor.target === "_blank") return

      const href = anchor.getAttribute("href")
      if (!href || !isInternalNavigation(href, pathname)) return

      show()
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [isAppReady, pathname])

  useEffect(() => {
    if (!isAppReady) return

    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }

    if (!visible && !pendingNav.current) {
      show()
    }

    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      hide()
    }, MIN_NAV_MS)

    return clearHideTimer
  }, [pathname, isAppReady])

  useEffect(() => {
    if (!visible || fadeOut) return

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current
        const step = Math.max(1, Math.round((92 - current) * 0.14))
        return Math.min(current + step, 92)
      })
    }, 160)

    return () => window.clearInterval(timer)
  }, [visible, fadeOut])

  useEffect(() => {
    if (!isAppReady) return
    document.body.style.overflow = visible && !fadeOut ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [visible, fadeOut, isAppReady])

  if (!isAppReady || !visible) return null

  return (
    <LoadingScreen
      message="Loading page..."
      value={progress}
      className={cn(
        "z-40 transition-opacity duration-300",
        fadeOut && "pointer-events-none opacity-0"
      )}
    />
  )
}

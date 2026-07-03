"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { LoadingScreen } from "@/components/loading-screen"
import { NavigationLoading } from "@/components/navigation-loading"
import { cn } from "@/lib/utils"

const MIN_SPLASH_MS = 1400
const FADE_MS = 300

const AppReadyContext = createContext(false)

export function useAppReady() {
  return useContext(AppReadyContext)
}

export function AppSplash({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const [progress, setProgress] = useState(12)

  useEffect(() => {
    const start = Date.now()

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100
        const step = Math.max(2, Math.round((100 - current) * 0.18))
        return Math.min(current + step, 100)
      })
    }, 120)

    const dismiss = () => {
      const elapsed = Date.now() - start
      const wait = Math.max(0, MIN_SPLASH_MS - elapsed)

      window.setTimeout(() => {
        setProgress(100)
        setFadeOut(true)
        setIsAppReady(true)
        window.setTimeout(() => setVisible(false), FADE_MS)
      }, wait)
    }

    if (document.readyState === "complete") dismiss()
    else window.addEventListener("load", dismiss, { once: true })

    return () => {
      window.clearInterval(progressTimer)
      window.removeEventListener("load", dismiss)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [visible])

  return (
    <AppReadyContext.Provider value={isAppReady}>
      <NavigationLoading />
      {children}
      {visible ? (
        <LoadingScreen
          message="Welcome to CueSing"
          value={progress}
          className={cn(
            "transition-opacity duration-300",
            fadeOut && "pointer-events-none opacity-0"
          )}
        />
      ) : null}
    </AppReadyContext.Provider>
  )
}

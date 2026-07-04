"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Switch } from "@/components/ui/switch"
import { withThemeTransition } from "@/lib/theme-transition"
import { cn } from "@/lib/utils"

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!mounted) {
    return (
      <Switch
        size="lg"
        checked={false}
        aria-label="Toggle theme"
        disabled
        className="border-border/60 bg-gradient-to-r from-sky-200 via-blue-100 to-amber-100"
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Switch
      size="lg"
      checked={isDark}
      onCheckedChange={(checked) =>
        withThemeTransition(() => setTheme(checked ? "dark" : "light"))
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "overflow-hidden border-border/60 bg-gradient-to-r from-sky-200 via-blue-100 via-50% to-amber-100 bg-[length:200%_100%] bg-left shadow-[inset_0_0_12px_rgb(255_255_255_/_0.55),0_8px_20px_rgb(14_165_233_/_0.16)]",
        "transition-[background-position,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-[background-position]",
        "data-checked:border-white/10 data-checked:bg-right data-checked:from-slate-950 data-checked:via-indigo-950 data-checked:to-slate-900 data-checked:shadow-[inset_0_0_16px_rgb(255_255_255_/_0.08),0_8px_24px_rgb(15_23_42_/_0.22)]"
      )}
      thumbClassName="grid place-items-center bg-white text-amber-500 shadow-[0_2px_8px_rgb(15_23_42_/_0.2)] transition-[transform,background-color,color,box-shadow] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 dark:data-checked:bg-slate-100 dark:data-checked:text-slate-800"
      thumbChildren={
        <span className="relative grid size-full place-items-center">
          <Sun
            aria-hidden="true"
            className={cn(
              "absolute size-4 transition-all duration-500 ease-out",
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            )}
          />
          <Moon
            aria-hidden="true"
            className={cn(
              "absolute size-4 transition-all duration-500 ease-out",
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            )}
          />
        </span>
      }
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-white/90 shadow-[8px_-5px_0_-2px_rgb(255_255_255_/_0.85),13px_3px_0_-3px_rgb(255_255_255_/_0.7)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/switch:-translate-x-5 group-data-checked/switch:-translate-y-5 group-data-checked/switch:opacity-0" />
        <span className="absolute -left-8 inset-y-1 w-12 rounded-full bg-white/20 blur-md transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/switch:translate-x-20" />
        <span className="absolute right-2.5 top-2 size-1 translate-x-3 rounded-full bg-white/80 opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/switch:translate-x-0 group-data-checked/switch:opacity-100" />
        <span className="absolute right-4 top-5 size-0.5 translate-x-4 rounded-full bg-white/70 opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/switch:translate-x-0 group-data-checked/switch:opacity-100" />
        <span className="absolute right-7 top-3.5 size-0.5 translate-x-5 rounded-full bg-white/60 opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/switch:translate-x-0 group-data-checked/switch:opacity-100" />
      </span>
    </Switch>
  )
}

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Toggle } from "@/components/ui/toggle"
import { withThemeTransition } from "@/lib/theme-transition"

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Toggle
        variant="outline"
        size="sm"
        pressed={false}
        aria-label="Toggle theme"
        disabled
      >
        <Sun />
      </Toggle>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={isDark}
      onPressedChange={(pressed) =>
        withThemeTransition(() => setTheme(pressed ? "dark" : "light"))
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Moon /> : <Sun />}
    </Toggle>
  )
}

import Link from "next/link"
import { Heart, Smartphone, Wifi } from "lucide-react"

import { AppBrand } from "@/components/app-brand"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Badge } from "@/components/ui/badge"
import { APP_DEVELOPER, APP_NAME } from "@/lib/brand"

const highlights = [
  { icon: Wifi, label: "Same Wi-Fi" },
  { icon: Smartphone, label: "No account needed" },
  { icon: Heart, label: "Built for family nights" },
] as const

export function LandingFooter() {
  return (
    <footer className="mt-auto w-full bg-muted/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <AppBrand showSlogan size="lg" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {highlights.map(({ icon: Icon, label }) => (
            <Badge key={label} variant="secondary" className="gap-1.5 px-3 py-1">
              <Icon />
              {label}
            </Badge>
          ))}
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              © {new Date().getFullYear()} {APP_NAME}. Built for family nights.
            </p>
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              Created & developed by{" "}
              <span className="font-medium text-foreground">{APP_DEVELOPER}</span>
            </p>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Manage songs
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Theme</span>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}

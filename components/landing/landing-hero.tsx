import { Heart, Smartphone, Sparkles, Wifi } from "lucide-react"

import { AppLogo } from "@/components/app-logo"
import { Badge } from "@/components/ui/badge"
import { APP_NAME, APP_SLOGAN } from "@/lib/brand"

const highlights = [
  { icon: Wifi, label: "Same Wi-Fi" },
  { icon: Smartphone, label: "No account needed" },
  { icon: Heart, label: "Built for family" },
] as const

export function LandingHero() {
  return (
    <section className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl sm:size-64"
      />

      <div className="relative flex flex-col items-center gap-6 rounded-2xl bg-card/50 px-5 py-10 text-center backdrop-blur-sm sm:gap-7 sm:px-8 sm:py-12 landscape-short:flex-row landscape-short:items-center landscape-short:gap-4 landscape-short:px-4 landscape-short:py-4 landscape-short:text-left">
        <div className="flex flex-col items-center gap-4 landscape-short:shrink-0 landscape-short:gap-2">
          <AppLogo
            size="2xl"
            priority
            className="rounded-2xl landscape-short:size-16 landscape-short:p-1"
          />
          <div className="space-y-1.5">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              {APP_NAME}
            </p>
            <p className="max-w-sm text-base text-muted-foreground text-balance sm:text-lg">
              {APP_SLOGAN}
            </p>
          </div>
        </div>

        <div className="h-px w-full max-w-xs bg-linear-to-r from-transparent via-border to-transparent landscape-short:hidden" />

        <div className="space-y-3 landscape-short:min-w-0 landscape-short:flex-1 landscape-short:space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary landscape-short:text-[11px]">
            <Sparkles className="size-3.5" />
            Family karaoke, reimagined
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl landscape-short:text-xl">
            Sing together, anytime
          </h1>
          <p className="mx-auto max-w-lg text-base text-muted-foreground text-pretty sm:text-lg landscape-short:text-sm landscape-short:line-clamp-2">
            Queue songs from your phone and play them on the big screen. Everyone
            sees the same queue in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 landscape-short:justify-start landscape-short:gap-1.5">
          {highlights.map(({ icon: Icon, label }) => (
            <Badge key={label} variant="secondary" className="gap-1.5 px-3 py-1">
              <Icon />
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

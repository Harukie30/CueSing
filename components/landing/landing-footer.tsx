import Image from "next/image"
import Link from "next/link"

import { AppBrand } from "@/components/app-brand"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Badge } from "@/components/ui/badge"
import { APP_DEVELOPER, APP_NAME } from "@/lib/brand"

const highlights = [
  {
    icon: "/connection.png",
    label: "Same Wi-Fi",
    description: "Connect from any device at home",
  },
  {
    icon: "/forbidden.png",
    label: "No account needed",
    description: "Open, request, and sing right away",
  },
  {
    icon: "/family.png",
    label: "Family nights",
    description: "Made for shared karaoke moments",
  },
] as const

export function LandingFooter() {
  return (
    <footer className="mt-auto w-full bg-muted/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <AppBrand showSlogan size="lg" />

        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {highlights.map(({ icon, label, description }) => (
            <Badge
              key={label}
              variant="secondary"
              className="h-auto w-full justify-start gap-3 whitespace-normal rounded-2xl border border-border/60 bg-background/70 px-3 py-3 text-left shadow-sm backdrop-blur transition-[transform,background-color,border-color,box-shadow] hover:-translate-y-0.5  hover:bg-background hover:shadow-md"
            >
              <Image
                src={icon}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 object-contain drop-shadow-sm"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold leading-tight text-foreground">
                  {label}
                </span>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {description}
                </span>
              </span>
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

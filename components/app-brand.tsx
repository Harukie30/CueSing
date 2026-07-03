import { APP_NAME, APP_SLOGAN } from "@/lib/brand"
import { AppLogo } from "@/components/app-logo"
import { cn } from "@/lib/utils"

type AppBrandProps = {
  showSlogan?: boolean
  className?: string
  align?: "left" | "center"
  size?: "default" | "lg"
}

export function AppBrand({
  showSlogan = false,
  className,
  align = "center",
  size = "default",
}: AppBrandProps) {
  const isLarge = size === "lg"

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <AppLogo size={isLarge ? "lg" : "sm"} />
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            isLarge ? "text-xl sm:text-2xl" : "text-base"
          )}
        >
          {APP_NAME}
        </span>
      </div>
      {showSlogan ? (
        <p
          className={cn(
            "text-muted-foreground",
            isLarge ? "max-w-sm text-sm sm:text-base" : "text-sm",
            align === "center" && isLarge && "text-balance"
          )}
        >
          {APP_SLOGAN}
        </p>
      ) : null}
    </div>
  )
}

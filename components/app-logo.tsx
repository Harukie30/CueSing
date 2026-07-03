import Image from "next/image"

import { APP_LOGO, APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

type AppLogoProps = {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  priority?: boolean
}

const sizeClasses = {
  sm: "size-9",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
  "2xl": "size-32 sm:size-36",
} as const

const imagePixels = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
  "2xl": 144,
} as const

export function AppLogo({
  size = "md",
  className,
  priority = false,
}: AppLogoProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={APP_LOGO}
        alt={`${APP_NAME} logo`}
        width={imagePixels[size]}
        height={imagePixels[size]}
        className="size-full object-cover"
        priority={priority}
      />
    </div>
  )
}

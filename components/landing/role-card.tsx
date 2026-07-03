import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type RoleCardProps = {
  image: string
  imageAlt: string
  title: string
  description: string
  href: string
  variant?: "default" | "outline"
}

export function RoleCard({
  image,
  imageAlt,
  title,
  description,
  href,
  variant = "default",
}: RoleCardProps) {
  return (
    <Card
      className={cn(
        "border-0 shadow-none ring-0 transition-colors",
        variant === "default" && "bg-card"
      )}
    >
      <CardHeader>
        <div className="mb-2 flex size-14 items-center justify-center">
          <Image
            src={image}
            alt={imageAlt}
            width={56}
            height={56}
            className="size-12 object-contain"
          />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter>
        <Button
          asChild
          variant={variant === "default" ? "default" : "outline"}
          size="lg"
          className="w-full"
        >
          <Link href={href}>
            Continue
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

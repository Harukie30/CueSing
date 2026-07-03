import { RoleCard } from "@/components/landing/role-card"

const roles = [
  {
    image: "/music (1).png",
    imageAlt: "Music disc",
    title: "Open Player",
    description: "For the TV or host screen. Shows the queue and plays songs.",
    href: "/player",
    variant: "default" as const,
  },
  {
    image: "/microphone.png",
    imageAlt: "Microphone",
    title: "Request a Song",
    description: "From your phone. Browse the catalog and add songs to the queue.",
    href: "/request",
    variant: "outline" as const,
  },
]

export function RoleSelector() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 landscape-short:grid-cols-2 landscape-short:gap-3">
      {roles.map((role) => (
        <RoleCard key={role.href} {...role} />
      ))}
    </div>
  )
}

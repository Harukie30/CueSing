import { HowItWorks } from "@/components/landing/how-it-works"
import { LandingBackground } from "@/components/landing/landing-background"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingReveal } from "@/components/landing/landing-reveal"
import { RoleSelector } from "@/components/landing/role-selector"
import { Separator } from "@/components/ui/separator"

export function LandingPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden landscape-short:max-h-dvh landscape-short:overflow-y-auto">
      <LandingBackground />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 landscape-short:gap-5 landscape-short:py-4 landscape-short:sm:py-5">
        <LandingReveal delay={0}>
          <LandingHeader />
        </LandingReveal>
        <LandingReveal delay={80}>
          <LandingHero />
        </LandingReveal>
        <LandingReveal delay={160}>
          <RoleSelector />
        </LandingReveal>
        <LandingReveal delay={240}>
          <Separator />
        </LandingReveal>
        <LandingReveal delay={320}>
          <HowItWorks />
        </LandingReveal>
      </main>
      <LandingReveal delay={400}>
        <LandingFooter />
      </LandingReveal>
    </div>
  )
}

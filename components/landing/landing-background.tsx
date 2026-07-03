import { cn } from "@/lib/utils"

export function LandingBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.88_0.1_300)_0%,transparent_62%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.12_300)_0%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.9_0.08_25)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.28_0.1_25)_0%,transparent_50%)]" />

      <div
        className={cn(
          "absolute -top-24 -left-20 size-72 rounded-full sm:size-96",
          "bg-[oklch(0.72_0.18_285)] opacity-50 blur-2xl dark:opacity-35",
          "motion-safe:animate-landing-drift-slow"
        )}
      />
      <div
        className={cn(
          "absolute top-28 -right-24 size-64 rounded-full sm:size-80",
          "bg-[oklch(0.7_0.2_15)] opacity-45 blur-2xl dark:opacity-30",
          "motion-safe:animate-landing-drift-reverse"
        )}
      />
      <div
        className={cn(
          "absolute top-[48%] -left-12 size-52 rounded-full sm:size-64",
          "bg-[oklch(0.75_0.16_250)] opacity-40 blur-2xl dark:opacity-28",
          "motion-safe:animate-landing-drift-slow"
        )}
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className={cn(
          "absolute right-[18%] bottom-32 size-56 rounded-full sm:size-72",
          "bg-[oklch(0.86_0.16_95)] opacity-45 blur-2xl dark:opacity-30",
          "motion-safe:animate-landing-drift-reverse"
        )}
        style={{ animationDelay: "0.8s" }}
      />

      <div className="absolute top-20 right-[10%] size-28 rounded-full border-2 border-[oklch(0.65_0.16_285/0.45)] bg-[oklch(0.78_0.12_285/0.08)] dark:border-[oklch(0.7_0.14_285/0.4)] dark:bg-[oklch(0.55_0.12_285/0.12)] sm:size-32" />
      <div className="absolute top-[42%] left-[6%] size-20 rotate-12 rounded-2xl border-2 border-[oklch(0.7_0.16_15/0.4)] bg-[oklch(0.8_0.12_15/0.08)] dark:border-[oklch(0.65_0.14_15/0.35)] dark:bg-[oklch(0.55_0.1_15/0.1)] sm:size-24" />
      <div className="absolute right-[4%] bottom-48 size-24 rounded-full border-2 border-[oklch(0.72_0.14_250/0.4)] bg-[oklch(0.78_0.1_250/0.08)] dark:border-[oklch(0.62_0.12_250/0.35)] dark:bg-[oklch(0.5_0.1_250/0.1)] sm:size-28" />

      <div className="absolute top-[14%] left-[14%] size-4 rounded-full bg-[oklch(0.68_0.18_285/0.75)] shadow-[0_0_20px_oklch(0.72_0.16_285/0.45)] dark:bg-[oklch(0.72_0.14_285/0.6)]" />
      <div className="absolute top-[58%] right-[20%] size-3 rounded-full bg-[oklch(0.72_0.18_15/0.8)] shadow-[0_0_16px_oklch(0.75_0.16_15/0.4)] dark:bg-[oklch(0.75_0.14_15/0.55)]" />
      <div className="absolute bottom-[30%] left-[26%] size-3.5 rounded-full bg-[oklch(0.84_0.16_95/0.85)] shadow-[0_0_18px_oklch(0.86_0.14_95/0.4)] dark:bg-[oklch(0.8_0.12_95/0.55)]" />
      <div className="absolute top-[72%] left-[12%] size-2.5 rounded-full bg-[oklch(0.75_0.14_250/0.7)] dark:bg-[oklch(0.7_0.12_250/0.5)]" />

      <svg
        className="absolute -bottom-6 left-1/2 w-[min(110%,48rem)] -translate-x-1/2 text-[oklch(0.68_0.12_285/0.28)] dark:text-[oklch(0.62_0.12_285/0.22)]"
        viewBox="0 0 800 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 80C120 40 200 100 320 70C440 40 520 90 640 60C720 40 760 50 800 45V120H0V80Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

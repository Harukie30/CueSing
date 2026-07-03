"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HOW_IT_WORKS_STEPS } from "@/lib/how-it-works-steps"
import { cn } from "@/lib/utils"

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStep = HOW_IT_WORKS_STEPS[activeIndex]
  const isFirst = activeIndex === 0
  const isLast = activeIndex === HOW_IT_WORKS_STEPS.length - 1

  function goToStep(index: number) {
    setActiveIndex(index)
  }

  function goNext() {
    if (!isLast) setActiveIndex((index) => index + 1)
  }

  function goPrev() {
    if (!isFirst) setActiveIndex((index) => index - 1)
  }

  return (
    <section className="w-full space-y-5 landscape-short:space-y-3">
      <div className="text-center">
        <h2 className="text-lg font-medium sm:text-xl">How it works</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Three steps to start your family karaoke night
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {HOW_IT_WORKS_STEPS.map((step, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={step.step}
              type="button"
              onClick={() => goToStep(index)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-all active:scale-[0.98] sm:px-3 sm:py-4",
                isActive
                  ? "bg-primary/10 shadow-sm"
                  : "bg-muted/40 hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8 sm:text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                {step.step}
              </span>
              <span
                className={cn(
                  "text-xs font-medium sm:text-sm",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{
            width: `${((activeIndex + 1) / HOW_IT_WORKS_STEPS.length) * 100}%`,
          }}
        />
      </div>

      <Card className="overflow-hidden border-0 bg-card/80 shadow-none ring-0 backdrop-blur-sm landscape-short:shadow-none">
        <CardHeader className="items-center pb-6 text-center landscape-short:flex-row landscape-short:items-center landscape-short:gap-4 landscape-short:pb-4 landscape-short:text-left">
          <div
            key={activeStep.step}
            className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-4 animate-in fade-in zoom-in-95 duration-300 sm:size-32 landscape-short:size-20 landscape-short:p-2"
          >
            <Image
              src={activeStep.image}
              alt={activeStep.alt}
              width={112}
              height={112}
              className="size-20 object-contain sm:size-24 landscape-short:size-14"
            />
          </div>
          <div
            key={`${activeStep.step}-text`}
            className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 landscape-short:min-w-0 landscape-short:space-y-1"
          >
            <p className="text-xs font-medium tracking-wide text-primary uppercase">
              Step {activeStep.step} of {HOW_IT_WORKS_STEPS.length}
            </p>
            <CardTitle className="text-base sm:text-lg">{activeStep.title}</CardTitle>
            <CardDescription className="mx-auto max-w-md text-sm sm:text-base">
              {activeStep.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={isFirst}
            className="min-w-24"
          >
            <ChevronLeft data-icon="inline-start" />
            Back
          </Button>

          <div className="flex items-center gap-1.5">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <button
                key={step.step}
                type="button"
                aria-label={`Go to step ${step.step}`}
                onClick={() => goToStep(index)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  index === activeIndex
                    ? "w-5 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={goNext}
            disabled={isLast}
            className="min-w-24"
          >
            Next
            <ChevronRight data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

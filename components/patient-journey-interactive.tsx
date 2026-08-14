"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Gift,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Target,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { defaultPatientJourneyBlock } from "@/lib/patient-journey-defaults"
import type { PatientJourneyProps, PatientJourneyStep } from "@/lib/patient-journey-types"
import { cn } from "@/lib/utils"

const stepIcons: LucideIcon[] = [Target, MessageSquare, LayoutTemplate, Zap, PhoneCall, BarChart3]

const principleCards = [
  {
    icon: Megaphone,
    text: "The advertisement earns attention.",
  },
  {
    icon: Gift,
    text: "The offer creates action.",
  },
  {
    icon: MessageCircle,
    text: "The follow-up protects the opportunity.",
  },
]

type PatientJourneyInteractiveProps = PatientJourneyProps

function normalizeSteps(steps?: PatientJourneyStep[] | null): PatientJourneyStep[] {
  if (steps && steps.length > 0) {
    return steps
  }

  return defaultPatientJourneyBlock.steps
}

export function PatientJourneyInteractive({
  eyebrow = defaultPatientJourneyBlock.eyebrow,
  title = defaultPatientJourneyBlock.title,
  description = defaultPatientJourneyBlock.description,
  steps,
  completionTitle = defaultPatientJourneyBlock.completionTitle,
  completionDescription = defaultPatientJourneyBlock.completionDescription,
  ctaLabel = defaultPatientJourneyBlock.ctaLabel,
  ctaUrl = defaultPatientJourneyBlock.ctaUrl,
}: PatientJourneyInteractiveProps) {
  const journeySteps = useMemo(() => normalizeSteps(steps), [steps])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [explored, setExplored] = useState<Set<number>>(() => new Set())
  const [showCelebration, setShowCelebration] = useState(false)

  const exploredCount = explored.size
  const allExplored = exploredCount >= journeySteps.length

  function toggleStep(index: number) {
    setExplored((current) => {
      const next = new Set(current)
      next.add(index)
      return next
    })
    setActiveIndex((current) => (current === index ? null : index))

    if (!showCelebration) {
      const nextExplored = new Set(explored)
      nextExplored.add(index)
      if (nextExplored.size >= journeySteps.length) {
        setShowCelebration(true)
      }
    }
  }

  return (
    <section className="my-14 md:my-20">
      <figure>
        <div className="rounded-[20px] border border-border bg-white px-5 py-10 shadow-[0_4px_6px_-1px_rgba(16,23,38,0.05)] sm:px-8 md:px-11">
          <div className="mb-8 text-center md:mb-[30px]">
            {eyebrow ? (
              <p className="font-brand-display mb-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground-subtle">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-brand-display text-balance text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-heading">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mx-auto mt-3 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <aside className="sticky top-20 hidden w-[236px] shrink-0 self-start rounded-2xl border border-border bg-background p-5 lg:block">
              <p className="font-brand-display mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground-subtle">
                Your progress
              </p>
              <div className="mb-0.5 flex items-baseline gap-1.5">
                <span className="font-brand-display text-[40px] font-bold leading-none tracking-[-0.03em] text-primary">
                  {exploredCount}
                </span>
                <span className="font-brand-display text-lg font-bold text-muted-foreground-subtle">
                  / {journeySteps.length}
                </span>
              </div>
              <p className="mb-[18px] text-[13px] text-muted-foreground">moments explored</p>

              <div className="flex flex-col">
                {journeySteps.map((step, index) => {
                  const isActive = activeIndex === index
                  const isExplored = explored.has(index)

                  return (
                    <div key={`${step.label}-${index}`}>
                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[9px] px-1.5 py-[7px] text-left transition-colors hover:bg-white",
                          isActive && "bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                            isExplored
                              ? "bg-primary text-white"
                              : isActive
                                ? "bg-primary/10 text-primary"
                                : "bg-white text-muted-foreground ring-1 ring-border",
                          )}
                        >
                          {isExplored ? (
                            <Check className="h-4 w-4" strokeWidth={2.4} />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-snug",
                            isActive || isExplored
                              ? "font-semibold text-heading"
                              : "text-muted-foreground",
                          )}
                        >
                          {step.label}
                        </span>
                      </button>
                      {index < journeySteps.length - 1 ? (
                        <span className="ml-5 block h-[9px] w-0.5 rounded-sm bg-border" />
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {journeySteps.map((step, index) => {
                const isOpen = activeIndex === index
                const StepIcon = stepIcons[index] ?? Target

                return (
                  <div
                    key={`${step.label}-panel-${index}`}
                    className="overflow-hidden rounded-[14px] border border-border bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleStep(index)}
                      className="flex w-full items-center gap-4 px-5 py-[18px] text-left transition-colors hover:bg-[#FAFBFC]"
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                          isOpen
                            ? "bg-primary text-white"
                            : "bg-background text-muted-foreground",
                        )}
                      >
                        <StepIcon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-brand-display block text-base font-bold tracking-[-0.01em] text-heading">
                          {index + 1} · {step.label}
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                          {step.teaser}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                          isOpen ? "bg-primary text-white" : "text-muted-foreground",
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180",
                          )}
                          strokeWidth={2.2}
                        />
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-[#F3D0D0] bg-[#FEF7F7] p-4">
                            <p className="font-brand-display mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B45353]">
                              {step.badTitle || "Typical approach"}
                            </p>
                            <p className="text-sm leading-relaxed text-[#7F1D1D]/80">
                              {step.badDescription}
                            </p>
                          </div>
                          <div className="rounded-xl border border-[#BFDBFE] bg-lake-pale p-4">
                            <p className="font-brand-display mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                              {step.goodTitle}
                            </p>
                            <p className="text-sm leading-relaxed text-heading/80">
                              {step.goodDescription}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 border-t border-border pt-4 text-sm font-medium italic text-heading">
                          {step.insight}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-[26px]">
            <div className="mb-[18px] flex items-center gap-4 rounded-[14px] bg-ink px-7 py-[22px]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-[rgba(124,176,232,0.15)] text-accent-on-dark">
                <Zap className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <p className="patient-journey-principle-eyebrow font-brand-display mb-1 text-[11px] font-semibold uppercase tracking-[0.1em]">
                  The principle
                </p>
                <p className="patient-journey-principle-headline font-brand-display text-balance text-[clamp(1.1875rem,2.4vw,1.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                  The ad starts the conversation. The system creates growth.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {principleCards.map((card) => (
                <div
                  key={card.text}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-lake-pale text-primary">
                    <card.icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
                  </span>
                  <span className="font-brand-display text-sm font-bold leading-snug text-heading">
                    {card.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {showCelebration && allExplored ? (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-lake-pale px-6 py-8 text-center">
              <p className="font-brand-display text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                All {journeySteps.length} moments explored
              </p>
              {completionTitle ? (
                <h3 className="font-brand-display mt-3 text-balance text-[clamp(1.5rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.026em] text-heading">
                  {completionTitle}
                </h3>
              ) : null}
              {completionDescription ? (
                <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                  {completionDescription}
                </p>
              ) : null}
              {ctaLabel && ctaUrl ? (
                <Link
                  href={ctaUrl}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-white shadow-[0_4px_14px_rgba(37,99,168,0.3)] transition-colors hover:bg-button-hover sm:w-auto"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="mt-3.5 text-sm font-semibold text-muted-foreground-subtle underline underline-offset-[3px] transition-colors hover:text-muted-foreground"
              >
                Keep exploring
              </button>
            </div>
          ) : null}
        </div>

        <figcaption className="mt-4 text-center text-[13px] text-muted-foreground-subtle">
          Lakeside Marketing · The Natural Practice Growth System
        </figcaption>
      </figure>
    </section>
  )
}

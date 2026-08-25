"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import type { GrowthSystemContent } from "@/lib/homepage-template"
import { cn } from "@/lib/utils"

type GrowthSystemFunnelProps = {
  content: Pick<
    GrowthSystemContent,
    | "funnelEyebrow"
    | "funnelHeadline"
    | "funnelDescription"
    | "funnelLinkLabel"
    | "funnelLinkUrl"
    | "funnelSteps"
  >
}

type FunnelStep = GrowthSystemContent["funnelSteps"][number]

function FunnelDetailCard({ step, priorityImage }: { step: FunnelStep; priorityImage?: boolean }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-raised">
      {step.imageUrl ? (
        <div className="overflow-hidden border-b border-border bg-background">
          <Image
            src={step.imageUrl}
            alt={step.imageAlt ?? step.title}
            width={640}
            height={360}
            className="h-auto w-full object-cover"
            priority={priorityImage}
          />
        </div>
      ) : null}
      <div className="p-6 lg:p-9">
        <span className="mb-3.5 font-brand-display text-[11px] font-bold uppercase tracking-eyebrow text-primary">
          {step.tag}
        </span>
        <h3 className="font-brand-display text-balance text-[22px] font-bold tracking-display text-heading lg:text-[26px]">
          {step.title}
        </h3>
        <p className="mt-3.5 text-pretty text-base leading-relaxed text-[#4B5563]">
          {step.detail}
        </p>
      </div>
    </div>
  )
}

function StepNumber({
  index,
  isActive,
  compact,
}: {
  index: number
  isActive?: boolean
  compact?: boolean
}) {
  return (
    <span
      className={cn(
        "growth-funnel-step-num flex shrink-0 items-center justify-center rounded-full font-brand-display font-bold",
        compact ? "h-6 w-6 text-xs lg:h-[30px] lg:w-[30px] lg:text-[13px]" : "h-[30px] w-[30px] text-[13px]",
        isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
      )}
    >
      {index + 1}
    </span>
  )
}

export function GrowthSystemFunnel({ content }: GrowthSystemFunnelProps) {
  const [activeStep, setActiveStep] = useState(0)
  const active = content.funnelSteps[activeStep] ?? content.funnelSteps[0]

  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-[1120px] min-w-0 overflow-hidden px-6 py-[88px] pb-[70px]"
    >
      <div className="mb-12 max-w-[640px]">
        <SectionEyebrow>{content.funnelEyebrow}</SectionEyebrow>
        <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-display tracking-display text-heading">
          {content.funnelHeadline}
        </h2>
        <p className="mt-3.5 text-pretty text-lg leading-relaxed text-muted-foreground">
          {content.funnelDescription}{" "}
          <Link
            href={content.funnelLinkUrl}
            className="font-semibold text-primary underline decoration-primary/40 underline-offset-3"
          >
            {content.funnelLinkLabel}
          </Link>
          .
        </p>
      </div>

      {/* Mobile: CSS-only radio + label tabs (no JS — reliable on iOS Safari) */}
      <div id="growth-funnel-mobile" className="w-full min-w-0 lg:hidden">
        {content.funnelSteps.map((_, index) => (
          <input
            key={`mobile-radio-${index}`}
            type="radio"
            name="growth-funnel-step"
            id={`growth-funnel-step-${index}`}
            defaultChecked={index === 0}
            className="growth-funnel-mobile-radio sr-only"
          />
        ))}

        <div
          className="growth-funnel-mobile-tablist relative z-10 mb-6 grid min-w-0 grid-cols-2 gap-3"
          role="tablist"
          aria-label="New patient system steps"
        >
          {content.funnelSteps.map((step, index) => (
            <label
              key={`mobile-tab-${step.tag}-${index}`}
              htmlFor={`growth-funnel-step-${index}`}
              data-funnel-tab={index}
              className="growth-funnel-mobile-tab flex min-w-0 cursor-pointer touch-manipulation items-center gap-2 rounded-xl border border-border bg-white px-3 py-3 text-left text-secondary-button-foreground"
            >
              <StepNumber index={index} compact />
              <span className="min-w-0 font-brand-display text-[13px] font-semibold leading-snug tracking-[-0.01em]">
                {step.buttonLabel}
              </span>
            </label>
          ))}
        </div>

        <div className="growth-funnel-mobile-panels relative z-0 min-w-0">
          {content.funnelSteps.map((step, index) => (
            <div
              key={`mobile-panel-${step.tag}-${index}`}
              id={`growth-funnel-panel-${index}`}
              className="growth-funnel-mobile-panel"
              role="tabpanel"
              aria-live="polite"
            >
              <FunnelDetailCard step={step} priorityImage={index === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: JS-controlled tabs */}
      <div className="hidden min-w-0 flex-col gap-6 lg:flex lg:flex-row lg:items-start lg:gap-9">
        <div
          className="relative z-10 grid min-w-0 grid-cols-1 gap-1.5 lg:min-w-[280px] lg:flex-1"
          role="tablist"
          aria-label="New patient system steps"
        >
          {content.funnelSteps.map((step, index) => {
            const isActive = index === activeStep
            return (
              <button
                key={`desktop-tab-${step.tag}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "relative z-10 flex w-full min-w-0 cursor-pointer touch-manipulation items-center gap-3.5 rounded-xl border px-[18px] py-4 text-left transition-colors",
                  isActive
                    ? "border-primary bg-lake-pale text-heading"
                    : "border-border bg-white text-secondary-button-foreground hover:border-[#B8BBC2]",
                )}
              >
                <StepNumber index={index} isActive={isActive} />
                <span className="min-w-0 font-brand-display text-body font-semibold leading-snug tracking-[-0.01em]">
                  {step.buttonLabel}
                </span>
              </button>
            )
          })}
        </div>

        <div
          className="relative z-0 min-w-0 flex-1 lg:min-w-[300px]"
          role="tabpanel"
          aria-live="polite"
          id="growth-funnel-detail"
        >
          <FunnelDetailCard step={active} priorityImage={activeStep === 0} />
        </div>
      </div>
    </section>
  )
}

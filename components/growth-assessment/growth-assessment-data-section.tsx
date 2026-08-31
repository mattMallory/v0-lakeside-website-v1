import Link from "next/link"
import { UserCheck } from "lucide-react"

import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import type {
  GrowthAssessmentDataSource,
  GrowthAssessmentUseCase,
} from "@/lib/growth-assessment-defaults"
import { getIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type GrowthAssessmentDataSectionProps = {
  eyebrow: string
  headline: string
  description: string
  credibilityLine: string
  dataSources: GrowthAssessmentDataSource[]
  humanReviewLabel: string
  flowSteps: string[]
  dataSourcesNote: string
  useCasesHeadline: string
  useCasesDescription: string
  useCases: GrowthAssessmentUseCase[]
  bridgeLine: string
  ctaLabel: string
}

function DataFlowHub({
  dataSources,
  humanReviewLabel,
  flowSteps,
}: Pick<
  GrowthAssessmentDataSectionProps,
  "dataSources" | "humanReviewLabel" | "flowSteps"
>) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {dataSources.map((source) => {
          const Icon = getIcon(source.icon)
          return (
            <div
              key={source.title}
              className="rounded-xl border border-border bg-white px-3.5 py-3 shadow-[0_1px_0_rgba(14,23,38,.04)]"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F8FC] text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="font-brand-display text-[13.5px] font-bold leading-snug text-heading">
                    {source.title}
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                    {source.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="my-4 flex justify-center" aria-hidden="true">
        <div className="flex flex-col items-center gap-1">
          <span className="h-5 w-px bg-[#D6D9DE]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">↓</span>
          <span className="h-5 w-px bg-[#D6D9DE]" />
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-[#F4F8FC] px-5 py-4 text-center">
        <p className="font-brand-display text-[11px] font-bold uppercase tracking-[0.1em] text-primary">
          Lakeside
        </p>
        <p className="font-brand-display text-[17px] font-bold tracking-[-0.015em] text-heading">
          Growth Assessment
        </p>
      </div>

      <div className="my-3 flex justify-center" aria-hidden="true">
        <span className="h-4 w-px bg-[#D6D9DE]" />
      </div>

      <div className="flex items-center justify-center gap-2.5 rounded-xl border border-[#0E1726] bg-[#0E1726] px-5 py-3.5 text-center text-white">
        <UserCheck className="h-[18px] w-[18px] shrink-0 text-[#7CB0E8]" strokeWidth={1.8} />
        <p className="font-brand-display text-[15px] font-bold tracking-[-0.01em]">
          {humanReviewLabel}
        </p>
      </div>

      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280]"
        aria-label={flowSteps.join(", ")}
      >
        {flowSteps.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-[#C4C9D1]">
                →
              </span>
            ) : null}
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

export function GrowthAssessmentDataSection({
  eyebrow,
  headline,
  description,
  credibilityLine,
  dataSources,
  humanReviewLabel,
  flowSteps,
  dataSourcesNote,
  useCasesHeadline,
  useCasesDescription,
  useCases,
  bridgeLine,
  ctaLabel,
}: GrowthAssessmentDataSectionProps) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-[88px]">
      <div className="rounded-2xl border border-border bg-white p-[clamp(24px,4vw,40px)]">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
              {headline}
            </h2>
            <div className="mt-4 space-y-4 text-pretty text-[16.5px] leading-relaxed text-muted-foreground">
              {description.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 border-l-2 border-primary/30 pl-4 text-[14.5px] font-medium leading-relaxed text-[#374151]">
              {credibilityLine}
            </p>
            <p className="mt-5 text-[12.5px] leading-relaxed text-[#9CA3AF]">{dataSourcesNote}</p>
          </div>

          <DataFlowHub
            dataSources={dataSources}
            humanReviewLabel={humanReviewLabel}
            flowSteps={flowSteps}
          />
        </div>

        <div className="mt-[clamp(48px,6vw,72px)] border-t border-[#F1F2F4] pt-[clamp(40px,5vw,56px)]">
          <div className="mb-9 max-w-[640px]">
            <h3 className="font-brand-display text-balance text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.025em] text-heading">
              {useCasesHeadline}
            </h3>
            <p className="mt-3 text-pretty text-[16px] leading-relaxed text-muted-foreground">
              {useCasesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-border bg-[#FAFAF9] p-[22px]"
              >
                <p className="font-brand-display text-[13px] font-bold tabular-nums text-primary">
                  {item.number}
                </p>
                <h4 className="mt-2 font-brand-display text-[16.5px] font-bold tracking-[-0.01em] text-heading">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-brand-display text-[17px] font-bold tracking-[-0.015em] text-heading">
            {bridgeLine}
          </p>
          <div className="mt-6 text-center">
            <Link
              href="#assessment"
              className={cn(
                "inline-flex rounded-full bg-primary px-[26px] py-[15px] font-brand-display text-[15px] font-bold text-white no-underline transition-opacity hover:opacity-90",
              )}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

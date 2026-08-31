import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { GrowthAssessmentForm, GrowthAssessmentHowNote, type GrowthAssessmentConsentCopy } from "@/components/growth-assessment/growth-assessment-form"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { layeredSectionBackground } from "@/lib/growth-system-backgrounds"
import type { GrowthAssessmentContent } from "@/lib/growth-assessment-defaults"
import { getIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

function SectionFormCta({
  label,
  variant = "light",
  centered = false,
}: {
  label: string
  variant?: "light" | "dark"
  centered?: boolean
}) {
  return (
    <div className={cn("mt-10", centered && "text-center")}>
      <Link
        href="#assessment"
        className={cn(
          "inline-flex rounded-full px-[26px] py-[15px] font-brand-display text-[15px] font-bold no-underline transition-opacity hover:opacity-90",
          variant === "dark" ? "bg-white text-[#0E1726]" : "bg-primary text-white",
        )}
      >
        {label}
      </Link>
    </div>
  )
}

const SCORECARD_ITEMS = [
  { label: "Market Opportunity", width: 80, tone: "strong", badge: "Verified", score: 80 },
  { label: "Business Economics", width: 70, tone: "strong", badge: "Provided", score: 70 },
  { label: "Visibility", width: 55, tone: "moderate", badge: "Verified", score: 55 },
  { label: "Website Conversion", width: 30, tone: "fix", badge: "Verified", score: 30 },
  { label: "Advertising Readiness", width: 45, tone: "moderate", badge: "Estimated", score: 45 },
  { label: "Patient Follow-Up", width: 40, tone: "fix", badge: "Estimated", score: 40 },
  { label: "Measurement & Tracking", width: 25, tone: "fix", badge: "Verified", score: 25 },
  { label: "Growth Roadmap", width: 60, tone: "moderate", badge: "Estimated", score: 60 },
] as const

function toneStyles(tone: (typeof SCORECARD_ITEMS)[number]["tone"]) {
  if (tone === "strong") {
    return {
      bar: "bg-[#1F7A4C]",
      badge: "bg-[#E9F5EE] text-[#1F7A4C]",
      label: "Strong",
    }
  }
  if (tone === "moderate") {
    return {
      bar: "bg-[#C08A1E]",
      badge: "bg-[#FBF3E2] text-[#8F6413]",
      label: "Moderate",
    }
  }
  return {
    bar: "bg-[#A8542F]",
    badge: "bg-[#F8EBE4] text-[#8F4527]",
    label: "Fix first",
  }
}

type GrowthAssessmentPageProps = {
  content: GrowthAssessmentContent
  consent: GrowthAssessmentConsentCopy
  heroBackgroundUrl?: string
  whyBackgroundUrl?: string
}

export function GrowthAssessmentPage({
  content,
  consent,
  heroBackgroundUrl,
  whyBackgroundUrl,
}: GrowthAssessmentPageProps) {
  const dashOffset = 157 - (content.heroSampleScore / 100) * 157

  return (
    <div className="bg-[#F9F7F4]">
      <header
        className="relative overflow-hidden bg-[#0B1220]"
        style={layeredSectionBackground(
          "linear-gradient(100deg, rgba(11,18,32,.62) 0%, rgba(11,18,32,.42) 55%, rgba(11,18,32,.18) 100%)",
          heroBackgroundUrl,
          { backgroundPosition: "center right" },
        )}
      >
        <div className="relative z-10 mx-auto grid max-w-[1120px] items-center gap-14 px-6 py-[84px] pb-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionEyebrow variant="dark">{content.heroEyebrow}</SectionEyebrow>
            <h1 className="font-brand-display text-balance text-[clamp(2.375rem,4.6vw,3.375rem)] font-bold leading-[1.12] tracking-[-0.03em] text-white">
              {content.heroHeadline}
            </h1>
            <p className="mt-5 max-w-[540px] text-pretty text-[18.5px] leading-relaxed text-[#B9C2CF]">
              {content.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#assessment"
                className="rounded-full bg-white px-[26px] py-[15px] font-brand-display text-[15px] font-bold text-[#0E1726] no-underline"
              >
                {content.heroPrimaryCta}
              </Link>
              <Link
                href="#report"
                className="rounded-lg border border-white/25 px-[26px] py-[15px] font-brand-display text-[15px] font-bold text-white no-underline"
              >
                {content.heroSecondaryCta}
              </Link>
            </div>
            <p className="mt-3.5 text-sm text-[#94A3B8]">{content.heroNote}</p>
          </div>

          <div className="max-w-[520px] rounded-2xl bg-white p-[26px] pb-[22px] shadow-[0_24px_60px_rgba(4,10,22,.45)] lg:max-w-none">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#EDEEF0] pb-3.5">
              <div>
                <p className="font-brand-display text-[11px] font-bold uppercase tracking-[0.1em] text-primary">
                  Growth Assessment
                </p>
                <p className="font-brand-display text-base font-bold text-heading">
                  {content.heroSamplePractice}
                </p>
              </div>
              <div className="text-center">
                <div className="relative mx-auto h-[58px] w-[58px]">
                  <svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
                    <circle cx="29" cy="29" r="25" fill="none" stroke="#E8E9EB" strokeWidth="6" />
                    <circle
                      cx="29"
                      cy="29"
                      r="25"
                      fill="none"
                      stroke="#2563A8"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="157"
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 29 29)"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center font-brand-display text-base font-bold text-heading">
                    {content.heroSampleScore}
                  </div>
                </div>
                <p className="mt-0.5 text-[10px] text-[#6B7280]">Growth score</p>
              </div>
            </div>

            <div className="mb-3.5 grid grid-cols-2 gap-2.5">
              <div className="rounded-[10px] bg-[#F4F8FC] p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-primary">
                  Top opportunity
                </p>
                <p className="font-brand-display text-[13.5px] font-bold leading-snug text-heading">
                  {content.heroTopOpportunity}
                </p>
              </div>
              <div className="rounded-[10px] bg-[#F4F8FC] p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-primary">
                  Suggested range
                </p>
                <p className="font-brand-display text-[13.5px] font-bold leading-snug text-heading">
                  {content.heroSuggestedRange}
                </p>
              </div>
            </div>

            <div className="mb-3.5">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">
                Priority actions
              </p>
              <ul className="flex flex-col gap-1.5">
                {content.heroPriorityActions.map((action, index) => (
                  <li key={action} className="flex gap-2 text-[13px] text-[#374151]">
                    <span className="font-brand-display font-bold text-primary">{index + 1}.</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[680px]">
          <SectionEyebrow>{content.problemEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.problemHeadline}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.problemDescription}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-[clamp(22px,3vw,32px)]">
          <div className="flex flex-wrap items-center gap-2 row-gap-3.5">
            {content.problemStages.map((stage, index) => {
              const highlighted = stage === content.problemHighlightStage
              return (
                <div key={stage} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-sm text-[#9CA3AF]">
                      →
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-full border px-[15px] py-2 font-brand-display text-[13.5px] font-bold",
                      highlighted
                        ? "border-primary bg-primary text-white"
                        : "border-[#D9E6F4] bg-[#F4F8FC] text-heading",
                    )}
                  >
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-[14.5px] text-muted-foreground">{content.problemFootnote}</p>
        </div>
      </section>

      <section id="assess" className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[640px]">
          <SectionEyebrow>{content.assessEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.assessHeadline}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.assessDescription}
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
          {content.assessItems.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="rounded-xl border border-border bg-white p-[22px]">
                <Icon className="mb-3 h-[22px] w-[22px] text-primary" strokeWidth={1.8} />
                <h3 className="font-brand-display text-[17px] font-bold tracking-[-0.01em] text-heading">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
        <SectionFormCta label={content.sectionCtaLabel} centered />
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[640px]">
          <SectionEyebrow>{content.howEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.howHeadline}
          </h2>
        </div>
        <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
          {content.howSteps.map((step) => (
            <div key={step.title} className="rounded-xl border border-border bg-white p-[26px]">
              <p className="font-brand-display text-[13px] font-bold text-primary">{step.label}</p>
              <h3 className="mt-3 font-brand-display text-[19px] font-bold tracking-[-0.015em] text-heading">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <GrowthAssessmentHowNote note={content.howNote} />
      </section>

      <section id="report" className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionEyebrow>{content.reportEyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
              {content.reportHeadline}
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {content.reportDescription}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 text-[14.5px] text-[#374151] sm:grid-cols-2 sm:gap-x-5">
              {content.reportChecklist.map((item) => (
                <div key={item} className="flex items-baseline gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                  {item}
                </div>
              ))}
            </div>
            {content.reportSamplePlanUrl && content.reportSamplePlanUrl !== "#" ? (
              <Link
                href={content.reportSamplePlanUrl}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D6D9DE] bg-white px-[22px] py-3 font-brand-display text-[14.5px] font-bold text-heading no-underline"
              >
                {content.reportSamplePlanLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-white p-[26px] shadow-[0_12px_36px_rgba(14,23,38,.08)]">
            <div className="mb-[18px] flex items-baseline justify-between">
              <p className="font-brand-display text-[15px] font-bold text-heading">
                Eight-pillar scorecard
              </p>
              <span className="text-[11.5px] text-[#9CA3AF]">Sample</span>
            </div>
            <div className="flex flex-col gap-3">
              {SCORECARD_ITEMS.map((item) => {
                const tone = toneStyles(item.tone)
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between gap-2 text-[13px]">
                      <span className="font-semibold text-[#374151]">{item.label}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="rounded border border-[#DFE2E7] px-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">
                          {item.badge}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em]",
                            tone.badge,
                          )}
                        >
                          {tone.label} · {item.score}
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-[#EDEEF0]">
                      <div
                        className={cn("h-full rounded-sm", tone.bar)}
                        style={{ width: `${item.width}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-[18px] border-t border-[#EDEEF0] pt-3.5 text-[13px] leading-relaxed text-muted-foreground">
              Color shows performance only — <strong className="text-[#1F7A4C]">green</strong> is
              working, <strong className="text-[#8F6413]">amber</strong> is improvable,{" "}
              <strong className="text-[#8F4527]">clay</strong> means fix it first. The grey label
              carries the evidence: Verified, Estimated, or Provided by you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[640px]">
          <SectionEyebrow>{content.financialEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.financialHeadline}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.financialDescription}
          </p>
        </div>
        <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3.5">
          {content.financialScenarios.map((scenario) => (
            <div
              key={scenario.title}
              className={cn(
                "rounded-xl p-[26px]",
                scenario.featured
                  ? "border border-[#0E1726] bg-[#0E1726] text-white"
                  : "border border-border bg-white",
              )}
            >
              <div className="mb-1.5 flex items-baseline justify-between">
                <h3
                  className={cn(
                    "font-brand-display text-[19px] font-bold",
                    scenario.featured ? "text-white" : "text-heading",
                  )}
                >
                  {scenario.title}
                </h3>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.05em]",
                    scenario.featured
                      ? "bg-[rgba(124,176,232,.14)] text-[#7CB0E8]"
                      : "bg-[#EFF1F4] text-[#4B5563]",
                  )}
                >
                  Example
                </span>
              </div>
              <p
                className={cn(
                  "mb-[18px] text-sm leading-relaxed",
                  scenario.featured ? "text-[#B9C2CF]" : "text-muted-foreground",
                )}
              >
                {scenario.description}
              </p>
              <div className="flex flex-col gap-2 text-sm">
                {scenario.rows.map((row, index) => (
                  <div
                    key={row.label}
                    className={cn(
                      "flex justify-between pb-2",
                      index < scenario.rows.length - 1 &&
                        (scenario.featured
                          ? "border-b border-white/10"
                          : "border-b border-[#F1F2F4]"),
                    )}
                  >
                    <span className={scenario.featured ? "text-[#94A3B8]" : "text-muted-foreground"}>
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "font-brand-display font-bold",
                        scenario.featured ? "text-white" : "text-heading",
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-[760px] text-[13.5px] leading-relaxed text-[#9CA3AF]">
          {content.financialDisclaimer}
        </p>
        <SectionFormCta label={content.sectionCtaLabel} centered />
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[640px]">
          <SectionEyebrow>{content.whoEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.whoHeadline}
          </h2>
        </div>
        <div className="grid gap-3.5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-border bg-white p-[clamp(24px,3vw,32px)]">
            <p className="font-brand-display text-[17px] font-bold text-heading">
              The assessment may be a strong fit if:
            </p>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2.5 text-[15px] leading-snug text-[#374151]">
              {content.whoFitItems.map((item) => (
                <div key={item} className="flex items-baseline gap-2.5">
                  <span className="font-bold text-primary">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#E8E5DF] bg-[#F3F1ED] p-[clamp(24px,3vw,32px)]">
            <p className="font-brand-display text-[17px] font-bold text-heading">
              It may not be the right fit yet if:
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-[15px] leading-snug text-[#4B5563]">
              {content.whoNotFitItems.map((item) => (
                <div key={item} className="flex items-baseline gap-2.5">
                  <span className="text-[#9CA3AF]">—</span>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-[18px] border-t border-[#E8E5DF] pt-3.5 text-[13.5px] leading-relaxed text-muted-foreground">
              {content.whoNotFitNote}
            </p>
          </div>
        </div>
      </section>

      <section
        className="mt-[88px] bg-[#0E1726]"
        style={layeredSectionBackground(
          "linear-gradient(160deg, rgba(14,23,38,.66), rgba(14,23,38,.4))",
          whyBackgroundUrl,
        )}
      >
        <div className="mx-auto max-w-[1120px] px-6 py-20">
          <div className="mb-10 max-w-[640px]">
            <SectionEyebrow variant="dark">{content.whyEyebrow}</SectionEyebrow>
            <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
              {content.whyHeadline}
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-[#B9C2CF]">
              {content.whyDescription}
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-x-6 gap-y-2 text-[15px] text-[#D6DEE9]">
            {content.whyItems.map((item) => (
              <div key={item} className="flex items-baseline gap-2.5">
                <span className="font-bold text-[#7CB0E8]">✓</span>
                {item}
              </div>
            ))}
          </div>
          <SectionFormCta label={content.sectionCtaLabel} variant="dark" />
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pt-[88px]">
        <div className="mb-11 max-w-[640px]">
          <SectionEyebrow>{content.findingsEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.findingsHeadline}
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
          {content.findingsItems.map((finding) => (
            <div
              key={finding.title}
              className="flex flex-col gap-3.5 rounded-xl border border-border bg-white p-[26px]"
            >
              <h3 className="font-brand-display text-[18px] font-bold tracking-[-0.015em] text-heading">
                {finding.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                {finding.description}
              </p>
              <div className="border-t border-[#F1F2F4] pt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#9CA3AF]">
                  Business consequence
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#374151]">{finding.consequence}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-primary">
                  Recommended action
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#374151]">{finding.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-6 pt-[88px]">
        <div className="mb-9">
          <SectionEyebrow>{content.faqEyebrow}</SectionEyebrow>
          <h2 className="font-brand-display text-balance text-[clamp(1.75rem,3.6vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-heading">
            {content.faqHeadline}
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {content.faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-white px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-brand-display text-[16.5px] font-bold text-heading">
                {item.question}
                <span className="text-[#9CA3AF] transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#4B5563]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="assessment" className="mx-auto max-w-6xl px-6 pb-14 pt-[88px] md:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28 lg:pt-2">
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              {content.formEyebrow}
            </p>
            <h2 className="mt-3 max-w-[18ch] text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {content.formHeadline}
            </h2>
            <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              {content.formDescription}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[15px] text-muted-foreground">
              {content.formBullets.map((bullet) => (
                <div key={bullet} className="flex items-baseline gap-2.5">
                  <span className="font-bold text-primary">✓</span>
                  {bullet}
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-md border-l-2 border-primary/30 pl-4 text-[15px] leading-relaxed text-muted-foreground">
              {content.formQuote}
            </p>
          </div>
          <div className="min-w-0">
            <GrowthAssessmentForm
              ctaLabel={content.formCtaLabel}
              processingSteps={content.formProcessingSteps}
              consent={consent}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

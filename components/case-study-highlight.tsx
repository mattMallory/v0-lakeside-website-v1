import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CaseStudyMetricsGrid } from "@/components/case-study-metrics-grid"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { Button } from "@/components/ui/button"
import type { CaseStudyPost } from "@/lib/blog-types"
import { growthSystemBackgrounds } from "@/lib/homepage-growth-system-defaults"
import { cn } from "@/lib/utils"

type CaseStudyHighlightProps = {
  eyebrow: string
  headline: string
  caseStudy: CaseStudyPost
  variant?: "light" | "dark"
  className?: string
}

export function CaseStudyHighlight({
  eyebrow,
  headline,
  caseStudy,
  variant = "light",
  className,
}: CaseStudyHighlightProps) {
  const isDark = variant === "dark"

  return (
    <section
      className={cn("py-20", isDark ? "bg-ink" : "bg-white", className)}
      style={
        isDark
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(14,23,38,.9) 0%, rgba(14,23,38,.62) 45%, rgba(14,23,38,.9) 100%), url('${growthSystemBackgrounds.pillars}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-10">
          <div>
            {isDark ? (
              <SectionEyebrow variant="dark">{eyebrow}</SectionEyebrow>
            ) : (
              <p className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-primary">
                {eyebrow}
              </p>
            )}
            <h2
              className={cn(
                "mt-3 text-balance text-3xl font-bold tracking-[-0.026em] sm:text-4xl",
                isDark ? "text-white" : "text-heading",
              )}
            >
              {headline}
            </h2>
            {caseStudy.clientName ? (
              <p className={cn("mt-4 text-lg font-semibold", isDark ? "text-white" : "text-heading")}>
                {caseStudy.clientName}
              </p>
            ) : null}
            {caseStudy.clientLocation ? (
              <p className={cn("mt-1 text-body", isDark ? "text-muted-foreground-on-dark" : "text-muted-foreground")}>
                {caseStudy.clientLocation}
              </p>
            ) : null}
            <p
              className={cn(
                "mt-5 text-pretty text-base leading-relaxed",
                isDark ? "text-foreground-on-dark" : "text-muted-foreground",
              )}
            >
              {caseStudy.excerpt}
            </p>

            <Button
              render={<Link href={`/blog/${caseStudy.slug}`} />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className={cn(
                "mt-8 gap-2",
                isDark && "border-white/25 bg-white text-ink hover:bg-white/90 hover:text-ink",
              )}
            >
              Read the case study
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <CaseStudyMetricsGrid metrics={caseStudy.metrics} hideFullWidth className="min-w-0" />
        </div>
      </div>
    </section>
  )
}

import { AnimatedMetricValue } from "@/components/animated-metric-value"
import { cn } from "@/lib/utils"
import type { CaseStudyMetric } from "@/lib/blog-types"

type CaseStudyMetricsGridProps = {
  metrics: CaseStudyMetric[]
  className?: string
  hideFullWidth?: boolean
}

function MetricCard({ metric }: { metric: CaseStudyMetric }) {
  return (
    <article
      className={cn(
        "relative flex h-full min-w-0 flex-col rounded-[16px] bg-ink p-5 md:p-6",
        metric.isHighlighted && "ring-2 ring-primary",
      )}
    >
      {metric.isHighlighted ? (
        <span className="absolute -top-3 right-5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
          {metric.highlightLabel || "Featured Result"}
        </span>
      ) : null}

      <p className="font-brand-display text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
        {metric.eyebrow}
      </p>

      <p className="mt-4 text-3xl font-bold tracking-[-0.03em] whitespace-nowrap text-white md:text-[2.35rem] md:leading-none">
        <AnimatedMetricValue
          value={metric.value}
          prefix={metric.prefix}
          suffix={metric.suffix}
          decimals={metric.decimals}
          displayValue={metric.displayValue}
        />
      </p>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">{metric.description}</p>
    </article>
  )
}

export function CaseStudyMetricsGrid({
  metrics,
  className,
  hideFullWidth = false,
}: CaseStudyMetricsGridProps) {
  const visibleMetrics = hideFullWidth ? metrics.filter((metric) => !metric.spanFull) : metrics
  const standardMetrics = visibleMetrics.filter((metric) => !metric.spanFull)
  const fullWidthMetrics = visibleMetrics.filter((metric) => metric.spanFull)

  return (
    <div className={cn("space-y-4", className)} data-case-study-metrics>
      {standardMetrics.length > 0 ? (
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          {standardMetrics.map((metric) => (
            <MetricCard key={metric.eyebrow} metric={metric} />
          ))}
        </div>
      ) : null}

      {fullWidthMetrics.map((metric) => (
        <div key={metric.eyebrow}>
          <MetricCard metric={metric} />
        </div>
      ))}
    </div>
  )
}

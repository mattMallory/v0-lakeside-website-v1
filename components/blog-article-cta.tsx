import Link from "next/link"
import { ArrowRight } from "lucide-react"

type BlogArticleCtaProps = {
  eyebrow?: string | null
  title: string
  description?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}

export function BlogArticleCta({
  eyebrow,
  title,
  description,
  ctaLabel = "Schedule a conversation",
  ctaUrl = "/consultation",
}: BlogArticleCtaProps) {
  return (
    <section className="blog-article-cta-breakout my-14 md:my-20">
      <div className="rounded-2xl bg-ink px-6 py-14 text-center sm:px-10 md:py-16">
        {eyebrow ? (
          <p className="blog-article-cta-eyebrow font-brand-display mb-4 text-xs font-semibold uppercase tracking-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="blog-article-cta-title font-brand-display mx-auto max-w-3xl text-balance text-[clamp(1.75rem,4vw,2.375rem)] font-bold leading-display">
          {title}
        </h2>
        {description ? (
          <p className="blog-article-cta-description mx-auto mt-4 max-w-[560px] text-pretty text-lg leading-relaxed">
            {description}
          </p>
        ) : null}
        {ctaLabel && ctaUrl ? (
          <Link
            href={ctaUrl}
            className="blog-article-cta-button mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold shadow-raised transition-colors hover:bg-[#F9FAFB]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </section>
  )
}

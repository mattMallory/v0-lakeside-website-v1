import { withFallback } from "@/lib/cms-mappers"

export type CaseStudyHighlightContent = {
  eyebrow: string
  headline: string
  featuredPostSlug: string | null
}

export const defaultCaseStudyHighlightContent: CaseStudyHighlightContent = {
  eyebrow: "Client Results",
  headline: "From Local Practice To National Growth",
  featuredPostSlug: "tuscola-pain-wellness-center-case-study",
}

type FeaturedPostLike = {
  slug?: string | null
}

export function resolveFeaturedPostSlug(
  post: number | FeaturedPostLike | null | undefined,
  fallback: string | null,
): string | null {
  if (typeof post === "object" && post && typeof post.slug === "string" && post.slug.trim()) {
    return post.slug
  }

  return fallback
}

export function mapCaseStudyHighlight(
  doc: {
    caseStudyEyebrow?: string | null
    caseStudyHeadline?: string | null
    caseStudyFeaturedPost?: number | FeaturedPostLike | null
  },
  fallback: CaseStudyHighlightContent = defaultCaseStudyHighlightContent,
): CaseStudyHighlightContent {
  return {
    eyebrow: withFallback(doc.caseStudyEyebrow, fallback.eyebrow),
    headline: withFallback(doc.caseStudyHeadline, fallback.headline),
    featuredPostSlug: resolveFeaturedPostSlug(doc.caseStudyFeaturedPost, fallback.featuredPostSlug),
  }
}

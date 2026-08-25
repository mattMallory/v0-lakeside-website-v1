export type CaseStudyHighlightContent = {
  eyebrow: string
  headline: string
  featuredPostSlug: string | null
  backgroundImageUrl: string
}

export const defaultCaseStudyHighlightContent: CaseStudyHighlightContent = {
  eyebrow: "Client Results",
  headline: "From Local Practice To National Growth",
  featuredPostSlug: "tuscola-pain-wellness-center-case-study",
  backgroundImageUrl: "",
}

type FeaturedPostLike = {
  slug?: string | null
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
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
    caseStudyBackground?: number | { url?: string | null } | null
  },
  fallback: CaseStudyHighlightContent = defaultCaseStudyHighlightContent,
): CaseStudyHighlightContent {
  const background =
    typeof doc.caseStudyBackground === "object" &&
    doc.caseStudyBackground &&
    typeof doc.caseStudyBackground.url === "string" &&
    doc.caseStudyBackground.url.trim()
      ? doc.caseStudyBackground.url
      : undefined

  return {
    eyebrow: withFallback(doc.caseStudyEyebrow, fallback.eyebrow),
    headline: withFallback(doc.caseStudyHeadline, fallback.headline),
    featuredPostSlug: resolveFeaturedPostSlug(doc.caseStudyFeaturedPost, fallback.featuredPostSlug),
    backgroundImageUrl: background ?? fallback.backgroundImageUrl,
  }
}

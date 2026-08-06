export type BlogCategory = {
  id: string
  name: string
  slug: string
}

export type BlogTag = {
  id: string
  name: string
  slug: string
}

export type BlogPostSummary = {
  id: string
  title: string
  slug: string
  excerpt: string
  authorName: string
  readTime: string | null
  publishedAt: string
  featuredImageUrl: string | null
  featuredImageAlt: string | null
  category: BlogCategory | null
  tags: BlogTag[]
  isCaseStudy: boolean
}

export type BlogPost = BlogPostSummary & {
  content: Record<string, unknown>
  clientName?: string | null
  clientLocation?: string | null
  practiceInfo?: CaseStudyPracticeInfo
  metrics?: CaseStudyMetric[]
  isCaseStudy: boolean
}

export type CaseStudyMetric = {
  eyebrow: string
  value?: number | null
  prefix?: string | null
  suffix?: string | null
  decimals?: number | null
  displayValue?: string | null
  description: string
  isHighlighted?: boolean | null
  highlightLabel?: string | null
  spanFull?: boolean | null
}

export type CaseStudyPracticeInfo = {
  practiceType?: string | null
  services?: string | null
  engagementFocus?: string | null
  marketReach?: string | null
}

// clientName and clientLocation are nullable on purpose: a case study that does not
// carry its own client details must render without them rather than borrow another
// client's. Consumers guard each field before rendering it.
export type CaseStudyPost = BlogPost & {
  clientName: string | null
  clientLocation: string | null
  practiceInfo: CaseStudyPracticeInfo
  metrics: CaseStudyMetric[]
  isCaseStudy: true
}

export function formatBlogDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate))
}

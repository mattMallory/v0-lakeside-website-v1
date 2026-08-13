import type { BlogCategory, BlogPost, BlogPostSummary, BlogTag, CaseStudyMetric, CaseStudyPost } from "@/lib/blog-types"
import { CASE_STUDY_TAG_SLUG, defaultTuscolaCaseStudy } from "@/lib/case-study-defaults"
import { resolveMediaAlt, resolveMediaUrl, type MediaLike } from "@/lib/cms-mappers"

type CategoryDoc = {
  id: string | number
  name?: string | null
  slug?: string | null
}

type TagDoc = {
  id: string | number
  name?: string | null
  slug?: string | null
}

type CaseStudyMetricDoc = {
  eyebrow?: string | null
  value?: number | null
  prefix?: string | null
  suffix?: string | null
  decimals?: number | null
  displayValue?: string | null
  description?: string | null
  isHighlighted?: boolean | null
  highlightLabel?: string | null
  spanFull?: boolean | null
}

type PostDoc = {
  id: string | number
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  authorName?: string | null
  readTime?: string | null
  publishedAt?: string | null
  content?: Record<string, unknown> | null
  featuredImage?: number | MediaLike | null
  category?: number | CategoryDoc | null
  tags?: Array<number | TagDoc> | null
  postType?: "article" | "case-study" | null
  clientName?: string | null
  clientLocation?: string | null
  clientPracticeType?: string | null
  clientServices?: string | null
  clientEngagementFocus?: string | null
  clientMarketReach?: string | null
  caseStudyMetrics?: CaseStudyMetricDoc[] | null
}

function mapCategory(doc: number | CategoryDoc | null | undefined): BlogCategory | null {
  if (!doc || typeof doc === "number") return null
  if (!doc.name || !doc.slug) return null
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
  }
}

function mapTag(doc: number | TagDoc): BlogTag | null {
  if (typeof doc === "number") return null
  if (!doc.name || !doc.slug) return null
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
  }
}

// Every default here is generic. A metric must never inherit a value, prefix, suffix or
// decimal precision from another client's metric — that would publish one practice's
// numbers under another practice's name.
function mapCaseStudyMetric(doc: CaseStudyMetricDoc): CaseStudyMetric | null {
  if (!doc.eyebrow || !doc.description) return null

  return {
    eyebrow: doc.eyebrow,
    value: doc.value ?? undefined,
    prefix: doc.prefix ?? "",
    suffix: doc.suffix ?? "",
    decimals: doc.decimals ?? 0,
    displayValue: doc.displayValue ?? undefined,
    description: doc.description,
    isHighlighted: Boolean(doc.isHighlighted),
    highlightLabel: doc.highlightLabel ?? "Featured Result",
    spanFull: Boolean(doc.spanFull),
  }
}

function isCaseStudyDoc(doc: PostDoc): boolean {
  if (doc.postType === "case-study") return true

  return (doc.tags || []).some((tag) => {
    if (typeof tag === "number") return false
    return tag.slug === CASE_STUDY_TAG_SLUG
  })
}

// Returns only the metrics this post actually carries. A post with none renders none.
function mapCaseStudyMetrics(metrics: CaseStudyMetricDoc[] | null | undefined): CaseStudyMetric[] {
  return (
    metrics
      ?.map((metric) => mapCaseStudyMetric(metric))
      .filter((metric): metric is CaseStudyMetric => Boolean(metric)) ?? []
  )
}

function mapPostSummary(doc: PostDoc): BlogPostSummary | null {
  if (!doc.title || !doc.slug || !doc.excerpt || !doc.publishedAt) return null

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    authorName: doc.authorName || "Lakeside Team",
    readTime: doc.readTime || null,
    publishedAt: doc.publishedAt,
    // The shared resolvers report absence as undefined; BlogPostSummary reports it as
    // null, so the two are reconciled here rather than widening the public type.
    featuredImageUrl: resolveMediaUrl(doc.featuredImage) ?? null,
    featuredImageAlt: resolveMediaAlt(doc.featuredImage) ?? null,
    category: mapCategory(doc.category),
    tags: (doc.tags || []).map(mapTag).filter((tag): tag is BlogTag => Boolean(tag)),
    isCaseStudy: isCaseStudyDoc(doc),
  }
}

function mapCaseStudyPracticeInfo(doc: PostDoc) {
  return {
    practiceType: doc.clientPracticeType,
    services: doc.clientServices,
    engagementFocus: doc.clientEngagementFocus,
    marketReach: doc.clientMarketReach,
  }
}

function mapPost(doc: PostDoc): BlogPost | null {
  const summary = mapPostSummary(doc)
  if (!summary || !doc.content) return null

  const isCaseStudy = isCaseStudyDoc(doc)

  return {
    ...summary,
    content: doc.content,
    clientName: doc.clientName,
    clientLocation: doc.clientLocation,
    practiceInfo: isCaseStudy ? mapCaseStudyPracticeInfo(doc) : undefined,
    metrics: isCaseStudy ? mapCaseStudyMetrics(doc.caseStudyMetrics) : undefined,
    isCaseStudy,
  }
}

// Presents a post as a case study using only its own data. Fields the post does not
// carry stay empty so consumers can omit them; they are never filled from another
// client's case study.
function toCaseStudyPost(post: BlogPost): CaseStudyPost | null {
  if (!post.isCaseStudy) return null

  return {
    ...post,
    clientName: post.clientName?.trim() || null,
    clientLocation: post.clientLocation?.trim() || null,
    practiceInfo: {
      practiceType: post.practiceInfo?.practiceType ?? null,
      services: post.practiceInfo?.services ?? null,
      engagementFocus: post.practiceInfo?.engagementFocus ?? null,
      marketReach: post.practiceInfo?.marketReach ?? null,
    },
    metrics: post.metrics ?? [],
    isCaseStudy: true,
  }
}

async function getPayloadClient() {
  if (!process.env.PAYLOAD_SECRET) {
    return null
  }

  const { default: config } = await import("@payload-config")
  const { getPayload } = await import("payload")
  return getPayload({ config })
}

export async function getPublishedPosts(limit = 100): Promise<BlogPostSummary[]> {
  const payload = await getPayloadClient()
  if (!payload) return []

  try {
    const result = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-publishedAt",
      depth: 2,
      limit,
      overrideAccess: false,
    })

    const posts = result.docs
      .map(mapPostSummary)
      .filter((post): post is BlogPostSummary => Boolean(post))

    return posts.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  } catch (error) {
    console.error("[blog] Failed to load posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const payload = await getPayloadClient()
  if (!payload) return null

  try {
    const result = await payload.find({
      collection: "posts",
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
      },
      depth: 2,
      limit: 1,
      overrideAccess: false,
    })

    const doc = result.docs[0] as PostDoc | undefined
    if (doc) {
      return mapPost(doc)
    }

    if (slug === defaultTuscolaCaseStudy.slug) {
      return defaultTuscolaCaseStudy
    }

    return null
  } catch (error) {
    console.error(`[blog] Failed to load post "${slug}":`, error)

    if (slug === defaultTuscolaCaseStudy.slug) {
      return defaultTuscolaCaseStudy
    }

    return null
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyPost | null> {
  const post = await getPostBySlug(slug)
  if (post) {
    return toCaseStudyPost(post)
  }

  if (slug === defaultTuscolaCaseStudy.slug) {
    return defaultTuscolaCaseStudy
  }

  return null
}

export async function getFeaturedCaseStudy(slug?: string | null): Promise<CaseStudyPost> {
  if (slug) {
    const post = await getCaseStudyBySlug(slug)
    if (post) return post
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return defaultTuscolaCaseStudy
  }

  try {
    const result = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-publishedAt",
      depth: 2,
      limit: 20,
      overrideAccess: false,
    })

    const doc = result.docs.find((item) => isCaseStudyDoc(item as PostDoc)) as PostDoc | undefined
    const post = doc ? mapPost(doc) : null
    const caseStudy = post ? toCaseStudyPost(post) : null
    return caseStudy ?? defaultTuscolaCaseStudy
  } catch (error) {
    console.error("[blog] Failed to load featured case study:", error)
    return defaultTuscolaCaseStudy
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const payload = await getPayloadClient()
  if (!payload) return []

  try {
    const result = await payload.find({
      collection: "categories",
      sort: "name",
      depth: 0,
      limit: 100,
    })

    return result.docs
      .map((doc) => mapCategory(doc as CategoryDoc))
      .filter((category): category is BlogCategory => Boolean(category))
  } catch (error) {
    console.error("[blog] Failed to load categories:", error)
    return []
  }
}

export async function getBlogTags(): Promise<BlogTag[]> {
  const payload = await getPayloadClient()
  if (!payload) return []

  try {
    const result = await payload.find({
      collection: "tags",
      sort: "name",
      depth: 0,
      limit: 100,
    })

    return result.docs
      .map((doc) => mapTag(doc as TagDoc))
      .filter((tag): tag is BlogTag => Boolean(tag))
  } catch (error) {
    console.error("[blog] Failed to load tags:", error)
    return []
  }
}

export type { BlogCategory, BlogPost, BlogPostSummary, BlogTag, CaseStudyMetric, CaseStudyPost } from "@/lib/blog-types"
export { formatBlogDate } from "@/lib/blog-types"

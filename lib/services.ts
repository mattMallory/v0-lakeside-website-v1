import {
  defaultServicesContent,
  type ServiceOffering,
  type ServicesContent,
  type TechCategory,
} from "@/lib/services-defaults"
import { mapCaseStudyHighlight } from "@/lib/case-study-highlight"

type MediaLike = {
  url?: string | null
  alt?: string | null
}

type TechCategoryItemDoc = {
  label?: string | null
}

type TechCategoryDoc = {
  title?: string | null
  image?: number | MediaLike | null
  imageAlt?: string | null
  items?: TechCategoryItemDoc[] | null
}

type OfferingItemDoc = {
  icon?: string | null
  title?: string | null
  description?: string | null
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mergeArray<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  if (!value || value.length === 0) return fallback
  return value
}

function resolveMediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.url === "string" && media.url.trim() ? media.url : undefined
}

function resolveMediaAlt(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.alt === "string" && media.alt.trim() ? media.alt : undefined
}

function mapTechCategoryItems(
  items: TechCategoryItemDoc[] | null | undefined,
  fallback: string[],
): string[] {
  const mapped =
    items
      ?.map((item) => (typeof item.label === "string" ? item.label.trim() : ""))
      .filter((label) => label.length > 0) ?? []

  return mapped.length > 0 ? mapped : fallback
}

function mapTechCategory(doc: TechCategoryDoc, fallback: TechCategory): TechCategory | null {
  if (!doc.title) return null

  const imageUrl = resolveMediaUrl(doc.image) ?? fallback.imageUrl

  return {
    title: doc.title,
    items: mapTechCategoryItems(doc.items, fallback.items),
    imageUrl,
    imageAlt: withFallback(
      doc.imageAlt ?? resolveMediaAlt(doc.image),
      fallback.imageAlt ?? doc.title,
    ),
  }
}

function mapOfferingItem(doc: OfferingItemDoc, fallback: ServiceOffering): ServiceOffering | null {
  if (!doc.title || !doc.description) return null

  return {
    icon: withFallback(doc.icon, fallback.icon),
    title: doc.title,
    description: doc.description,
  }
}

export async function getServicesContent(): Promise<ServicesContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultServicesContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const services = await payload.findGlobal({
      slug: "services-page",
      depth: 2,
    })

    const fallbackCategories = defaultServicesContent.technology.categories
    const categories = mergeArray(services.technologyCategories, fallbackCategories)
      .map((category, index) =>
        mapTechCategory(category as TechCategoryDoc, fallbackCategories[index] ?? fallbackCategories[0]),
      )
      .filter((category): category is TechCategory => Boolean(category))

    const fallbackOfferings = defaultServicesContent.offerings.items
    const offeringsItems = mergeArray(services.offeringsItems, fallbackOfferings)
      .map((item, index) => mapOfferingItem(item as OfferingItemDoc, fallbackOfferings[index] ?? fallbackOfferings[0]))
      .filter((item): item is ServiceOffering => Boolean(item))

    const aboutImageUrl =
      resolveMediaUrl(services.aboutImage) ?? defaultServicesContent.about.imageUrl

    return {
      hero: {
        eyebrow: withFallback(services.heroEyebrow, defaultServicesContent.hero.eyebrow),
        title: withFallback(services.heroTitle, defaultServicesContent.hero.title),
        description: withFallback(services.heroDescription, defaultServicesContent.hero.description),
        backgroundImageUrl:
          resolveMediaUrl(services.heroBackground as number | MediaLike | null | undefined) ??
          defaultServicesContent.hero.backgroundImageUrl,
      },
      offerings: {
        eyebrow: withFallback(services.offeringsEyebrow, defaultServicesContent.offerings.eyebrow),
        headline: withFallback(services.offeringsHeadline, defaultServicesContent.offerings.headline),
        items: offeringsItems.length > 0 ? offeringsItems : defaultServicesContent.offerings.items,
      },
      technology: {
        eyebrow: withFallback(services.technologyEyebrow, defaultServicesContent.technology.eyebrow),
        headline: withFallback(services.technologyHeadline, defaultServicesContent.technology.headline),
        description: withFallback(
          services.technologyDescription,
          defaultServicesContent.technology.description,
        ),
        logos: defaultServicesContent.technology.logos,
        categories: categories.length > 0 ? categories : defaultServicesContent.technology.categories,
      },
      about: {
        eyebrow: withFallback(services.aboutEyebrow, defaultServicesContent.about.eyebrow),
        headline: withFallback(services.aboutHeadline, defaultServicesContent.about.headline),
        description: withFallback(services.aboutDescription, defaultServicesContent.about.description),
        cta: withFallback(services.aboutCta, defaultServicesContent.about.cta),
        imageUrl: aboutImageUrl,
        imageAlt: withFallback(
          services.aboutImageAlt ?? resolveMediaAlt(services.aboutImage),
          defaultServicesContent.about.imageAlt,
        ),
        backgroundImageUrl:
          resolveMediaUrl(services.aboutBackground as number | MediaLike | null | undefined) ??
          defaultServicesContent.about.backgroundImageUrl,
      },
      caseStudyHighlight: mapCaseStudyHighlight(
        services,
        defaultServicesContent.caseStudyHighlight,
      ),
      cta: {
        headline: withFallback(services.ctaHeadline, defaultServicesContent.cta.headline),
        subheadline: withFallback(services.ctaSubheadline, defaultServicesContent.cta.subheadline),
        button: withFallback(services.ctaButton, defaultServicesContent.cta.button),
      },
    }
  } catch (error) {
    console.error("[payload] Failed to load services content:", error)
    return defaultServicesContent
  }
}

export type { ServicesContent, TechCategory } from "@/lib/services-defaults"

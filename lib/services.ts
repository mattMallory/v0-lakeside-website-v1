import { resolveMediaAlt, resolveMediaUrl, withFallback } from "@/lib/cms-mappers"
import {
  defaultServicesContent,
  type ServiceOffering,
  type ServicesContent,
  type TechCategory,
} from "@/lib/services-defaults"
import { mapCaseStudyHighlight } from "@/lib/case-study-highlight"
import type { ServicesPage } from "@/payload-types"

// Document shapes come from the generated schema rather than hand-written mirrors, so a
// renamed or retyped CMS field fails the build instead of silently yielding undefined.
type TechCategoryDoc = NonNullable<ServicesPage["technologyCategories"]>[number]
type OfferingItemDoc = NonNullable<ServicesPage["offeringsItems"]>[number]

function mapTechCategoryItems(
  items: TechCategoryDoc["items"],
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

    // Each document array is mapped on its own. When it yields nothing, the section falls
    // back to its defaults below, which is what the previous merge-then-map achieved.
    const fallbackCategories = defaultServicesContent.technology.categories
    const categories = (services.technologyCategories ?? [])
      .map((category, index) =>
        mapTechCategory(category, fallbackCategories[index] ?? fallbackCategories[0]),
      )
      .filter((category): category is TechCategory => Boolean(category))

    const fallbackOfferings = defaultServicesContent.offerings.items
    const offeringsItems = (services.offeringsItems ?? [])
      .map((item, index) => mapOfferingItem(item, fallbackOfferings[index] ?? fallbackOfferings[0]))
      .filter((item): item is ServiceOffering => Boolean(item))

    const aboutImageUrl =
      resolveMediaUrl(services.aboutImage) ?? defaultServicesContent.about.imageUrl

    return {
      hero: {
        eyebrow: withFallback(services.heroEyebrow, defaultServicesContent.hero.eyebrow),
        title: withFallback(services.heroTitle, defaultServicesContent.hero.title),
        description: withFallback(services.heroDescription, defaultServicesContent.hero.description),
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

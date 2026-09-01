import type { Payload } from "payload"

import { defaultServicesContent } from "@/lib/services-defaults"

async function ensureMediaFromPublicFile(
  payload: Payload,
  filePath: string,
  alt: string,
): Promise<number | null> {
  const path = await import("path")
  const fs = await import("fs")
  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""))

  if (!fs.existsSync(absolutePath)) {
    return null
  }

  const filename = path.basename(absolutePath)
  const existing = await payload.find({
    collection: "media",
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]?.id) {
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: "media",
    data: { alt },
    filePath: absolutePath,
  })

  return created.id as number
}

export async function seedServicesIfEmpty(payload: Payload) {
  try {
    const services = await payload.findGlobal({
      slug: "services-page",
      depth: 0,
    })

    const offeringsItems = services.offeringsItems ?? []
    const technologyCategories = services.technologyCategories ?? []
    const needsOfferings = offeringsItems.length === 0
    const needsTechnology = technologyCategories.length === 0
    const isNew = !services.id

    if (!isNew && !needsOfferings && !needsTechnology) {
      return
    }

    const [aboutImageId, ...categoryImageIds] = await Promise.all([
      ensureMediaFromPublicFile(
        payload,
        defaultServicesContent.about.imageUrl,
        defaultServicesContent.about.imageAlt,
      ),
      ...defaultServicesContent.technology.categories.map((category) =>
        ensureMediaFromPublicFile(payload, category.imageUrl, category.imageAlt),
      ),
    ])

    const seededTechnologyCategories = defaultServicesContent.technology.categories.map((category, index) => ({
      icon: category.icon,
      title: category.title,
      imageAlt: category.imageAlt,
      ...(categoryImageIds[index] ? { image: categoryImageIds[index] } : {}),
      items: category.items.map((label) => ({ label })),
    }))

    await payload.updateGlobal({
      slug: "services-page",
      data: {
        ...(isNew
          ? {
              heroEyebrow: defaultServicesContent.hero.eyebrow,
              heroTitle: defaultServicesContent.hero.title,
              heroDescription: defaultServicesContent.hero.description,
              offeringsEyebrow: defaultServicesContent.offerings.eyebrow,
              offeringsHeadline: defaultServicesContent.offerings.headline,
              aboutEyebrow: defaultServicesContent.about.eyebrow,
              aboutHeadline: defaultServicesContent.about.headline,
              aboutDescription: defaultServicesContent.about.description,
              aboutCta: defaultServicesContent.about.cta,
              aboutImageAlt: defaultServicesContent.about.imageAlt,
              ...(aboutImageId ? { aboutImage: aboutImageId } : {}),
              ctaHeadline: defaultServicesContent.cta.headline,
              ctaSubheadline: defaultServicesContent.cta.subheadline,
              ctaButton: defaultServicesContent.cta.button,
              technologyEyebrow: defaultServicesContent.technology.eyebrow,
              technologyHeadline: defaultServicesContent.technology.headline,
              technologyDescription: defaultServicesContent.technology.description,
            }
          : {}),
        ...(needsOfferings
          ? {
              offeringsEyebrow: services.offeringsEyebrow ?? defaultServicesContent.offerings.eyebrow,
              offeringsHeadline: services.offeringsHeadline ?? defaultServicesContent.offerings.headline,
              offeringsItems: defaultServicesContent.offerings.items,
            }
          : {}),
        ...(needsTechnology
          ? {
              technologyEyebrow: services.technologyEyebrow ?? defaultServicesContent.technology.eyebrow,
              technologyHeadline: services.technologyHeadline ?? defaultServicesContent.technology.headline,
              technologyDescription:
                services.technologyDescription ?? defaultServicesContent.technology.description,
              technologyCategories: seededTechnologyCategories,
            }
          : {}),
      },
    })
  } catch (error) {
    console.error("[seed] Failed to seed services global:", error)
  }
}

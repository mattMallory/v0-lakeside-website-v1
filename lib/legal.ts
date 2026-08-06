import { defaultLegalContent, type LegalContent, type LegalPageContent } from "@/lib/legal-defaults"

type LegalSectionDoc = {
  title?: string | null
  body?: string | null
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mapSections(
  value: LegalSectionDoc[] | null | undefined,
  fallback: LegalPageContent["sections"],
): LegalPageContent["sections"] {
  if (!value || value.length === 0) return fallback

  const mapped = value
    .map((section, index) => {
      const title = section.title?.trim()
      const body = section.body?.trim()
      if (!title || !body) return null

      return { title, body }
    })
    .filter((section): section is LegalPageContent["sections"][number] => section !== null)

  return mapped.length > 0 ? mapped : fallback
}

function mapLegalPage(
  doc: Record<string, unknown>,
  prefix: "privacy" | "terms",
  fallback: LegalPageContent,
): LegalPageContent {
  const sectionsKey = `${prefix}Sections`

  return {
    eyebrow: withFallback(doc[`${prefix}Eyebrow`] as string, fallback.eyebrow),
    title: withFallback(doc[`${prefix}Title`] as string, fallback.title),
    lastUpdated: withFallback(doc[`${prefix}LastUpdated`] as string, fallback.lastUpdated),
    intro: withFallback(doc[`${prefix}Intro`] as string, fallback.intro),
    sections: mapSections(doc[sectionsKey] as LegalSectionDoc[] | undefined, fallback.sections),
    seoTitle: withFallback(doc[`${prefix}SeoTitle`] as string, fallback.seoTitle),
    seoDescription: withFallback(doc[`${prefix}SeoDescription`] as string, fallback.seoDescription),
  }
}

function mapLegalContent(doc: Record<string, unknown>): LegalContent {
  return {
    privacy: mapLegalPage(doc, "privacy", defaultLegalContent.privacy),
    terms: mapLegalPage(doc, "terms", defaultLegalContent.terms),
  }
}

export async function getLegalContent(): Promise<LegalContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultLegalContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const legal = await payload.findGlobal({
      slug: "legal",
      depth: 0,
    })

    return mapLegalContent(legal as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load legal content:", error)
    return defaultLegalContent
  }
}

export async function getPrivacyPageContent(): Promise<LegalPageContent> {
  const content = await getLegalContent()
  return content.privacy
}

export async function getTermsPageContent(): Promise<LegalPageContent> {
  const content = await getLegalContent()
  return content.terms
}

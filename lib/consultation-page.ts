import {
  defaultConsultationPageContent,
  type ConsultationPageContent,
} from "@/lib/consultation-page-defaults"

function withFallback(value: string | null | undefined, fallback: string): string {
  if (value === null || value === undefined) return fallback
  if (value.trim() === "") return fallback
  return value
}

function mapConsultationPageContent(doc: Record<string, unknown>): ConsultationPageContent {
  return {
    eyebrow: withFallback(doc.eyebrow as string, defaultConsultationPageContent.eyebrow),
    title: withFallback(doc.title as string, defaultConsultationPageContent.title),
    description: withFallback(doc.description as string, defaultConsultationPageContent.description),
    seoTitle: withFallback(doc.seoTitle as string, defaultConsultationPageContent.seoTitle),
    seoDescription: withFallback(
      doc.seoDescription as string,
      defaultConsultationPageContent.seoDescription,
    ),
    smsNonMarketingConsentLabel: withFallback(
      doc.smsNonMarketingConsentLabel as string,
      defaultConsultationPageContent.smsNonMarketingConsentLabel,
    ),
    smsMarketingConsentLabel: withFallback(
      doc.smsMarketingConsentLabel as string,
      defaultConsultationPageContent.smsMarketingConsentLabel,
    ),
    privacyLinkLabel: withFallback(
      doc.privacyLinkLabel as string,
      defaultConsultationPageContent.privacyLinkLabel,
    ),
    termsLinkLabel: withFallback(
      doc.termsLinkLabel as string,
      defaultConsultationPageContent.termsLinkLabel,
    ),
  }
}

export async function getConsultationPageContent(): Promise<ConsultationPageContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultConsultationPageContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const consultation = await payload.findGlobal({
      slug: "consultation",
      depth: 0,
    })

    return mapConsultationPageContent(consultation as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load consultation page content:", error)
    return defaultConsultationPageContent
  }
}

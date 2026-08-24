import type { Payload } from "payload"

import { defaultConsultationPageContent } from "@/lib/consultation-page-defaults"

export async function seedConsultationIfEmpty(payload: Payload) {
  try {
    const consultation = await payload.findGlobal({
      slug: "consultation",
      depth: 0,
    })

    const isNew = !consultation.id
    const hasTitle = typeof consultation.title === "string" && consultation.title.trim().length > 0
    const hasSmsCopy =
      typeof consultation.smsNonMarketingConsentLabel === "string" &&
      consultation.smsNonMarketingConsentLabel.trim().length > 0

    if (!isNew && hasTitle && hasSmsCopy) {
      return
    }

    await payload.updateGlobal({
      slug: "consultation",
      data: {
        eyebrow: (consultation.eyebrow as string) || defaultConsultationPageContent.eyebrow,
        title: (consultation.title as string) || defaultConsultationPageContent.title,
        description:
          (consultation.description as string) || defaultConsultationPageContent.description,
        seoTitle: (consultation.seoTitle as string) || defaultConsultationPageContent.seoTitle,
        seoDescription:
          (consultation.seoDescription as string) || defaultConsultationPageContent.seoDescription,
        smsNonMarketingConsentLabel:
          (consultation.smsNonMarketingConsentLabel as string) ||
          defaultConsultationPageContent.smsNonMarketingConsentLabel,
        smsMarketingConsentLabel:
          (consultation.smsMarketingConsentLabel as string) ||
          defaultConsultationPageContent.smsMarketingConsentLabel,
        privacyLinkLabel:
          (consultation.privacyLinkLabel as string) ||
          defaultConsultationPageContent.privacyLinkLabel,
        termsLinkLabel:
          (consultation.termsLinkLabel as string) || defaultConsultationPageContent.termsLinkLabel,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed consultation global:", error)
  }
}

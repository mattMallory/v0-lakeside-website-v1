import type { Payload } from "payload"

import { defaultLegalContent } from "@/lib/legal-defaults"

export async function seedLegalIfEmpty(payload: Payload) {
  try {
    const legal = await payload.findGlobal({
      slug: "legal",
      depth: 0,
    })

    const hasPrivacySections = Array.isArray(legal.privacySections) && legal.privacySections.length > 0
    const hasTermsSections = Array.isArray(legal.termsSections) && legal.termsSections.length > 0
    const isNew = !legal.id

    if (!isNew && hasPrivacySections && hasTermsSections) {
      return
    }

    await payload.updateGlobal({
      slug: "legal",
      data: {
        privacyEyebrow: defaultLegalContent.privacy.eyebrow,
        privacyTitle: defaultLegalContent.privacy.title,
        privacyLastUpdated: defaultLegalContent.privacy.lastUpdated,
        privacyIntro: defaultLegalContent.privacy.intro,
        privacySections: defaultLegalContent.privacy.sections,
        privacySeoTitle: defaultLegalContent.privacy.seoTitle,
        privacySeoDescription: defaultLegalContent.privacy.seoDescription,
        termsEyebrow: defaultLegalContent.terms.eyebrow,
        termsTitle: defaultLegalContent.terms.title,
        termsLastUpdated: defaultLegalContent.terms.lastUpdated,
        termsIntro: defaultLegalContent.terms.intro,
        termsSections: defaultLegalContent.terms.sections,
        termsSeoTitle: defaultLegalContent.terms.seoTitle,
        termsSeoDescription: defaultLegalContent.terms.seoDescription,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed legal global:", error)
  }
}

import type { Payload } from "payload"

import { defaultLegalContent } from "@/lib/legal-defaults"

function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ""
}

/**
 * Seeds the legal global on first boot, and afterwards only fills scalar fields that carry
 * no value.
 *
 * Emptying the privacy or terms section list is a legitimate editor action. Previously it
 * failed the guard and re-seeded every scalar too, so clearing a section list also reverted
 * the page titles, intros, and SEO text. The section lists themselves are now never
 * re-seeded after first boot: an emptied list already renders the defaults through
 * mapSections in lib/legal.ts, so leaving it alone costs nothing visible, while restoring
 * it would delete the editor's decision on every cold start.
 */
export async function seedLegalIfEmpty(payload: Payload) {
  try {
    const legal = await payload.findGlobal({
      slug: "legal",
      depth: 0,
    })

    const d = defaultLegalContent

    if (!legal.id) {
      await payload.updateGlobal({
        slug: "legal",
        data: {
          privacyEyebrow: d.privacy.eyebrow,
          privacyTitle: d.privacy.title,
          privacyLastUpdated: d.privacy.lastUpdated,
          privacyIntro: d.privacy.intro,
          privacySections: d.privacy.sections,
          privacySeoTitle: d.privacy.seoTitle,
          privacySeoDescription: d.privacy.seoDescription,
          termsEyebrow: d.terms.eyebrow,
          termsTitle: d.terms.title,
          termsLastUpdated: d.terms.lastUpdated,
          termsIntro: d.terms.intro,
          termsSections: d.terms.sections,
          termsSeoTitle: d.terms.seoTitle,
          termsSeoDescription: d.terms.seoDescription,
        },
      })
      return
    }

    const patch = {
      ...(isBlank(legal.privacyEyebrow) && { privacyEyebrow: d.privacy.eyebrow }),
      ...(isBlank(legal.privacyTitle) && { privacyTitle: d.privacy.title }),
      ...(isBlank(legal.privacyLastUpdated) && { privacyLastUpdated: d.privacy.lastUpdated }),
      ...(isBlank(legal.privacyIntro) && { privacyIntro: d.privacy.intro }),
      ...(isBlank(legal.privacySeoTitle) && { privacySeoTitle: d.privacy.seoTitle }),
      ...(isBlank(legal.privacySeoDescription) && {
        privacySeoDescription: d.privacy.seoDescription,
      }),
      ...(isBlank(legal.termsEyebrow) && { termsEyebrow: d.terms.eyebrow }),
      ...(isBlank(legal.termsTitle) && { termsTitle: d.terms.title }),
      ...(isBlank(legal.termsLastUpdated) && { termsLastUpdated: d.terms.lastUpdated }),
      ...(isBlank(legal.termsIntro) && { termsIntro: d.terms.intro }),
      ...(isBlank(legal.termsSeoTitle) && { termsSeoTitle: d.terms.seoTitle }),
      ...(isBlank(legal.termsSeoDescription) && { termsSeoDescription: d.terms.seoDescription }),
    }

    if (Object.keys(patch).length > 0) {
      await payload.updateGlobal({ slug: "legal", data: patch })
    }
  } catch (error) {
    console.error("[payload] Failed to seed legal global:", error)
  }
}

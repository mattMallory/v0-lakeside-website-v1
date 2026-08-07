import type { Payload } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"

function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ""
}

/**
 * Seeds the navigation global on first boot, and afterwards only fills scalar fields that
 * carry no value.
 *
 * Emptying the header or footer nav list is a legitimate editor action — a site may
 * genuinely want no footer links. Previously that failed the guard and re-seeded the CTA
 * label and href as well, and restored the deleted links on the next cold start. The nav
 * lists are now never re-seeded after first boot: an emptied list already renders the
 * defaults through mapNavItems in lib/navigation.ts.
 */
export async function seedNavigationIfEmpty(payload: Payload) {
  try {
    const navigation = await payload.findGlobal({
      slug: "navigation",
      depth: 0,
    })

    const d = defaultNavigationContent

    if (!navigation.id) {
      await payload.updateGlobal({
        slug: "navigation",
        data: {
          headerNavItems: d.headerNavItems,
          headerCtaLabel: d.headerCtaLabel,
          headerCtaHref: d.headerCtaHref,
          footerNavItems: d.footerNavItems,
        },
      })
      return
    }

    const patch = {
      ...(isBlank(navigation.headerCtaLabel) && { headerCtaLabel: d.headerCtaLabel }),
      ...(isBlank(navigation.headerCtaHref) && { headerCtaHref: d.headerCtaHref }),
    }

    if (Object.keys(patch).length > 0) {
      await payload.updateGlobal({ slug: "navigation", data: patch })
    }
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

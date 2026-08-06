import type { Payload } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"

export async function seedNavigationIfEmpty(payload: Payload) {
  try {
    const navigation = await payload.findGlobal({
      slug: "navigation",
      depth: 0,
    })

    const hasHeaderNavItems =
      Array.isArray(navigation.headerNavItems) && navigation.headerNavItems.length > 0
    const hasFooterNavItems =
      Array.isArray(navigation.footerNavItems) && navigation.footerNavItems.length > 0
    const isNew = !navigation.id

    if (!isNew && hasHeaderNavItems && hasFooterNavItems) {
      return
    }

    await payload.updateGlobal({
      slug: "navigation",
      data: {
        headerNavItems: defaultNavigationContent.headerNavItems,
        headerCtaLabel: defaultNavigationContent.headerCtaLabel,
        headerCtaHref: defaultNavigationContent.headerCtaHref,
        footerNavItems: defaultNavigationContent.footerNavItems,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

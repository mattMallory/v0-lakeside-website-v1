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
    const hasFooterDescription =
      typeof navigation.footerDescription === "string" &&
      navigation.footerDescription.trim().length > 0
    const isNew = !navigation.id

    if (!isNew && hasHeaderNavItems && hasFooterNavItems && hasFooterDescription) {
      return
    }

    await payload.updateGlobal({
      slug: "navigation",
      data: {
        headerNavItems: hasHeaderNavItems
          ? navigation.headerNavItems
          : defaultNavigationContent.headerNavItems,
        headerCtaLabel:
          (navigation.headerCtaLabel as string) || defaultNavigationContent.headerCtaLabel,
        headerCtaHref:
          (navigation.headerCtaHref as string) || defaultNavigationContent.headerCtaHref,
        footerDescription:
          (navigation.footerDescription as string) || defaultNavigationContent.footerDescription,
        footerNavItems: hasFooterNavItems
          ? navigation.footerNavItems
          : defaultNavigationContent.footerNavItems,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

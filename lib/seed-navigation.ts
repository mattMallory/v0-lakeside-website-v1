import type { Payload } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0
}

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
    const hasFooterDescription = !isBlank(navigation.footerDescription)
    const hasFooterContact =
      !isBlank(navigation.footerAddressLine1) ||
      !isBlank(navigation.footerAddressLine2) ||
      !isBlank(navigation.footerPhone) ||
      !isBlank(navigation.footerEmail)
    const isNew = !navigation.id

    if (!isNew && hasHeaderNavItems && hasFooterNavItems && hasFooterDescription && hasFooterContact) {
      return
    }

    const currentDescription =
      typeof navigation.footerDescription === "string" ? navigation.footerDescription.trim() : ""
    const descriptionLooksCombined =
      /phone\s*:/i.test(currentDescription) ||
      /email\s*:/i.test(currentDescription) ||
      /hiawatha/i.test(currentDescription) ||
      /@/.test(currentDescription)

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
          !hasFooterDescription || descriptionLooksCombined
            ? defaultNavigationContent.footerDescription
            : currentDescription,
        footerAddressLine1: !isBlank(navigation.footerAddressLine1)
          ? (navigation.footerAddressLine1 as string)
          : defaultNavigationContent.footerAddressLine1,
        footerAddressLine2: !isBlank(navigation.footerAddressLine2)
          ? (navigation.footerAddressLine2 as string)
          : defaultNavigationContent.footerAddressLine2,
        footerPhone: !isBlank(navigation.footerPhone)
          ? (navigation.footerPhone as string)
          : defaultNavigationContent.footerPhone,
        footerEmail: !isBlank(navigation.footerEmail)
          ? (navigation.footerEmail as string)
          : defaultNavigationContent.footerEmail,
        footerNavItems: hasFooterNavItems
          ? navigation.footerNavItems
          : defaultNavigationContent.footerNavItems,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

import type { Payload } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0
}

function withDemoSystemNavItem(
  items: Array<{ label?: string | null; href?: string | null }> | null | undefined,
) {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    const label = typeof item.label === "string" ? item.label.trim().toLowerCase() : ""
    if (label === "contact" || label === "demo" || label === "demo the system" || item.href === "/demo") {
      return { ...item, label: "Demo The System", href: "/demo" }
    }
    return item
  })
}

function needsDemoSystemNavUpdate(
  items: Array<{ label?: string | null; href?: string | null }> | null | undefined,
): boolean {
  if (!Array.isArray(items)) return false
  return items.some((item) => {
    const label = typeof item.label === "string" ? item.label.trim().toLowerCase() : ""
    return (
      label === "contact" ||
      label === "demo" ||
      (label === "demo the system" && item.href !== "/demo") ||
      item.href === "/consultation" && (label === "demo" || label === "contact")
    )
  })
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

    const headerNavItems = hasHeaderNavItems
      ? withDemoSystemNavItem(navigation.headerNavItems)
      : defaultNavigationContent.headerNavItems
    const footerNavItems = hasFooterNavItems
      ? withDemoSystemNavItem(navigation.footerNavItems)
      : defaultNavigationContent.footerNavItems

    const needsNavRename =
      needsDemoSystemNavUpdate(navigation.headerNavItems) ||
      needsDemoSystemNavUpdate(navigation.footerNavItems)

    if (
      !isNew &&
      hasHeaderNavItems &&
      hasFooterNavItems &&
      hasFooterDescription &&
      hasFooterContact &&
      !needsNavRename
    ) {
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
        headerNavItems,
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
        footerNavItems,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

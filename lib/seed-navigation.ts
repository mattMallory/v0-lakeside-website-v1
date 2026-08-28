import type { Payload } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"

type NavItemLike = {
  id?: string | null
  label?: string | null
  href?: string | null
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0
}

function repairNavItem(item: NavItemLike): { item: NavItemLike; changed: boolean } {
  const label = typeof item.label === "string" ? item.label.trim() : ""
  const href = typeof item.href === "string" ? item.href.trim() : ""
  const lower = label.toLowerCase()

  // Legacy Contact / DEMO / Demo The System → Get Your Growth Plan
  if (
    lower === "contact" ||
    lower === "demo" ||
    lower === "demo the system" ||
    (lower === "get your growth plan" && href !== "/growth-plan") ||
    (href === "/demo" || href === "/growth-plan") ||
    (href === "/consultation" && (lower === "demo" || lower === "contact"))
  ) {
    return {
      item: { ...item, label: "Get Your Growth Plan", href: "/growth-plan" },
      changed: true,
    }
  }

  // Repair truncated "Articles" label that got saved as "Art"
  if (href === "/blog" && (lower === "art" || lower === "artic")) {
    return {
      item: { ...item, label: "Articles", href: "/blog" },
      changed: true,
    }
  }

  return { item, changed: false }
}

function repairNavItems(items: NavItemLike[] | null | undefined): {
  items: NavItemLike[] | null | undefined
  changed: boolean
} {
  if (!Array.isArray(items)) return { items, changed: false }

  let changed = false
  const next = items.map((item) => {
    const repaired = repairNavItem(item)
    if (repaired.changed) changed = true
    return repaired.item
  })

  return { items: next, changed }
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

    const headerRepair = repairNavItems(navigation.headerNavItems as NavItemLike[] | undefined)
    const footerRepair = repairNavItems(navigation.footerNavItems as NavItemLike[] | undefined)

    // Existing nav: only patch known bad/legacy labels. Never rewrite CMS edits.
    if (!isNew && hasHeaderNavItems && hasFooterNavItems) {
      if (!headerRepair.changed && !footerRepair.changed) {
        return
      }

      await payload.updateGlobal({
        slug: "navigation",
        data: {
          ...(headerRepair.changed ? { headerNavItems: headerRepair.items } : {}),
          ...(footerRepair.changed ? { footerNavItems: footerRepair.items } : {}),
        },
      })
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
          ? headerRepair.items
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
          ? footerRepair.items
          : defaultNavigationContent.footerNavItems,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed navigation global:", error)
  }
}

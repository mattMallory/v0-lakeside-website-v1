export type NavItem = {
  label: string
  href: string
}

export type NavigationContent = {
  headerNavItems: NavItem[]
  headerCtaLabel: string
  headerCtaHref: string
  footerDescription: string
  footerAddressLine1: string
  footerAddressLine2: string
  footerPhone: string
  footerEmail: string
  footerNavItems: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Articles", href: "/blog" },
  { label: "Get Your Growth Plan", href: "/growth-plan" },
]

export const defaultNavigationContent: NavigationContent = {
  headerNavItems: defaultNavItems,
  headerCtaLabel: "Schedule a Consultation",
  headerCtaHref: "/consultation",
  footerDescription:
    "Patient acquisition systems for natural wellness clinics. More appointments, less marketing guesswork.",
  footerAddressLine1: "332 HIAWATHA DR",
  footerAddressLine2: "LAKE IN THE HILLS, 60156",
  footerPhone: "815-893-2976",
  footerEmail: "sales@madebylakeside.com",
  footerNavItems: defaultNavItems,
}

function isLegacyGrowthPlanNavLabel(label: string): boolean {
  const lower = label.toLowerCase()
  return (
    lower === "contact" ||
    lower === "demo" ||
    lower === "demo the system" ||
    lower === "get your growth plan" ||
    lower === "get your growth pla"
  )
}

/** Client-safe helper — keep out of modules that import Payload. */
export function isGrowthPlanNavItem(item: Pick<NavItem, "label" | "href">): boolean {
  return isLegacyGrowthPlanNavLabel(item.label) || item.href === "/demo" || item.href === "/growth-plan"
}

/** @deprecated Use isGrowthPlanNavItem */
export const isDemoSystemNavItem = isGrowthPlanNavItem

export function normalizeGrowthPlanNavItem(label: string, href: string): NavItem {
  if (isLegacyGrowthPlanNavLabel(label) || href === "/demo" || href === "/growth-plan") {
    return { label: "Get Your Growth Plan", href: "/growth-plan" }
  }

  // Repair truncated Articles label from CMS
  if (href === "/blog" && (label.toLowerCase() === "art" || label.toLowerCase() === "artic")) {
    return { label: "Articles", href: "/blog" }
  }

  return { label, href }
}

/** @deprecated Use normalizeGrowthPlanNavItem */
export const normalizeDemoSystemNavItem = normalizeGrowthPlanNavItem

import { cache } from "react"

import {
  defaultNavigationContent,
  type NavItem,
  type NavigationContent,
} from "@/lib/navigation-defaults"

type NavItemDoc = {
  label?: string | null
  href?: string | null
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

/** Empty string hides the line; null/undefined uses the default. */
function withOptionalText(value: string | null | undefined, fallback: string): string {
  if (value === null || value === undefined) return fallback
  return value.trim()
}

function isLegacyDemoNavLabel(label: string): boolean {
  const lower = label.toLowerCase()
  return lower === "contact" || lower === "demo" || lower === "demo the system"
}

function normalizeNavItem(label: string, href: string): NavItem {
  if (isLegacyDemoNavLabel(label) || href === "/demo") {
    return { label: "Demo The System", href: "/demo" }
  }

  return { label, href }
}

function mapNavItems(
  value: NavItemDoc[] | null | undefined,
  fallback: NavItem[],
): NavItem[] {
  if (!value || value.length === 0) return fallback

  const mapped = value
    .map((item) => {
      const rawLabel = item.label?.trim()
      const href = item.href?.trim()
      if (!rawLabel || !href) return null

      return normalizeNavItem(rawLabel, href)
    })
    .filter((item): item is NavItem => Boolean(item))

  return mapped.length > 0 ? mapped : fallback
}

function mapNavigationContent(doc: Record<string, unknown>): NavigationContent {
  return {
    headerNavItems: mapNavItems(
      doc.headerNavItems as NavItemDoc[] | undefined,
      defaultNavigationContent.headerNavItems,
    ),
    headerCtaLabel: withFallback(
      doc.headerCtaLabel as string,
      defaultNavigationContent.headerCtaLabel,
    ),
    headerCtaHref: withFallback(
      doc.headerCtaHref as string,
      defaultNavigationContent.headerCtaHref,
    ),
    footerDescription: withOptionalText(
      doc.footerDescription as string,
      defaultNavigationContent.footerDescription,
    ),
    footerAddressLine1: withOptionalText(
      doc.footerAddressLine1 as string,
      defaultNavigationContent.footerAddressLine1,
    ),
    footerAddressLine2: withOptionalText(
      doc.footerAddressLine2 as string,
      defaultNavigationContent.footerAddressLine2,
    ),
    footerPhone: withOptionalText(
      doc.footerPhone as string,
      defaultNavigationContent.footerPhone,
    ),
    footerEmail: withOptionalText(
      doc.footerEmail as string,
      defaultNavigationContent.footerEmail,
    ),
    footerNavItems: mapNavItems(
      doc.footerNavItems as NavItemDoc[] | undefined,
      defaultNavigationContent.footerNavItems,
    ),
  }
}

async function fetchNavigationContent(): Promise<NavigationContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultNavigationContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const navigation = await payload.findGlobal({
      slug: "navigation",
      depth: 0,
    })

    return mapNavigationContent(navigation as unknown as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load navigation content:", error)
    return defaultNavigationContent
  }
}

export function isDemoSystemNavItem(item: Pick<NavItem, "label" | "href">): boolean {
  return isLegacyDemoNavLabel(item.label) || item.href === "/demo"
}

export const getNavigationContent = cache(fetchNavigationContent)

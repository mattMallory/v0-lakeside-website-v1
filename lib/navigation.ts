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

function mapNavItems(
  value: NavItemDoc[] | null | undefined,
  fallback: NavItem[],
): NavItem[] {
  if (!value || value.length === 0) return fallback

  const mapped = value
    .map((item) => {
      const label = item.label?.trim()
      const href = item.href?.trim()
      if (!label || !href) return null

      return { label, href }
    })
    .filter((item): item is NavItem => item !== null)

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
    footerDescription: withFallback(
      doc.footerDescription as string,
      defaultNavigationContent.footerDescription,
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

export const getNavigationContent = cache(fetchNavigationContent)

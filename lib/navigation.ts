import { cache } from "react"

import { withFallback } from "@/lib/cms-mappers"
import type { Navigation } from "@/payload-types"
import {
  defaultNavigationContent,
  type NavItem,
  type NavigationContent,
} from "@/lib/navigation-defaults"

type NavItemDoc = {
  label?: string | null
  href?: string | null
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

function mapNavigationContent(doc: Navigation): NavigationContent {
  return {
    headerNavItems: mapNavItems(doc.headerNavItems, defaultNavigationContent.headerNavItems),
    headerCtaLabel: withFallback(doc.headerCtaLabel, defaultNavigationContent.headerCtaLabel),
    headerCtaHref: withFallback(doc.headerCtaHref, defaultNavigationContent.headerCtaHref),
    footerNavItems: mapNavItems(doc.footerNavItems, defaultNavigationContent.footerNavItems),
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

    return mapNavigationContent(navigation)
  } catch (error) {
    console.error("[payload] Failed to load navigation content:", error)
    return defaultNavigationContent
  }
}

export const getNavigationContent = cache(fetchNavigationContent)

import { unstable_noStore as noStore } from "next/cache"

import { resolveMediaUrl, withFallback, type MediaLike } from "@/lib/cms-mappers"
import { defaultBrandingContent, type BrandingContent } from "@/lib/branding-defaults"
import {
  bodyFontFamily,
  headingFontFamily,
  logoFontFamily,
} from "@/lib/fonts"
import type { Branding } from "@/payload-types"

const colorKeys = [
  "primaryColor",
  "iconColor",
  "buttonColor",
  "buttonTextColor",
  "secondaryButtonColor",
  "secondaryButtonTextColor",
  "secondaryColor",
  "accentColor",
  "backgroundColor",
  "headingColor",
  "textColor",
  "mutedTextColor",
  "borderColor",
  "focusRingColor",
  "surfaceColor",
  "mutedSurfaceColor",
  "buttonHoverColor",
  "buttonActiveColor",
  "inkColor",
] as const satisfies ReadonlyArray<keyof BrandingContent & keyof Branding>

function isHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
}

function resolveHex(
  value: string | null | undefined,
  fallback: string,
): string {
  const resolved = withFallback(value, fallback)
  return isHexColor(resolved) ? resolved : fallback
}

function resolveLogoHeight(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
  if (!Number.isFinite(n)) return fallback
  return Math.min(96, Math.max(16, Math.round(n)))
}

function withCacheBust(url: string, updatedAt?: string | null): string {
  if (!updatedAt) return url
  const stamp = Date.parse(updatedAt)
  if (Number.isNaN(stamp)) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${stamp}`
}

// Branding is the one place a media URL is cache-busted: the logo must change in the
// browser the moment it is replaced in the admin panel. The shared resolver supplies the
// URL and the cache-busting stamp is composed on top of it here.
function resolveLogoUrl(logo: number | MediaLike | null | undefined): string | undefined {
  const rawUrl = resolveMediaUrl(logo)?.trim()
  if (!rawUrl) return undefined

  const updatedAt = typeof logo === "object" && logo ? logo.updatedAt : undefined
  return withCacheBust(rawUrl, updatedAt)
}

export async function getBrandingContent(): Promise<BrandingContent> {
  noStore()

  if (!process.env.PAYLOAD_SECRET) {
    return defaultBrandingContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const branding = await payload.findGlobal({
      slug: "branding",
      depth: 1,
      overrideAccess: true,
    })

    let logo: number | MediaLike | null | undefined = branding.logo

    // If the relation id exists but depth did not populate, fetch media directly.
    if (typeof logo === "number") {
      try {
        logo = (await payload.findByID({
          collection: "media",
          id: logo,
          depth: 0,
          overrideAccess: true,
        })) as MediaLike
      } catch {
        logo = null
      }
    }

    const logoUrl = resolveLogoUrl(logo)
    const colors = Object.fromEntries(
      colorKeys.map((key) => [key, resolveHex(branding[key], defaultBrandingContent[key])]),
    ) as Pick<BrandingContent, (typeof colorKeys)[number]>

    return {
      logoUrl: logoUrl ?? defaultBrandingContent.logoUrl,
      logoAlt: withFallback(
        branding.logoAlt || (typeof logo === "object" && logo?.alt) || null,
        defaultBrandingContent.logoAlt,
      ),
      logoHeight: resolveLogoHeight(branding.logoHeight, defaultBrandingContent.logoHeight),
      ...colors,
    }
  } catch (error) {
    console.error("[payload] Failed to load branding content:", error)
    return defaultBrandingContent
  }
}

export function buildBrandingCssVariables(branding: BrandingContent): string {
  // Brand Guide v20 type roles — always the brand faces, never a CMS choice.
  // All three are self-hosted now, so none of them is fetched at build time.
  // Color tokens still come from the Branding CMS.
  return `:root {
  --background: ${branding.backgroundColor};
  --foreground: ${branding.textColor};
  --heading: ${branding.headingColor};
  --card: ${branding.surfaceColor};
  --card-foreground: ${branding.headingColor};
  --popover: ${branding.surfaceColor};
  --popover-foreground: ${branding.textColor};
  --primary: ${branding.primaryColor};
  --primary-foreground: ${branding.buttonTextColor};
  --icon: ${branding.iconColor};
  --button: ${branding.buttonColor};
  --button-foreground: ${branding.buttonTextColor};
  --button-hover: ${branding.buttonHoverColor};
  --button-active: ${branding.buttonActiveColor};
  --secondary-button: ${branding.secondaryButtonColor};
  --secondary-button-foreground: ${branding.secondaryButtonTextColor};
  --secondary: ${branding.secondaryColor};
  --secondary-foreground: ${branding.textColor};
  --muted: ${branding.mutedSurfaceColor};
  --muted-foreground: ${branding.mutedTextColor};
  --accent: ${branding.accentColor};
  --accent-foreground: ${branding.primaryColor};
  --border: ${branding.borderColor};
  --input: ${branding.borderColor};
  --ring: ${branding.focusRingColor};
  --ink: ${branding.inkColor};
  --lake-pale: ${branding.secondaryColor};
  --lake-light: ${branding.accentColor};
  --chart-1: ${branding.primaryColor};
  --chart-2: ${branding.buttonHoverColor};
  --chart-3: ${branding.accentColor};
  --chart-4: ${branding.buttonActiveColor};
  --chart-5: ${branding.inkColor};
  --sidebar: ${branding.surfaceColor};
  --sidebar-foreground: ${branding.headingColor};
  --sidebar-primary: ${branding.primaryColor};
  --sidebar-primary-foreground: ${branding.buttonTextColor};
  --sidebar-accent: ${branding.secondaryColor};
  --sidebar-accent-foreground: ${branding.headingColor};
  --sidebar-border: ${branding.borderColor};
  --sidebar-ring: ${branding.focusRingColor};
  --font-heading: ${headingFontFamily};
  --font-sans: ${bodyFontFamily};
  --font-logo: ${logoFontFamily};
}`
}

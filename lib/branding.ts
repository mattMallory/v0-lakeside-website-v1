import { unstable_noStore as noStore } from "next/cache"

import { defaultBrandingContent, type BrandingContent } from "@/lib/branding-defaults"
import type { GoogleFontName } from "@/lib/google-fonts"
import { googleFontOptions } from "@/lib/google-fonts"

type MediaLike = {
  url?: string | null
  filename?: string | null
  alt?: string | null
  updatedAt?: string | null
}

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
] as const satisfies ReadonlyArray<keyof BrandingContent>

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

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

function resolveFont(value: string | null | undefined, fallback: GoogleFontName): GoogleFontName {
  if (!value) return fallback
  const match = googleFontOptions.find((option) => option.value === value)
  return match?.value ?? fallback
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

function resolveMediaUrl(logo: number | MediaLike | null | undefined): string | null {
  if (!logo || typeof logo === "number") return null

  const rawUrl = typeof logo.url === "string" ? logo.url.trim() : ""
  if (!rawUrl) return null

  return withCacheBust(rawUrl, logo.updatedAt)
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

    let logo = branding.logo as number | MediaLike | null | undefined

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

    const logoUrl = resolveMediaUrl(logo)
    const colors = Object.fromEntries(
      colorKeys.map((key) => [
        key,
        resolveHex(
          (branding as Record<string, string | null | undefined>)[key],
          defaultBrandingContent[key],
        ),
      ]),
    ) as Pick<BrandingContent, (typeof colorKeys)[number]>

    return {
      logoUrl: logoUrl ?? defaultBrandingContent.logoUrl,
      logoAlt: withFallback(
        branding.logoAlt || (typeof logo === "object" && logo?.alt) || null,
        defaultBrandingContent.logoAlt,
      ),
      logoHeight: resolveLogoHeight(
        (branding as { logoHeight?: number | null }).logoHeight,
        defaultBrandingContent.logoHeight,
      ),
      ...colors,
      headingFont: resolveFont(branding.headingFont, defaultBrandingContent.headingFont),
      bodyFont: resolveFont(branding.bodyFont, defaultBrandingContent.bodyFont),
    }
  } catch (error) {
    console.error("[payload] Failed to load branding content:", error)
    return defaultBrandingContent
  }
}

export function buildBrandingCssVariables(branding: BrandingContent): string {
  const heading = `"${branding.headingFont}", var(--font-lexend-deca), sans-serif`
  const body = `"${branding.bodyFont}", var(--font-geist-sans), sans-serif`

  return `:root {
  --background: ${branding.backgroundColor};
  --foreground: ${branding.textColor};
  --heading: ${branding.headingColor};
  --card: ${branding.backgroundColor};
  --card-foreground: ${branding.headingColor};
  --popover: ${branding.backgroundColor};
  --popover-foreground: ${branding.textColor};
  --primary: ${branding.primaryColor};
  --primary-foreground: ${branding.buttonTextColor};
  --icon: ${branding.iconColor};
  --button: ${branding.buttonColor};
  --button-foreground: ${branding.buttonTextColor};
  --secondary-button: ${branding.secondaryButtonColor};
  --secondary-button-foreground: ${branding.secondaryButtonTextColor};
  --secondary: ${branding.secondaryColor};
  --secondary-foreground: ${branding.textColor};
  --muted: ${branding.secondaryColor};
  --muted-foreground: ${branding.mutedTextColor};
  --accent: ${branding.accentColor};
  --accent-foreground: ${branding.primaryColor};
  --border: ${branding.borderColor};
  --input: ${branding.borderColor};
  --ring: ${branding.focusRingColor};
  --chart-1: ${branding.primaryColor};
  --sidebar-primary: ${branding.primaryColor};
  --font-heading: ${heading};
  --font-sans: ${body};
}`
}

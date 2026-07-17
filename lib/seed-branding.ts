import type { Payload } from "payload"

import { defaultBrandingContent } from "@/lib/branding-defaults"
import { linkBrandingLogoIfMissing } from "@/lib/link-branding-logo"

const LEGACY_PRIMARY = "#3B6FD8"

function isLegacyPalette(branding: {
  primaryColor?: string | null
  backgroundColor?: string | null
  headingFont?: string | null
}): boolean {
  const primary = (branding.primaryColor || "").toUpperCase()
  const background = (branding.backgroundColor || "").toUpperCase()
  const headingFont = branding.headingFont || ""

  return (
    primary === LEGACY_PRIMARY ||
    background === "#F7F9FC" ||
    headingFont === "Lexend Deca" ||
    !branding.primaryColor
  )
}

export async function seedBrandingIfEmpty(payload: Payload) {
  try {
    const branding = await payload.findGlobal({
      slug: "branding",
      depth: 0,
    })

    if (isLegacyPalette(branding)) {
      await payload.updateGlobal({
        slug: "branding",
        data: {
          logoAlt: branding.logoAlt || defaultBrandingContent.logoAlt,
          logoHeight: branding.logoHeight || defaultBrandingContent.logoHeight,
          primaryColor: defaultBrandingContent.primaryColor,
          iconColor: defaultBrandingContent.iconColor,
          buttonColor: defaultBrandingContent.buttonColor,
          buttonTextColor: defaultBrandingContent.buttonTextColor,
          secondaryButtonColor: defaultBrandingContent.secondaryButtonColor,
          secondaryButtonTextColor: defaultBrandingContent.secondaryButtonTextColor,
          secondaryColor: defaultBrandingContent.secondaryColor,
          accentColor: defaultBrandingContent.accentColor,
          backgroundColor: defaultBrandingContent.backgroundColor,
          headingColor: defaultBrandingContent.headingColor,
          textColor: defaultBrandingContent.textColor,
          mutedTextColor: defaultBrandingContent.mutedTextColor,
          borderColor: defaultBrandingContent.borderColor,
          focusRingColor: defaultBrandingContent.focusRingColor,
          headingFont: defaultBrandingContent.headingFont,
          bodyFont: defaultBrandingContent.bodyFont,
        },
      })
    }

    // Recover logos uploaded to Media that were never saved onto Branding.
    await linkBrandingLogoIfMissing(payload)
  } catch (error) {
    console.error("[seed] Failed to seed branding global:", error)
  }
}

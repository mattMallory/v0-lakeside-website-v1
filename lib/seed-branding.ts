import type { Payload } from "payload"

import { defaultBrandingContent } from "@/lib/branding-defaults"
import { linkBrandingLogoIfMissing } from "@/lib/link-branding-logo"

export async function seedBrandingIfEmpty(payload: Payload) {
  try {
    const branding = await payload.findGlobal({
      slug: "branding",
      depth: 0,
    })

    const hasCustomLogo = Boolean(branding.logo)
    const hasCustomColors =
      branding.buttonColor ||
      branding.primaryColor ||
      branding.backgroundColor ||
      branding.textColor

    if (!hasCustomLogo && !hasCustomColors) {
      await payload.updateGlobal({
        slug: "branding",
        data: {
          logoAlt: defaultBrandingContent.logoAlt,
          logoHeight: defaultBrandingContent.logoHeight,
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

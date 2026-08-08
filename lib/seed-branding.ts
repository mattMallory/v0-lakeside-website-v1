import type { Payload } from "payload"

import { defaultBrandingContent } from "@/lib/branding-defaults"
import { linkBrandingLogoIfMissing } from "@/lib/link-branding-logo"

function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ""
}

/**
 * Fills branding fields that carry no value. Nothing already set is touched.
 *
 * This previously overwrote the entire palette whenever any one of three specific values
 * was present — treating them as a legacy palette to migrate away from. That made those
 * three values unselectable: an editor who deliberately chose one had their whole palette
 * reset on the next cold start. The migration has run on every boot since it shipped, so
 * any site it applied to moved long ago and the check now only enforces.
 *
 * An empty field cannot be distinguished from one an editor deliberately cleared. Filling
 * it is the choice that loses less work: a cleared colour already renders as the default
 * (see resolveHex in lib/branding.ts), so writing that same default changes nothing an
 * editor would see, whereas overwriting a set value destroys a real decision.
 */
export async function seedBrandingIfEmpty(payload: Payload) {
  try {
    const branding = await payload.findGlobal({
      slug: "branding",
      depth: 0,
    })

    const d = defaultBrandingContent
    const patch = {
      ...(isBlank(branding.primaryColor) && { primaryColor: d.primaryColor }),
      ...(isBlank(branding.iconColor) && { iconColor: d.iconColor }),
      ...(isBlank(branding.buttonColor) && { buttonColor: d.buttonColor }),
      ...(isBlank(branding.buttonTextColor) && { buttonTextColor: d.buttonTextColor }),
      ...(isBlank(branding.secondaryButtonColor) && {
        secondaryButtonColor: d.secondaryButtonColor,
      }),
      ...(isBlank(branding.secondaryButtonTextColor) && {
        secondaryButtonTextColor: d.secondaryButtonTextColor,
      }),
      ...(isBlank(branding.secondaryColor) && { secondaryColor: d.secondaryColor }),
      ...(isBlank(branding.accentColor) && { accentColor: d.accentColor }),
      ...(isBlank(branding.backgroundColor) && { backgroundColor: d.backgroundColor }),
      ...(isBlank(branding.headingColor) && { headingColor: d.headingColor }),
      ...(isBlank(branding.textColor) && { textColor: d.textColor }),
      ...(isBlank(branding.mutedTextColor) && { mutedTextColor: d.mutedTextColor }),
      ...(isBlank(branding.borderColor) && { borderColor: d.borderColor }),
      ...(isBlank(branding.focusRingColor) && { focusRingColor: d.focusRingColor }),
      ...(isBlank(branding.surfaceColor) && { surfaceColor: d.surfaceColor }),
      ...(isBlank(branding.mutedSurfaceColor) && { mutedSurfaceColor: d.mutedSurfaceColor }),
      ...(isBlank(branding.buttonHoverColor) && { buttonHoverColor: d.buttonHoverColor }),
      ...(isBlank(branding.buttonActiveColor) && { buttonActiveColor: d.buttonActiveColor }),
      ...(isBlank(branding.inkColor) && { inkColor: d.inkColor }),
      ...(isBlank(branding.logoAlt) && { logoAlt: d.logoAlt }),
      ...(branding.logoHeight === null || branding.logoHeight === undefined
        ? { logoHeight: d.logoHeight }
        : {}),
    }

    // Only write when something is genuinely missing — an unconditional write would
    // trigger revalidation on every cold start.
    if (Object.keys(patch).length > 0) {
      await payload.updateGlobal({
        slug: "branding",
        data: patch,
      })
    }

    // Recover logos uploaded to Media that were never saved onto Branding.
    await linkBrandingLogoIfMissing(payload)
  } catch (error) {
    console.error("[seed] Failed to seed branding global:", error)
  }
}

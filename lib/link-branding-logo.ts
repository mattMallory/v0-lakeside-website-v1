import type { Payload } from "payload"

/** When Branding has no logo, attach the newest media file that looks like a logo. */
export async function linkBrandingLogoIfMissing(
  payload: Payload,
  preferredMediaId?: number | string | null,
) {
  try {
    const branding = await payload.findGlobal({
      slug: "branding",
      depth: 0,
    })

    if (branding.logo) return

    let logoId = preferredMediaId ?? null

    if (!logoId) {
      const media = await payload.find({
        collection: "media",
        where: {
          or: [
            { filename: { contains: "logo" } },
            { alt: { contains: "logo" } },
          ],
        },
        sort: "-updatedAt",
        limit: 1,
        depth: 0,
      })

      logoId = media.docs[0]?.id ?? null
    }

    if (!logoId) return

    await payload.updateGlobal({
      slug: "branding",
      data: {
        logo: logoId,
      },
      depth: 0,
    })
  } catch (error) {
    console.error("[branding] Failed to link logo media:", error)
  }
}

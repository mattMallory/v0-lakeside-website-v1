import type { CollectionConfig } from "payload"

import { linkBrandingLogoIfMissing } from "@/lib/link-branding-logo"
import { revalidateSite } from "@/lib/revalidate-site"

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const filename = typeof doc.filename === "string" ? doc.filename : ""
        const alt = typeof doc.alt === "string" ? doc.alt : ""
        const looksLikeLogo = `${filename} ${alt}`.toLowerCase().includes("logo")

        if (looksLikeLogo) {
          await linkBrandingLogoIfMissing(req.payload, doc.id)
        }

        await revalidateSite()
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
}

import type { Payload } from "payload"

import { defaultHomepageContent } from "@/lib/homepage-defaults"

export async function seedHomepageIfEmpty(payload: Payload) {
  try {
    const homepage = await payload.findGlobal({
      slug: "homepage",
      depth: 0,
    })

    if (homepage.problemItems && homepage.problemItems.length > 0) {
      return
    }

    await payload.updateGlobal({
      slug: "homepage",
      data: defaultHomepageContent,
    })
  } catch (error) {
    console.error("[seed] Failed to seed homepage global:", error)
  }
}

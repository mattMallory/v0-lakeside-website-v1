import type { Payload } from "payload"

import { growthSystemToPayloadData } from "@/lib/homepage-growth-system-payload"
import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"

export async function seedHomepageIfEmpty(payload: Payload) {
  try {
    const homepage = await payload.findGlobal({
      slug: "homepage",
      depth: 0,
    })

    if (homepage.gsHeroHeadline) {
      return
    }

    await payload.updateGlobal({
      slug: "homepage",
      data: growthSystemToPayloadData(defaultGrowthSystemContent),
    })
  } catch (error) {
    console.error("[seed] Failed to seed homepage global:", error)
  }
}

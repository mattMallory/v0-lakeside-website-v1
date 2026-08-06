import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"
import { mapGrowthSystemContent } from "@/lib/homepage-growth-system"
import type { GrowthSystemContent } from "@/lib/homepage-template"

export type HomepageContent = GrowthSystemContent

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultGrowthSystemContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const homepage = await payload.findGlobal({
      slug: "homepage",
      depth: 2,
    })

    return mapGrowthSystemContent(homepage as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load homepage content:", error)
    return defaultGrowthSystemContent
  }
}

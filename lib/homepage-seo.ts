import { resolveMediaAlt, resolveMediaUrl } from "@/lib/cms-mappers"
import { defaultHomepageSeo } from "@/lib/homepage-seo-defaults"

export type HomepageSeo = {
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
}

export async function getHomepageSeo(): Promise<HomepageSeo> {
  if (!process.env.PAYLOAD_SECRET) {
    return { ...defaultHomepageSeo }
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const homepage = await payload.findGlobal({
      slug: "homepage",
      depth: 1,
    })

    const meta = homepage.meta
    const title =
      typeof meta?.title === "string" && meta.title.trim()
        ? meta.title.trim()
        : defaultHomepageSeo.title
    const description =
      typeof meta?.description === "string" && meta.description.trim()
        ? meta.description.trim()
        : defaultHomepageSeo.description

    return {
      title,
      description,
      imageUrl: resolveMediaUrl(meta?.image),
      imageAlt: resolveMediaAlt(meta?.image),
    }
  } catch (error) {
    console.error("[payload] Failed to load homepage SEO:", error)
    return { ...defaultHomepageSeo }
  }
}

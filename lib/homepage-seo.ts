import { defaultHomepageSeo } from "@/lib/homepage-seo-defaults"

export type HomepageSeo = {
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
}

type MediaLike = {
  url?: string | null
  alt?: string | null
}

function mediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  if (typeof media.url === "string" && media.url.trim()) return media.url
  return undefined
}

function mediaAlt(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  if (typeof media.alt === "string" && media.alt.trim()) return media.alt
  return undefined
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
      imageUrl: mediaUrl(meta?.image),
      imageAlt: mediaAlt(meta?.image),
    }
  } catch (error) {
    console.error("[payload] Failed to load homepage SEO:", error)
    return { ...defaultHomepageSeo }
  }
}

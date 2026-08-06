import { defaultAboutSeo } from "@/lib/about-seo-defaults"

export type AboutSeo = {
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

export async function getAboutSeo(): Promise<AboutSeo> {
  if (!process.env.PAYLOAD_SECRET) {
    return { ...defaultAboutSeo }
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const about = await payload.findGlobal({
      slug: "about",
      depth: 1,
    })

    const meta = about.meta
    const title =
      typeof meta?.title === "string" && meta.title.trim() ? meta.title.trim() : defaultAboutSeo.title
    const description =
      typeof meta?.description === "string" && meta.description.trim()
        ? meta.description.trim()
        : defaultAboutSeo.description

    return {
      title,
      description,
      imageUrl: mediaUrl(meta?.image),
      imageAlt: mediaAlt(meta?.image),
    }
  } catch (error) {
    console.error("[payload] Failed to load about SEO:", error)
    return { ...defaultAboutSeo }
  }
}

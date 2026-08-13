import { resolveMediaAlt, resolveMediaUrl } from "@/lib/cms-mappers"
import { defaultAboutSeo } from "@/lib/about-seo-defaults"

export type AboutSeo = {
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
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
      imageUrl: resolveMediaUrl(meta?.image),
      imageAlt: resolveMediaAlt(meta?.image),
    }
  } catch (error) {
    console.error("[payload] Failed to load about SEO:", error)
    return { ...defaultAboutSeo }
  }
}

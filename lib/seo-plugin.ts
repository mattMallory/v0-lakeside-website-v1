import { seoPlugin } from "@payloadcms/plugin-seo"
import type { Plugin } from "payload"

import { defaultAboutSeo } from "@/lib/about-seo-defaults"
import { defaultHomepageSeo } from "@/lib/homepage-seo-defaults"
import { getSiteUrl } from "@/lib/site-url"

export function getSeoPlugin(): Plugin {
  return seoPlugin({
    collections: ["posts"],
    globals: ["homepage", "about"],
    uploadsCollection: "media",
    tabbedUI: true,
    generateTitle: ({ doc, collectionConfig, globalConfig }) => {
      if (collectionConfig?.slug === "posts" && typeof doc?.title === "string" && doc.title.trim()) {
        return `${doc.title.trim()} | Lakeside Blog`
      }

      if (globalConfig?.slug === "about" && typeof doc?.heroTitle === "string" && doc.heroTitle.trim()) {
        return `${doc.heroTitle.trim()} | Lakeside`
      }

      const headline =
        typeof doc?.heroHeadline === "string" && doc.heroHeadline.trim()
          ? doc.heroHeadline.trim()
          : "More Patient Appointments For Your Clinic"
      return `Lakeside | ${headline}`
    },
    generateDescription: ({ doc, collectionConfig, globalConfig }) => {
      if (collectionConfig?.slug === "posts" && typeof doc?.excerpt === "string" && doc.excerpt.trim()) {
        return doc.excerpt.trim()
      }

      if (globalConfig?.slug === "about" && typeof doc?.heroDescription === "string" && doc.heroDescription.trim()) {
        return doc.heroDescription.trim()
      }

      if (typeof doc?.heroSubheadline === "string" && doc.heroSubheadline.trim()) {
        return doc.heroSubheadline.trim()
      }
      return globalConfig?.slug === "about" ? defaultAboutSeo.description : defaultHomepageSeo.description
    },
    generateURL: ({ doc, collectionConfig, globalConfig }) => {
      if (collectionConfig?.slug === "posts" && typeof doc?.slug === "string" && doc.slug.trim()) {
        return `${getSiteUrl()}/blog/${doc.slug.trim()}`
      }

      if (globalConfig?.slug === "about") {
        return `${getSiteUrl()}/about`
      }

      return getSiteUrl()
    },
  })
}

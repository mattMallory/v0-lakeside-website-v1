import { seoPlugin } from "@payloadcms/plugin-seo"
import type { Plugin } from "payload"

import { defaultAboutSeo } from "@/lib/about-seo-defaults"
import { defaultHomepageSeo } from "@/lib/homepage-seo-defaults"

function getSiteURL(): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "")
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}

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
        return `${getSiteURL()}/blog/${doc.slug.trim()}`
      }

      if (globalConfig?.slug === "about") {
        return `${getSiteURL()}/about`
      }

      return getSiteURL()
    },
  })
}

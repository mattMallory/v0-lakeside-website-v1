import { seoPlugin } from "@payloadcms/plugin-seo"
import type { Plugin } from "payload"

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
    globals: ["homepage"],
    uploadsCollection: "media",
    tabbedUI: true,
    generateTitle: ({ doc }) => {
      const headline =
        typeof doc?.heroHeadline === "string" && doc.heroHeadline.trim()
          ? doc.heroHeadline.trim()
          : "More Patient Appointments For Your Clinic"
      return `Lakeside | ${headline}`
    },
    generateDescription: ({ doc }) => {
      if (typeof doc?.heroSubheadline === "string" && doc.heroSubheadline.trim()) {
        return doc.heroSubheadline.trim()
      }
      return defaultHomepageSeo.description
    },
    generateURL: () => getSiteURL(),
  })
}

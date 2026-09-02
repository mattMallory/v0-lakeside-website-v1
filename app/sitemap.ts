import type { MetadataRoute } from "next"

import { getPublishedPosts } from "@/lib/blog"
import { getSiteUrl } from "@/lib/site-url"

export const revalidate = 3600

type StaticPath = {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}

const STATIC_PATHS: StaticPath[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/consultation", changeFrequency: "monthly", priority: 0.9 },
  { path: "/growth-plan", changeFrequency: "monthly", priority: 0.9 },
  { path: "/demo", changeFrequency: "monthly", priority: 0.5 },
  { path: "/tools/google-ads-budget-planner", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${baseUrl}${entry.path === "/" ? "" : entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))

  const posts = await getPublishedPosts(500)
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...postEntries]
}

import type { Metadata } from "next"

import { BlogHeroBackground } from "@/components/blog-hero-background"
import { BlogRoll } from "@/components/blog-roll"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getBlogCategories, getBlogTags, getPublishedPosts } from "@/lib/blog"
import { getGrowthSystemBackgrounds, layeredSectionBackground } from "@/lib/growth-system-backgrounds"

export const metadata: Metadata = {
  title: "Blog | Lakeside",
  description:
    "Insights, strategies, and practical advice to help natural wellness clinics attract more patients and grow with confidence.",
}

export const revalidate = 60

export default async function BlogPage() {
  const [posts, categories, tags, backgrounds] = await Promise.all([
    getPublishedPosts(),
    getBlogCategories(),
    getBlogTags(),
    getGrowthSystemBackgrounds(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section
        className="relative min-h-[30rem] overflow-hidden border-b border-[#1F2E45] bg-[#0B1220] md:min-h-[26rem]"
        style={layeredSectionBackground(
          "linear-gradient(100deg, rgba(11,18,32,.92) 0%, rgba(11,18,32,.72) 55%, rgba(11,18,32,.35) 100%)",
          backgrounds.hero,
          { backgroundPosition: "center right" },
        )}
      >
        <BlogHeroBackground />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <SectionEyebrow variant="dark">Lakeside Blog</SectionEyebrow>
            <h1 className="font-brand-display mt-4 text-balance text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
              Ideas That Inspire Growth
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#B9C2CF]">
              Practical strategies for natural wellness clinics — from patient acquisition and digital marketing to
              operations that keep your schedule full.
            </p>
          </div>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <BlogRoll posts={posts} categories={categories} tags={tags} />
      </main>

      <SiteFooter />
    </div>
  )
}

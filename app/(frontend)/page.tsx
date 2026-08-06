import { SiteHeader } from "@/components/site-header"
import { HomepageGrowthSystem } from "@/components/homepage-growth-system"
import { SiteFooter } from "@/components/site-footer"
import { getFeaturedCaseStudy, getPublishedPosts } from "@/lib/blog"
import { getHomepageContent } from "@/lib/payload"

export const revalidate = 60

export default async function Home() {
  const homepage = await getHomepageContent()
  const [recentPosts, featuredCaseStudy] = await Promise.all([
    getPublishedPosts(4),
    getFeaturedCaseStudy(homepage.caseStudyHighlight.featuredPostSlug),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HomepageGrowthSystem
          content={homepage}
          posts={recentPosts}
          caseStudy={featuredCaseStudy}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

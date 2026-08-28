import type { Metadata } from "next"

import { GrowthAssessmentPage } from "@/components/growth-assessment/growth-assessment-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getGrowthAssessmentContent } from "@/lib/growth-assessment"
import { getGrowthSystemBackgrounds } from "@/lib/growth-system-backgrounds"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const content = await getGrowthAssessmentContent()

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
    },
  }
}

export default async function GrowthPlanPage() {
  const [content, backgrounds] = await Promise.all([
    getGrowthAssessmentContent(),
    getGrowthSystemBackgrounds(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <GrowthAssessmentPage
          content={content}
          heroBackgroundUrl={backgrounds.hero}
          whyBackgroundUrl={backgrounds.who}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

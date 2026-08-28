import type { Metadata } from "next"

import { GrowthAssessmentPage } from "@/components/growth-assessment/growth-assessment-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getConsultationPageContent } from "@/lib/consultation-page"
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
  const [content, backgrounds, consultation] = await Promise.all([
    getGrowthAssessmentContent(),
    getGrowthSystemBackgrounds(),
    getConsultationPageContent(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <GrowthAssessmentPage
          content={content}
          consent={{
            smsNonMarketingConsentLabel: consultation.smsNonMarketingConsentLabel,
            smsMarketingConsentLabel: consultation.smsMarketingConsentLabel,
            privacyLinkLabel: consultation.privacyLinkLabel,
            termsLinkLabel: consultation.termsLinkLabel,
          }}
          heroBackgroundUrl={backgrounds.hero}
          whyBackgroundUrl={backgrounds.who}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

import type { Metadata } from "next"

import { AboutHero } from "@/components/about-hero"
import { AboutProcess } from "@/components/about-process"
import { AboutTeam } from "@/components/about-team"
import { AboutVisionMission } from "@/components/about-vision-mission"
import { CaseStudyHighlight } from "@/components/case-study-highlight"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getAboutContent } from "@/lib/about"
import { getAboutSeo } from "@/lib/about-seo"
import { getFeaturedCaseStudy } from "@/lib/blog"
import { getGrowthSystemBackgrounds } from "@/lib/growth-system-backgrounds"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSeo()

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      ...(seo.imageUrl
        ? {
            images: [
              {
                url: seo.imageUrl,
                alt: seo.imageAlt || seo.title,
              },
            ],
          }
        : {}),
    },
  }
}

export default async function AboutPage() {
  const [content, backgrounds] = await Promise.all([
    getAboutContent(),
    getGrowthSystemBackgrounds(),
  ])
  const featuredCaseStudy = await getFeaturedCaseStudy(content.caseStudyHighlight.featuredPostSlug)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <AboutHero
          content={content.hero}
          backgroundImageUrl={content.hero.backgroundImageUrl || backgrounds.hero}
        />
        <AboutVisionMission
          content={content.visionMission}
          backgroundImageUrl={content.visionMission.backgroundImageUrl || backgrounds.who}
        />
        <AboutTeam content={content.team} />
        <AboutProcess content={content.process} />
        <CaseStudyHighlight
          eyebrow={content.caseStudyHighlight.eyebrow}
          headline={content.caseStudyHighlight.headline}
          caseStudy={featuredCaseStudy}
          backgroundImageUrl={
            content.caseStudyHighlight.backgroundImageUrl || backgrounds.pillars
          }
          className="bg-background"
        />

        <CtaSection
          content={{
            ctaHeadline: content.cta.headline,
            ctaSubheadline: content.cta.description,
            ctaButton: content.cta.button,
          }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}

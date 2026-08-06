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
  const content = await getAboutContent()
  const featuredCaseStudy = await getFeaturedCaseStudy(content.caseStudyHighlight.featuredPostSlug)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <AboutHero content={content.hero} />
        <AboutVisionMission content={content.visionMission} />
        <AboutTeam content={content.team} />
        <AboutProcess content={content.process} />
        <CaseStudyHighlight
          eyebrow={content.caseStudyHighlight.eyebrow}
          headline={content.caseStudyHighlight.headline}
          caseStudy={featuredCaseStudy}
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

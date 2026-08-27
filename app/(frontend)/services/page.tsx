import type { Metadata } from "next"

import { CaseStudyHighlight } from "@/components/case-study-highlight"
import { CtaSection } from "@/components/cta-section"
import { GrowthSystemFunnel } from "@/components/homepage-growth-system/growth-system-funnel"
import { HomeAboutSection } from "@/components/home-about-section"
import { ServicesHero } from "@/components/services-hero"
import { ServicesSection } from "@/components/services-section"
import { ServicesTechStack } from "@/components/services-tech-stack"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getFeaturedCaseStudy } from "@/lib/blog"
import { getGrowthSystemBackgrounds } from "@/lib/growth-system-backgrounds"
import { getHomepageContent } from "@/lib/payload"
import { getServicesContent } from "@/lib/services"

export const metadata: Metadata = {
  title: "Services | Lakeside",
  description:
    "Paid advertising, marketing automations, creative support, and full CRM integration — a complete lead generation system built for predictable growth.",
}

export const revalidate = 60

export default async function ServicesPage() {
  const [content, backgrounds, homepage] = await Promise.all([
    getServicesContent(),
    getGrowthSystemBackgrounds(),
    getHomepageContent(),
  ])
  const featuredCaseStudy = await getFeaturedCaseStudy(content.caseStudyHighlight.featuredPostSlug)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <ServicesHero
          content={content.hero}
          backgroundImageUrl={content.hero.backgroundImageUrl || backgrounds.hero}
        />
        <ServicesSection id="services" content={content.offerings} />
        <ServicesTechStack
          content={content.technology}
          backgroundImageUrl={backgrounds.pillars}
        />
        <div className="bg-[#F9F7F4]">
          <GrowthSystemFunnel content={homepage} />
        </div>
        <CaseStudyHighlight
          eyebrow={content.caseStudyHighlight.eyebrow}
          headline={content.caseStudyHighlight.headline}
          caseStudy={featuredCaseStudy}
          backgroundImageUrl={
            content.caseStudyHighlight.backgroundImageUrl || backgrounds.pillars
          }
          className="bg-white"
        />
        <HomeAboutSection
          content={content.about}
          variant="dark"
          backgroundImageUrl={content.about.backgroundImageUrl || backgrounds.pillars}
        />
        <CtaSection
          className="pt-[84px]"
          content={{
            ctaHeadline: content.cta.headline,
            ctaSubheadline: content.cta.subheadline,
            ctaButton: content.cta.button,
          }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}

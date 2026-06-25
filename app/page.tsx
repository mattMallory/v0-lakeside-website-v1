import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { HowItWorks } from "@/components/how-it-works"
import { ServicesSection } from "@/components/services-section"
import { WhyChoose } from "@/components/why-choose"
import { WhoWeHelp } from "@/components/who-we-help"
import { StorySection } from "@/components/story-section"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { getHomepageContent } from "@/lib/payload"

export const dynamic = "force-dynamic"

export default async function Home() {
  const homepage = await getHomepageContent()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero
          content={{
            heroEyebrow: homepage.heroEyebrow,
            heroHeadline: homepage.heroHeadline,
            heroSubheadline: homepage.heroSubheadline,
            heroPrimaryCta: homepage.heroPrimaryCta,
            heroSecondaryCta: homepage.heroSecondaryCta,
          }}
        />
        <ProblemSection
          content={{
            headline: homepage.problemHeadline,
            subheadline: homepage.problemSubheadline,
            items: homepage.problemItems,
          }}
        />
        <SolutionSection
          content={{
            eyebrow: homepage.solutionEyebrow,
            headline: homepage.solutionHeadline,
            description: homepage.solutionDescription,
            cta: homepage.solutionCta,
            pillars: homepage.solutionPillars,
          }}
        />
        <HowItWorks
          content={{
            headline: homepage.howItWorksHeadline,
            subheadline: homepage.howItWorksSubheadline,
            button: homepage.howItWorksButton,
            steps: homepage.howItWorksSteps,
          }}
        />
        <ServicesSection
          content={{
            eyebrow: homepage.servicesEyebrow,
            headline: homepage.servicesHeadline,
            items: homepage.servicesItems,
          }}
        />
        <WhyChoose
          content={{
            headline: homepage.whyChooseHeadline,
            description: homepage.whyChooseDescription,
            cta: homepage.whyChooseCta,
            cards: homepage.whyChooseCards,
          }}
        />
        <WhoWeHelp
          content={{
            headline: homepage.whoWeHelpHeadline,
            subheadline: homepage.whoWeHelpSubheadline,
            practices: homepage.whoWeHelpPractices,
          }}
        />
        <StorySection
          content={{
            eyebrow: homepage.storyEyebrow,
            headline: homepage.storyHeadline,
            description: homepage.storyDescription,
            primaryCta: homepage.storyPrimaryCta,
            secondaryCta: homepage.storySecondaryCta,
            imageUrl: homepage.storyImageUrl,
            imageAlt: homepage.storyImageAlt,
            notificationTitle: homepage.storyNotificationTitle,
            notificationHeading: homepage.storyNotificationHeading,
            notificationBody: homepage.storyNotificationBody,
          }}
        />
        <CtaSection
          content={{
            ctaHeadline: homepage.ctaHeadline,
            ctaSubheadline: homepage.ctaSubheadline,
            ctaButton: homepage.ctaButton,
          }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <ServicesSection />
        <WhyChoose />
        <WhoWeHelp />
        <StorySection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}

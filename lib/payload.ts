import { defaultHomepageContent } from "@/lib/homepage-defaults"

export type ProblemItem = {
  icon: string
  imageUrl: string
  title: string
  description: string
}

export type SolutionPillar = {
  text: string
}

export type HowItWorksStep = {
  number: string
  title: string
  description: string
}

export type ServiceItem = {
  icon: string
  title: string
  description: string
}

export type WhyChooseCard = {
  baseImage: string
  baseAlt: string
  overlayImage: string
  overlayAlt: string
  overlayWidthClass: string
  overlayPositionClassMobile: string
  overlayPositionClass: string
  heading: string
  body: string
}

export type WhoWeHelpPractice = {
  icon: string
  name: string
  imageUrl?: string
  imageAlt?: string
  detail: string
}

export type HomepageContent = {
  heroEyebrow: string
  heroHeadline: string
  heroSubheadline: string
  heroPrimaryCta: string
  heroSecondaryCta: string

  problemHeadline: string
  problemSubheadline: string
  problemItems: ProblemItem[]

  solutionEyebrow: string
  solutionHeadline: string
  solutionDescription: string
  solutionCta: string
  solutionPillars: SolutionPillar[]

  howItWorksHeadline: string
  howItWorksSubheadline: string
  howItWorksButton: string
  howItWorksSteps: HowItWorksStep[]

  servicesEyebrow: string
  servicesHeadline: string
  servicesItems: ServiceItem[]

  whyChooseHeadline: string
  whyChooseDescription: string
  whyChooseCta: string
  whyChooseCards: WhyChooseCard[]

  whoWeHelpHeadline: string
  whoWeHelpSubheadline: string
  whoWeHelpPractices: WhoWeHelpPractice[]

  storyEyebrow: string
  storyHeadline: string
  storyDescription: string
  storyPrimaryCta: string
  storySecondaryCta: string
  storyImageUrl: string
  storyImageAlt: string
  storyNotificationTitle: string
  storyNotificationHeading: string
  storyNotificationBody: string

  ctaHeadline: string
  ctaSubheadline: string
  ctaButton: string
}

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mergeArray<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  if (!value || value.length === 0) return fallback
  return value
}

function getPostgresUrl() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL
  )
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!process.env.PAYLOAD_SECRET || !getPostgresUrl()) {
    return defaultHomepageContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const homepage = await payload.findGlobal({
      slug: "homepage",
      depth: 0,
    })

    return {
      heroEyebrow: withFallback(homepage.heroEyebrow, defaultHomepageContent.heroEyebrow),
      heroHeadline: withFallback(homepage.heroHeadline, defaultHomepageContent.heroHeadline),
      heroSubheadline: withFallback(homepage.heroSubheadline, defaultHomepageContent.heroSubheadline),
      heroPrimaryCta: withFallback(homepage.heroPrimaryCta, defaultHomepageContent.heroPrimaryCta),
      heroSecondaryCta: withFallback(homepage.heroSecondaryCta, defaultHomepageContent.heroSecondaryCta),

      problemHeadline: withFallback(homepage.problemHeadline, defaultHomepageContent.problemHeadline),
      problemSubheadline: withFallback(homepage.problemSubheadline, defaultHomepageContent.problemSubheadline),
      problemItems: mergeArray(homepage.problemItems, defaultHomepageContent.problemItems),

      solutionEyebrow: withFallback(homepage.solutionEyebrow, defaultHomepageContent.solutionEyebrow),
      solutionHeadline: withFallback(homepage.solutionHeadline, defaultHomepageContent.solutionHeadline),
      solutionDescription: withFallback(
        homepage.solutionDescription,
        defaultHomepageContent.solutionDescription,
      ),
      solutionCta: withFallback(homepage.solutionCta, defaultHomepageContent.solutionCta),
      solutionPillars: mergeArray(homepage.solutionPillars, defaultHomepageContent.solutionPillars),

      howItWorksHeadline: withFallback(homepage.howItWorksHeadline, defaultHomepageContent.howItWorksHeadline),
      howItWorksSubheadline: withFallback(
        homepage.howItWorksSubheadline,
        defaultHomepageContent.howItWorksSubheadline,
      ),
      howItWorksButton: withFallback(homepage.howItWorksButton, defaultHomepageContent.howItWorksButton),
      howItWorksSteps: mergeArray(homepage.howItWorksSteps, defaultHomepageContent.howItWorksSteps),

      servicesEyebrow: withFallback(homepage.servicesEyebrow, defaultHomepageContent.servicesEyebrow),
      servicesHeadline: withFallback(homepage.servicesHeadline, defaultHomepageContent.servicesHeadline),
      servicesItems: mergeArray(homepage.servicesItems, defaultHomepageContent.servicesItems),

      whyChooseHeadline: withFallback(homepage.whyChooseHeadline, defaultHomepageContent.whyChooseHeadline),
      whyChooseDescription: withFallback(
        homepage.whyChooseDescription,
        defaultHomepageContent.whyChooseDescription,
      ),
      whyChooseCta: withFallback(homepage.whyChooseCta, defaultHomepageContent.whyChooseCta),
      whyChooseCards: mergeArray(homepage.whyChooseCards, defaultHomepageContent.whyChooseCards),

      whoWeHelpHeadline: withFallback(homepage.whoWeHelpHeadline, defaultHomepageContent.whoWeHelpHeadline),
      whoWeHelpSubheadline: withFallback(
        homepage.whoWeHelpSubheadline,
        defaultHomepageContent.whoWeHelpSubheadline,
      ),
      whoWeHelpPractices: mergeArray(
        homepage.whoWeHelpPractices,
        defaultHomepageContent.whoWeHelpPractices,
      ),

      storyEyebrow: withFallback(homepage.storyEyebrow, defaultHomepageContent.storyEyebrow),
      storyHeadline: withFallback(homepage.storyHeadline, defaultHomepageContent.storyHeadline),
      storyDescription: withFallback(homepage.storyDescription, defaultHomepageContent.storyDescription),
      storyPrimaryCta: withFallback(homepage.storyPrimaryCta, defaultHomepageContent.storyPrimaryCta),
      storySecondaryCta: withFallback(homepage.storySecondaryCta, defaultHomepageContent.storySecondaryCta),
      storyImageUrl: withFallback(homepage.storyImageUrl, defaultHomepageContent.storyImageUrl),
      storyImageAlt: withFallback(homepage.storyImageAlt, defaultHomepageContent.storyImageAlt),
      storyNotificationTitle: withFallback(
        homepage.storyNotificationTitle,
        defaultHomepageContent.storyNotificationTitle,
      ),
      storyNotificationHeading: withFallback(
        homepage.storyNotificationHeading,
        defaultHomepageContent.storyNotificationHeading,
      ),
      storyNotificationBody: withFallback(
        homepage.storyNotificationBody,
        defaultHomepageContent.storyNotificationBody,
      ),

      ctaHeadline: withFallback(homepage.ctaHeadline, defaultHomepageContent.ctaHeadline),
      ctaSubheadline: withFallback(homepage.ctaSubheadline, defaultHomepageContent.ctaSubheadline),
      ctaButton: withFallback(homepage.ctaButton, defaultHomepageContent.ctaButton),
    }
  } catch (error) {
    console.error("[payload] Failed to load homepage content:", error)
    return defaultHomepageContent
  }
}

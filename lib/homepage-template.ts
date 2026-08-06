import type { CaseStudyHighlightContent } from "@/lib/case-study-highlight"

export type GrowthSystemStat = {
  value: string
  label: string
}

export type GrowthSystemCriterion = {
  icon: string
  title: string
  description: string
}

export type GrowthSystemFunnelStep = {
  tag: string
  title: string
  detail: string
  buttonLabel: string
  imageUrl?: string
  imageAlt?: string
}

export type GrowthSystemPillar = {
  icon: string
  title: string
  body: string
}

export type GrowthSystemIncludedItem = {
  title: string
  body: string
}

export type GrowthSystemTestimonial = {
  photoUrl: string
  photoAlt: string
  quote: string
  name: string
  practice: string
}

export type GrowthSystemTeamMember = {
  photoUrl: string
  photoAlt: string
  name: string
  role: string
  bio: string
  linkedinUrl?: string
}

export type GrowthSystemNextStep = {
  title: string
  description: string
}

export type GrowthSystemContent = {
  heroEyebrow: string
  heroHeadline: string
  heroHeadlineAccent: string
  heroSubheadline: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroStats: GrowthSystemStat[]

  whoEyebrow: string
  whoHeadline: string
  whoDescription: string
  whoCriteria: GrowthSystemCriterion[]
  whoDisqualifier: string

  funnelEyebrow: string
  funnelHeadline: string
  funnelDescription: string
  funnelLinkLabel: string
  funnelLinkUrl: string
  funnelSteps: GrowthSystemFunnelStep[]

  pillarsEyebrow: string
  pillarsHeadline: string
  pillarsDescription: string
  pillars: GrowthSystemPillar[]

  includedEyebrow: string
  includedHeadline: string
  includedDescription: string
  includedItems: GrowthSystemIncludedItem[]

  caseStudyHighlight: CaseStudyHighlightContent

  resultsEyebrow: string
  resultsHeadline: string
  resultsPlaceholder: string
  testimonials: GrowthSystemTestimonial[]

  teamEyebrow: string
  teamHeadline: string
  teamDescription: string
  teamImageUrl: string
  teamImageAlt: string
  teamMembers: GrowthSystemTeamMember[]

  articlesEyebrow: string
  articlesHeadline: string
  articlesLinkLabel: string

  nextEyebrow: string
  nextHeadline: string
  nextSteps: GrowthSystemNextStep[]

  auditHeadline: string
  auditDescription: string
  auditButtonLabel: string
  auditButtonUrl: string
}

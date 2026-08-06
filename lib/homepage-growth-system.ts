import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"
import type { GrowthSystemContent } from "@/lib/homepage-template"
import { mapCaseStudyHighlight } from "@/lib/case-study-highlight"

type MediaLike = {
  url?: string | null
  alt?: string | null
}

type HomepageDoc = Record<string, unknown>

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mergeArray<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  if (!value || value.length === 0) return fallback
  return value
}

function resolveMediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.url === "string" && media.url.trim() ? media.url : undefined
}

type FunnelStepDoc = {
  tag?: string | null
  title?: string | null
  detail?: string | null
  buttonLabel?: string | null
  image?: number | MediaLike | null
  imageUrl?: string | null
  imageAlt?: string | null
}

type TeamMemberDoc = {
  photo?: number | MediaLike | null
  photoUrl?: string | null
  photoAlt?: string | null
  name?: string | null
  role?: string | null
  bio?: string | null
  linkedinUrl?: string | null
}

type TestimonialDoc = {
  photo?: number | MediaLike | null
  photoUrl?: string | null
  photoAlt?: string | null
  quote?: string | null
  name?: string | null
  practice?: string | null
}

export function mapGrowthSystemContent(doc: HomepageDoc): GrowthSystemContent {
  const defaults = defaultGrowthSystemContent

  const teamMembers = mergeArray(
    doc.gsTeamMembers as TeamMemberDoc[] | null | undefined,
    defaults.teamMembers,
  )
    .map((member, index) => {
      const fallback = defaults.teamMembers[index]
      if (!member.name || !member.role || !member.bio) return null

      const photoUrl =
        resolveMediaUrl(member.photo) ??
        (typeof member.photoUrl === "string" && member.photoUrl.trim()
          ? member.photoUrl
          : fallback?.photoUrl ?? "")

      return {
        photoUrl,
        photoAlt: withFallback(member.photoAlt, fallback?.photoAlt ?? member.name),
        name: member.name,
        role: member.role,
        bio: member.bio,
        linkedinUrl: member.linkedinUrl ?? fallback?.linkedinUrl,
      }
    })
    .filter((member): member is NonNullable<typeof member> => Boolean(member))

  const funnelSteps = mergeArray(
    doc.gsFunnelSteps as FunnelStepDoc[] | null | undefined,
    defaults.funnelSteps,
  )
    .map((step, index) => {
      const fallback = defaults.funnelSteps[index]
      if (!step.tag || !step.title || !step.detail || !step.buttonLabel) return null

      const imageUrl =
        resolveMediaUrl(step.image) ??
        (typeof step.imageUrl === "string" && step.imageUrl.trim()
          ? step.imageUrl
          : fallback?.imageUrl)

      return {
        tag: step.tag,
        title: step.title,
        detail: step.detail,
        buttonLabel: step.buttonLabel,
        imageUrl,
        imageAlt: withFallback(step.imageAlt, fallback?.imageAlt ?? step.title),
      }
    })
    .filter((step): step is NonNullable<typeof step> => Boolean(step))

  return {
    heroEyebrow: withFallback(doc.gsHeroEyebrow as string, defaults.heroEyebrow),
    heroHeadline: withFallback(doc.gsHeroHeadline as string, defaults.heroHeadline),
    heroHeadlineAccent: withFallback(
      doc.gsHeroHeadlineAccent as string,
      defaults.heroHeadlineAccent,
    ),
    heroSubheadline: withFallback(doc.gsHeroSubheadline as string, defaults.heroSubheadline),
    heroPrimaryCta: withFallback(doc.gsHeroPrimaryCta as string, defaults.heroPrimaryCta),
    heroSecondaryCta: withFallback(doc.gsHeroSecondaryCta as string, defaults.heroSecondaryCta),
    heroStats: mergeArray(
      doc.gsHeroStats as GrowthSystemContent["heroStats"],
      defaults.heroStats,
    ),

    whoEyebrow: withFallback(doc.gsWhoEyebrow as string, defaults.whoEyebrow),
    whoHeadline: withFallback(doc.gsWhoHeadline as string, defaults.whoHeadline),
    whoDescription: withFallback(doc.gsWhoDescription as string, defaults.whoDescription),
    whoCriteria: mergeArray(
      doc.gsWhoCriteria as GrowthSystemContent["whoCriteria"],
      defaults.whoCriteria,
    ),
    whoDisqualifier: withFallback(doc.gsWhoDisqualifier as string, defaults.whoDisqualifier),

    funnelEyebrow: withFallback(doc.gsFunnelEyebrow as string, defaults.funnelEyebrow),
    funnelHeadline: withFallback(doc.gsFunnelHeadline as string, defaults.funnelHeadline),
    funnelDescription: withFallback(doc.gsFunnelDescription as string, defaults.funnelDescription),
    funnelLinkLabel: withFallback(doc.gsFunnelLinkLabel as string, defaults.funnelLinkLabel),
    funnelLinkUrl: withFallback(doc.gsFunnelLinkUrl as string, defaults.funnelLinkUrl),
    funnelSteps: funnelSteps.length > 0 ? funnelSteps : defaults.funnelSteps,

    pillarsEyebrow: withFallback(doc.gsPillarsEyebrow as string, defaults.pillarsEyebrow),
    pillarsHeadline: withFallback(doc.gsPillarsHeadline as string, defaults.pillarsHeadline),
    pillarsDescription: withFallback(
      doc.gsPillarsDescription as string,
      defaults.pillarsDescription,
    ),
    pillars: mergeArray(doc.gsPillars as GrowthSystemContent["pillars"], defaults.pillars),

    includedEyebrow: withFallback(doc.gsIncludedEyebrow as string, defaults.includedEyebrow),
    includedHeadline: withFallback(doc.gsIncludedHeadline as string, defaults.includedHeadline),
    includedDescription: withFallback(
      doc.gsIncludedDescription as string,
      defaults.includedDescription,
    ),
    includedItems: mergeArray(
      doc.gsIncludedItems as GrowthSystemContent["includedItems"],
      defaults.includedItems,
    ),

    caseStudyHighlight: mapCaseStudyHighlight(doc, defaults.caseStudyHighlight),

    resultsEyebrow: withFallback(doc.gsResultsEyebrow as string, defaults.resultsEyebrow),
    resultsHeadline: withFallback(doc.gsResultsHeadline as string, defaults.resultsHeadline),
    resultsPlaceholder: withFallback(
      doc.gsResultsPlaceholder as string,
      defaults.resultsPlaceholder,
    ),
    testimonials: mergeArray(
      doc.gsTestimonials as TestimonialDoc[] | null | undefined,
      defaults.testimonials,
    )
      .map((item, index) => {
        const fallback = defaults.testimonials[index]
        if (!item.quote || !item.name || !item.practice) return null

        const photoUrl =
          resolveMediaUrl(item.photo) ??
          (typeof item.photoUrl === "string" && item.photoUrl.trim()
            ? item.photoUrl
            : fallback?.photoUrl ?? "")

        return {
          photoUrl,
          photoAlt: withFallback(item.photoAlt, fallback?.photoAlt ?? item.name),
          quote: item.quote,
          name: item.name,
          practice: item.practice,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),

    teamEyebrow: withFallback(doc.gsTeamEyebrow as string, defaults.teamEyebrow),
    teamHeadline: withFallback(doc.gsTeamHeadline as string, defaults.teamHeadline),
    teamDescription: withFallback(doc.gsTeamDescription as string, defaults.teamDescription),
    teamImageUrl:
      resolveMediaUrl(doc.gsTeamImage as number | MediaLike | null | undefined) ??
      (typeof doc.gsTeamImageUrl === "string" && doc.gsTeamImageUrl.trim()
        ? doc.gsTeamImageUrl
        : defaults.teamImageUrl),
    teamImageAlt: withFallback(doc.gsTeamImageAlt as string, defaults.teamImageAlt),
    teamMembers: teamMembers.length > 0 ? teamMembers : defaults.teamMembers,

    articlesEyebrow: withFallback(doc.gsArticlesEyebrow as string, defaults.articlesEyebrow),
    articlesHeadline: withFallback(doc.gsArticlesHeadline as string, defaults.articlesHeadline),
    articlesLinkLabel: withFallback(
      doc.gsArticlesLinkLabel as string,
      defaults.articlesLinkLabel,
    ),

    nextEyebrow: withFallback(doc.gsNextEyebrow as string, defaults.nextEyebrow),
    nextHeadline: withFallback(doc.gsNextHeadline as string, defaults.nextHeadline),
    nextSteps: mergeArray(
      doc.gsNextSteps as GrowthSystemContent["nextSteps"],
      defaults.nextSteps,
    ),

    auditHeadline: withFallback(doc.gsAuditHeadline as string, defaults.auditHeadline),
    auditDescription: withFallback(doc.gsAuditDescription as string, defaults.auditDescription),
    auditButtonLabel: withFallback(doc.gsAuditButtonLabel as string, defaults.auditButtonLabel),
    auditButtonUrl: withFallback(doc.gsAuditButtonUrl as string, defaults.auditButtonUrl),
  }
}

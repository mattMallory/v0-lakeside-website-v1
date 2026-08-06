import { mergeArray, resolveMediaUrl, withFallback } from "@/lib/cms-mappers"
import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"
import type { GrowthSystemContent } from "@/lib/homepage-template"
import { mapCaseStudyHighlight } from "@/lib/case-study-highlight"
import type { Homepage } from "@/payload-types"

// The homepage document was previously typed as `Record<string, unknown>` and read through
// casts, so a renamed CMS field still compiled, yielded undefined, and silently fell back
// to a default. Reading it as the generated `Homepage` type makes that a build-time error.
type HomepageDoc = Homepage

export function mapGrowthSystemContent(doc: HomepageDoc): GrowthSystemContent {
  const defaults = defaultGrowthSystemContent

  const teamMembers = (doc.gsTeamMembers ?? [])
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

  const funnelSteps = (doc.gsFunnelSteps ?? [])
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

  const testimonials = (doc.gsTestimonials ?? [])
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
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return {
    heroEyebrow: withFallback(doc.gsHeroEyebrow, defaults.heroEyebrow),
    heroHeadline: withFallback(doc.gsHeroHeadline, defaults.heroHeadline),
    heroHeadlineAccent: withFallback(
      doc.gsHeroHeadlineAccent,
      defaults.heroHeadlineAccent,
    ),
    heroSubheadline: withFallback(doc.gsHeroSubheadline, defaults.heroSubheadline),
    heroPrimaryCta: withFallback(doc.gsHeroPrimaryCta, defaults.heroPrimaryCta),
    heroSecondaryCta: withFallback(doc.gsHeroSecondaryCta, defaults.heroSecondaryCta),
    heroStats: mergeArray(
      doc.gsHeroStats,
      defaults.heroStats,
    ),

    whoEyebrow: withFallback(doc.gsWhoEyebrow, defaults.whoEyebrow),
    whoHeadline: withFallback(doc.gsWhoHeadline, defaults.whoHeadline),
    whoDescription: withFallback(doc.gsWhoDescription, defaults.whoDescription),
    whoCriteria: mergeArray(
      doc.gsWhoCriteria,
      defaults.whoCriteria,
    ),
    whoDisqualifier: withFallback(doc.gsWhoDisqualifier, defaults.whoDisqualifier),

    funnelEyebrow: withFallback(doc.gsFunnelEyebrow, defaults.funnelEyebrow),
    funnelHeadline: withFallback(doc.gsFunnelHeadline, defaults.funnelHeadline),
    funnelDescription: withFallback(doc.gsFunnelDescription, defaults.funnelDescription),
    funnelLinkLabel: withFallback(doc.gsFunnelLinkLabel, defaults.funnelLinkLabel),
    funnelLinkUrl: withFallback(doc.gsFunnelLinkUrl, defaults.funnelLinkUrl),
    funnelSteps: funnelSteps.length > 0 ? funnelSteps : defaults.funnelSteps,

    pillarsEyebrow: withFallback(doc.gsPillarsEyebrow, defaults.pillarsEyebrow),
    pillarsHeadline: withFallback(doc.gsPillarsHeadline, defaults.pillarsHeadline),
    pillarsDescription: withFallback(
      doc.gsPillarsDescription,
      defaults.pillarsDescription,
    ),
    pillars: mergeArray(doc.gsPillars, defaults.pillars),

    includedEyebrow: withFallback(doc.gsIncludedEyebrow, defaults.includedEyebrow),
    includedHeadline: withFallback(doc.gsIncludedHeadline, defaults.includedHeadline),
    includedDescription: withFallback(
      doc.gsIncludedDescription,
      defaults.includedDescription,
    ),
    includedItems: mergeArray(
      doc.gsIncludedItems,
      defaults.includedItems,
    ),

    caseStudyHighlight: mapCaseStudyHighlight(doc, defaults.caseStudyHighlight),

    resultsEyebrow: withFallback(doc.gsResultsEyebrow, defaults.resultsEyebrow),
    resultsHeadline: withFallback(doc.gsResultsHeadline, defaults.resultsHeadline),
    resultsPlaceholder: withFallback(
      doc.gsResultsPlaceholder,
      defaults.resultsPlaceholder,
    ),
    testimonials: testimonials.length > 0 ? testimonials : defaults.testimonials,

    teamEyebrow: withFallback(doc.gsTeamEyebrow, defaults.teamEyebrow),
    teamHeadline: withFallback(doc.gsTeamHeadline, defaults.teamHeadline),
    teamDescription: withFallback(doc.gsTeamDescription, defaults.teamDescription),
    teamImageUrl:
      resolveMediaUrl(doc.gsTeamImage) ??
      (typeof doc.gsTeamImageUrl === "string" && doc.gsTeamImageUrl.trim()
        ? doc.gsTeamImageUrl
        : defaults.teamImageUrl),
    teamImageAlt: withFallback(doc.gsTeamImageAlt, defaults.teamImageAlt),
    teamMembers: teamMembers.length > 0 ? teamMembers : defaults.teamMembers,

    articlesEyebrow: withFallback(doc.gsArticlesEyebrow, defaults.articlesEyebrow),
    articlesHeadline: withFallback(doc.gsArticlesHeadline, defaults.articlesHeadline),
    articlesLinkLabel: withFallback(
      doc.gsArticlesLinkLabel,
      defaults.articlesLinkLabel,
    ),

    nextEyebrow: withFallback(doc.gsNextEyebrow, defaults.nextEyebrow),
    nextHeadline: withFallback(doc.gsNextHeadline, defaults.nextHeadline),
    nextSteps: mergeArray(
      doc.gsNextSteps,
      defaults.nextSteps,
    ),

    auditHeadline: withFallback(doc.gsAuditHeadline, defaults.auditHeadline),
    auditDescription: withFallback(doc.gsAuditDescription, defaults.auditDescription),
    auditButtonLabel: withFallback(doc.gsAuditButtonLabel, defaults.auditButtonLabel),
    auditButtonUrl: withFallback(doc.gsAuditButtonUrl, defaults.auditButtonUrl),
  }
}

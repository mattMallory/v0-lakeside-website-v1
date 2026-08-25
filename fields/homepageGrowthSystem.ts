import type { Field, Tab } from "payload"

import { caseStudyHighlightFields } from "@/fields/caseStudyHighlight"
import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"
import { iconOptions } from "@/lib/icons"

const iconField = {
  name: "icon",
  type: "select" as const,
  options: iconOptions,
  required: true,
}

const homepageTab = (label: string, fields: Field[]): Tab => ({
  label,
  fields,
})

export const homepageGrowthSystemTabs: Tab[] = [
  homepageTab("Hero", [
    {
      name: "gsBgHero",
      type: "upload",
      relationTo: "media",
      label: "Section background",
      admin: {
        description:
          "Background for this hero, the Results band, and the Blog hero when Blog doesn’t set its own.",
      },
    },
    {
      name: "gsHeroEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.heroEyebrow,
    },
    {
      name: "gsHeroHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.heroHeadline,
    },
    {
      name: "gsHeroHeadlineAccent",
      type: "text",
      label: "Headline accent (highlighted)",
      defaultValue: defaultGrowthSystemContent.heroHeadlineAccent,
    },
    {
      name: "gsHeroSubheadline",
      type: "textarea",
      label: "Subheadline",
      defaultValue: defaultGrowthSystemContent.heroSubheadline,
    },
    {
      name: "gsHeroPrimaryCta",
      type: "text",
      label: "Primary CTA",
      defaultValue: defaultGrowthSystemContent.heroPrimaryCta,
    },
    {
      name: "gsHeroSecondaryCta",
      type: "text",
      label: "Secondary CTA",
      defaultValue: defaultGrowthSystemContent.heroSecondaryCta,
    },
    {
      name: "gsHeroStats",
      type: "array",
      label: "Hero stats",
      defaultValue: defaultGrowthSystemContent.heroStats,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
  ]),
  homepageTab("Who It's For", [
    {
      name: "gsBgWho",
      type: "upload",
      relationTo: "media",
      label: "Section background",
      admin: {
        description: "Background for the Who It's For panel.",
      },
    },
    {
      name: "gsWhoEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.whoEyebrow,
    },
    {
      name: "gsWhoHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.whoHeadline,
    },
    {
      name: "gsWhoDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.whoDescription,
    },
    {
      name: "gsWhoCriteria",
      type: "array",
      label: "Criteria cards",
      defaultValue: defaultGrowthSystemContent.whoCriteria,
      fields: [
        iconField,
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "gsWhoDisqualifier",
      type: "text",
      label: "Disqualifier note",
      defaultValue: defaultGrowthSystemContent.whoDisqualifier,
    },
  ]),
  homepageTab("Funnel", [
    {
      name: "gsFunnelEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.funnelEyebrow,
    },
    {
      name: "gsFunnelHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.funnelHeadline,
    },
    {
      name: "gsFunnelDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.funnelDescription,
    },
    {
      name: "gsFunnelLinkLabel",
      type: "text",
      label: "Inline link label",
      defaultValue: defaultGrowthSystemContent.funnelLinkLabel,
    },
    {
      name: "gsFunnelLinkUrl",
      type: "text",
      label: "Inline link URL",
      defaultValue: defaultGrowthSystemContent.funnelLinkUrl,
    },
    {
      name: "gsFunnelSteps",
      type: "array",
      label: "Funnel stages",
      defaultValue: defaultGrowthSystemContent.funnelSteps,
      fields: [
        { name: "tag", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "detail", type: "textarea", required: true },
        { name: "buttonLabel", type: "text", label: "Button label", required: true },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Step image",
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Image URL (fallback)",
        },
        {
          name: "imageAlt",
          type: "text",
          label: "Image alt text",
        },
      ],
    },
  ]),
  homepageTab("Pillars", [
    {
      name: "gsBgPillars",
      type: "upload",
      relationTo: "media",
      label: "Section background",
      admin: {
        description:
          "Background for What We Build. Also used by the Articles (Go Deeper) band on the homepage.",
      },
    },
    {
      name: "gsPillarsEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.pillarsEyebrow,
    },
    {
      name: "gsPillarsHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.pillarsHeadline,
    },
    {
      name: "gsPillarsDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.pillarsDescription,
    },
    {
      name: "gsPillars",
      type: "array",
      label: "Pillars",
      defaultValue: defaultGrowthSystemContent.pillars,
      fields: [
        iconField,
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ]),
  homepageTab("Included", [
    {
      name: "gsBgIncluded",
      type: "upload",
      relationTo: "media",
      label: "Section background",
      admin: {
        description: "Background for the What’s Included header band.",
      },
    },
    {
      name: "gsIncludedEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.includedEyebrow,
    },
    {
      name: "gsIncludedHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.includedHeadline,
    },
    {
      name: "gsIncludedDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.includedDescription,
    },
    {
      name: "gsIncludedItems",
      type: "array",
      label: "Included items",
      defaultValue: defaultGrowthSystemContent.includedItems,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ]),
  homepageTab("Case Study", caseStudyHighlightFields),
  homepageTab("Results", [
    {
      name: "gsResultsEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.resultsEyebrow,
    },
    {
      name: "gsResultsHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.resultsHeadline,
    },
    {
      name: "gsResultsPlaceholder",
      type: "textarea",
      label: "Internal note (optional)",
      admin: {
        description: "For your team only — not shown on the live site.",
      },
      defaultValue: defaultGrowthSystemContent.resultsPlaceholder,
    },
    {
      name: "gsTestimonials",
      type: "array",
      label: "Featured testimonial",
      maxRows: 1,
      defaultValue: defaultGrowthSystemContent.testimonials,
      fields: [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: "Photo",
        },
        {
          name: "photoUrl",
          type: "text",
          label: "Photo URL (fallback)",
        },
        { name: "photoAlt", type: "text", label: "Photo alt text" },
        { name: "quote", type: "textarea", required: true },
        { name: "name", type: "text", required: true },
        { name: "practice", type: "text", required: true },
      ],
    },
  ]),
  homepageTab("Team", [
    {
      name: "gsTeamEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.teamEyebrow,
    },
    {
      name: "gsTeamHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.teamHeadline,
    },
    {
      name: "gsTeamDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.teamDescription,
    },
    {
      name: "gsTeamImage",
      type: "upload",
      relationTo: "media",
      label: "Team photo",
    },
    {
      name: "gsTeamImageUrl",
      type: "text",
      label: "Team photo URL (fallback)",
      defaultValue: defaultGrowthSystemContent.teamImageUrl,
    },
    {
      name: "gsTeamImageAlt",
      type: "text",
      label: "Team photo alt text",
      defaultValue: defaultGrowthSystemContent.teamImageAlt,
    },
    {
      name: "gsTeamMembers",
      type: "array",
      label: "Team members",
      defaultValue: defaultGrowthSystemContent.teamMembers,
      fields: [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: "Photo",
        },
        {
          name: "photoUrl",
          type: "text",
          label: "Photo URL (fallback)",
        },
        { name: "photoAlt", type: "text", label: "Photo alt text" },
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", required: true },
        { name: "bio", type: "textarea", required: true },
        { name: "linkedinUrl", type: "text", label: "LinkedIn URL" },
      ],
    },
  ]),
  homepageTab("Articles", [
    {
      name: "gsArticlesEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.articlesEyebrow,
    },
    {
      name: "gsArticlesHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.articlesHeadline,
    },
    {
      name: "gsArticlesLinkLabel",
      type: "text",
      label: "View all link label",
      defaultValue: defaultGrowthSystemContent.articlesLinkLabel,
    },
  ]),
  homepageTab("Next Steps", [
    {
      name: "gsNextEyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultGrowthSystemContent.nextEyebrow,
    },
    {
      name: "gsNextHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.nextHeadline,
    },
    {
      name: "gsNextSteps",
      type: "array",
      label: "Steps",
      defaultValue: defaultGrowthSystemContent.nextSteps,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
  ]),
  homepageTab("Audit CTA", [
    {
      name: "gsAuditHeadline",
      type: "text",
      label: "Headline",
      defaultValue: defaultGrowthSystemContent.auditHeadline,
    },
    {
      name: "gsAuditDescription",
      type: "textarea",
      label: "Description",
      defaultValue: defaultGrowthSystemContent.auditDescription,
    },
    {
      name: "gsAuditButtonLabel",
      type: "text",
      label: "Button label",
      defaultValue: defaultGrowthSystemContent.auditButtonLabel,
    },
    {
      name: "gsAuditButtonUrl",
      type: "text",
      label: "Button URL",
      defaultValue: defaultGrowthSystemContent.auditButtonUrl,
    },
  ]),
]

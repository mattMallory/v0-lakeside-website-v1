import type { CollectionConfig } from "payload"
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical"

import { BlogArticleCtaBlock } from "@/blocks/BlogArticleCta"
import { BlogAuthorBioBlock } from "@/blocks/BlogAuthorBio"
import { BlogBulletListBlock } from "@/blocks/BlogBulletList"
import { BlogCalloutBlock } from "@/blocks/BlogCallout"
import { BlogCardGridBlock } from "@/blocks/BlogCardGrid"
import { BlogReferencesBlock } from "@/blocks/BlogReferences"
import { BlogTagPillsBlock } from "@/blocks/BlogTagPills"
import { BudgetPlannerBlock } from "@/blocks/BudgetPlanner"
import { OfferBuilderBlock } from "@/blocks/OfferBuilder"
import { PatientJourneyBlock } from "@/blocks/PatientJourney"
import { defaultTuscolaCaseStudyMetrics } from "@/lib/case-study-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

const articleContentEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
    BlocksFeature({
      blocks: [
        PatientJourneyBlock,
        BudgetPlannerBlock,
        OfferBuilderBlock,
        BlogCalloutBlock,
        BlogCardGridBlock,
        BlogTagPillsBlock,
        BlogBulletListBlock,
        BlogReferencesBlock,
        BlogAuthorBioBlock,
        BlogArticleCtaBlock,
      ],
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

const caseStudyMetricFields = [
  {
    name: "eyebrow",
    type: "text" as const,
    label: "Metric Label",
    required: true,
  },
  {
    name: "value",
    type: "number" as const,
    label: "Animated Value",
    admin: {
      description: "Leave empty to use Display Value only (no count-up animation).",
    },
  },
  {
    name: "prefix",
    type: "text" as const,
    label: "Prefix",
    admin: {
      placeholder: "+",
    },
  },
  {
    name: "suffix",
    type: "text" as const,
    label: "Suffix",
    admin: {
      placeholder: "%",
    },
  },
  {
    name: "decimals",
    type: "number" as const,
    label: "Decimal Places",
    defaultValue: 0,
  },
  {
    name: "displayValue",
    type: "text" as const,
    label: "Display Value Override",
    admin: {
      description: "Use for values like “Local → National” that should not animate.",
    },
  },
  {
    name: "description",
    type: "textarea" as const,
    label: "Supporting Text",
    required: true,
  },
  {
    name: "isHighlighted",
    type: "checkbox" as const,
    label: "Highlight Card",
    defaultValue: false,
  },
  {
    name: "highlightLabel",
    type: "text" as const,
    label: "Highlight Badge",
    defaultValue: "Featured Result",
  },
  {
    name: "spanFull",
    type: "checkbox" as const,
    label: "Full Width Row",
    defaultValue: false,
  },
]

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Post",
    plural: "Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "postType", "status", "publishedAt", "updatedAt"],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        status: {
          equals: "published",
        },
      }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data?.slug && typeof data?.title === "string") {
          data.slug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        }
        return data
      },
    ],
    afterChange: [
      async () => {
        await revalidateSite()
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Article Content",
          fields: [
            {
              name: "content",
              type: "richText",
              editor: articleContentEditor,
              required: true,
            },
          ],
        },
        {
          label: "Case Study Metrics",
          admin: {
            condition: (data) => data?.postType === "case-study",
          },
          fields: [
            {
              name: "clientName",
              type: "text",
              label: "Client Name",
            },
            {
              name: "clientLocation",
              type: "text",
              label: "Client Location",
            },
            {
              name: "clientPracticeType",
              type: "text",
              label: "Practice Type",
              admin: {
                description: "e.g. Chiropractic, Acupuncture, Integrative Medicine",
              },
            },
            {
              name: "clientServices",
              type: "textarea",
              label: "Primary Services",
            },
            {
              name: "clientEngagementFocus",
              type: "textarea",
              label: "Engagement Focus",
              admin: {
                description: "e.g. Branding, ecommerce, paid media",
              },
            },
            {
              name: "clientMarketReach",
              type: "text",
              label: "Market Reach",
              admin: {
                description: "e.g. Local, Regional, National",
              },
            },
            {
              name: "caseStudyMetrics",
              type: "array",
              label: "Key Results",
              admin: {
                description:
                  "Add 3 standard metric cards for the homepage grid. Use Full Width Row only if you want a fourth bar on the blog post page.",
              },
              defaultValue: defaultTuscolaCaseStudyMetrics,
              fields: caseStudyMetricFields,
            },
          ],
        },
      ],
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "postType",
      type: "select",
      label: "Post Type",
      required: true,
      defaultValue: "article",
      options: [
        { label: "Article", value: "article" },
        { label: "Case Study", value: "case-study" },
      ],
      admin: {
        position: "sidebar",
        description: "Choose Case Study to edit animated metrics and use the case study layout.",
      },
    },
    {
      name: "authorName",
      type: "text",
      label: "Author",
      defaultValue: "Lakeside Team",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "readTime",
      type: "text",
      label: "Read Time",
      admin: {
        position: "sidebar",
        description: 'e.g. "9 min read"',
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
}

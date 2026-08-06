import type { GlobalConfig } from "payload"

import { defaultLegalContent } from "@/lib/legal-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

const legalSectionFields = [
  {
    name: "title",
    type: "text" as const,
    label: "Section Title",
    required: true,
  },
  {
    name: "body",
    type: "textarea" as const,
    label: "Section Body",
    required: true,
  },
]

const legalPageFields = (prefix: "privacy" | "terms", defaults: (typeof defaultLegalContent)["privacy"]) => [
  {
    name: `${prefix}Eyebrow`,
    type: "text" as const,
    label: "Eyebrow",
    defaultValue: defaults.eyebrow,
  },
  {
    name: `${prefix}Title`,
    type: "text" as const,
    label: "Page Title",
    required: true,
    defaultValue: defaults.title,
  },
  {
    name: `${prefix}LastUpdated`,
    type: "text" as const,
    label: "Last Updated Label",
    defaultValue: defaults.lastUpdated,
  },
  {
    name: `${prefix}Intro`,
    type: "textarea" as const,
    label: "Introduction",
    defaultValue: defaults.intro,
  },
  {
    name: `${prefix}Sections`,
    type: "array" as const,
    label: "Sections",
    labels: {
      singular: "Section",
      plural: "Sections",
    },
    defaultValue: defaults.sections,
    fields: legalSectionFields,
  },
  {
    name: `${prefix}SeoTitle`,
    type: "text" as const,
    label: "SEO Title",
    defaultValue: defaults.seoTitle,
  },
  {
    name: `${prefix}SeoDescription`,
    type: "textarea" as const,
    label: "SEO Description",
    defaultValue: defaults.seoDescription,
  },
]

export const Legal: GlobalConfig = {
  slug: "legal",
  label: "Legal Pages",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        await revalidateSite()
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Privacy Policy",
          fields: legalPageFields("privacy", defaultLegalContent.privacy),
        },
        {
          label: "Terms of Service",
          fields: legalPageFields("terms", defaultLegalContent.terms),
        },
      ],
    },
  ],
}

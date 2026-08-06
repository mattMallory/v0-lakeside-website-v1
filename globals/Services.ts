import type { GlobalConfig } from "payload"

import { iconOptions } from "@/lib/icons"
import { caseStudyHighlightFields } from "@/fields/caseStudyHighlight"
import { defaultServicesContent } from "@/lib/services-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

const iconField = {
  name: "icon",
  type: "select" as const,
  options: iconOptions,
  required: true,
}

export const Services: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
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
          label: "Hero",
          fields: [
            {
              name: "heroEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultServicesContent.hero.eyebrow,
            },
            {
              name: "heroTitle",
              type: "text",
              label: "Headline",
              required: true,
              defaultValue: defaultServicesContent.hero.title,
            },
            {
              name: "heroDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultServicesContent.hero.description,
            },
          ],
        },
        {
          label: "Offerings",
          fields: [
            {
              name: "offeringsEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultServicesContent.offerings.eyebrow,
            },
            {
              name: "offeringsHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultServicesContent.offerings.headline,
            },
            {
              name: "offeringsItems",
              type: "array",
              label: "Service Cards",
              defaultValue: defaultServicesContent.offerings.items,
              fields: [
                iconField,
                {
                  name: "title",
                  type: "text",
                  required: true,
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "About",
          fields: [
            {
              name: "aboutEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultServicesContent.about.eyebrow,
            },
            {
              name: "aboutHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultServicesContent.about.headline,
            },
            {
              name: "aboutDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultServicesContent.about.description,
            },
            {
              name: "aboutCta",
              type: "text",
              label: "CTA Button",
              defaultValue: defaultServicesContent.about.cta,
            },
            {
              name: "aboutImage",
              type: "upload",
              relationTo: "media",
              label: "Image",
            },
            {
              name: "aboutImageAlt",
              type: "text",
              label: "Image Alt Text",
              defaultValue: defaultServicesContent.about.imageAlt,
            },
          ],
        },
        {
          label: "Case Study Highlight",
          fields: caseStudyHighlightFields,
        },
        {
          label: "CTA",
          fields: [
            {
              name: "ctaHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultServicesContent.cta.headline,
            },
            {
              name: "ctaSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultServicesContent.cta.subheadline,
            },
            {
              name: "ctaButton",
              type: "text",
              label: "Button Text",
              defaultValue: defaultServicesContent.cta.button,
            },
          ],
        },
        {
          label: "Technology Stack",
          fields: [
            {
              name: "technologyEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultServicesContent.technology.eyebrow,
            },
            {
              name: "technologyHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultServicesContent.technology.headline,
            },
            {
              name: "technologyDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultServicesContent.technology.description,
            },
            {
              name: "technologyCategories",
              type: "array",
              label: "Platform Cards",
              admin: {
                description: "Each card shows a platform image, title, and list of tools.",
              },
              defaultValue: defaultServicesContent.technology.categories.map((category) => ({
                title: category.title,
                imageAlt: category.imageAlt,
                items: category.items.map((label) => ({ label })),
              })),
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: "Card Image",
                },
                {
                  name: "imageAlt",
                  type: "text",
                  label: "Image Alt Text",
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  label: "Card Title",
                  required: true,
                },
                {
                  name: "items",
                  type: "array",
                  label: "Platforms / Tools",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

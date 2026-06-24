import type { GlobalConfig } from "payload"

import { iconOptions } from "@/lib/icons"
import { defaultHomepageContent } from "@/lib/homepage-defaults"

const iconField = {
  name: "icon",
  type: "select" as const,
  options: iconOptions,
  required: true,
}

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  access: {
    read: () => true,
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
              defaultValue: defaultHomepageContent.heroEyebrow,
            },
            {
              name: "heroHeadline",
              type: "text",
              label: "Headline",
              required: true,
              defaultValue: defaultHomepageContent.heroHeadline,
            },
            {
              name: "heroSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultHomepageContent.heroSubheadline,
            },
            {
              name: "heroPrimaryCta",
              type: "text",
              label: "Primary CTA",
              defaultValue: defaultHomepageContent.heroPrimaryCta,
            },
            {
              name: "heroSecondaryCta",
              type: "text",
              label: "Secondary CTA",
              defaultValue: defaultHomepageContent.heroSecondaryCta,
            },
          ],
        },
        {
          label: "Problems",
          fields: [
            {
              name: "problemHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.problemHeadline,
            },
            {
              name: "problemSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultHomepageContent.problemSubheadline,
            },
            {
              name: "problemItems",
              type: "array",
              label: "Problem Cards",
              defaultValue: defaultHomepageContent.problemItems,
              fields: [
                iconField,
                {
                  name: "imageUrl",
                  type: "text",
                  label: "Image URL",
                  required: true,
                },
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
          label: "Solution",
          fields: [
            {
              name: "solutionEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultHomepageContent.solutionEyebrow,
            },
            {
              name: "solutionHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.solutionHeadline,
            },
            {
              name: "solutionDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultHomepageContent.solutionDescription,
            },
            {
              name: "solutionCta",
              type: "text",
              label: "CTA Button",
              defaultValue: defaultHomepageContent.solutionCta,
            },
            {
              name: "solutionPillars",
              type: "array",
              label: "Pillars",
              defaultValue: defaultHomepageContent.solutionPillars,
              fields: [
                {
                  name: "text",
                  type: "text",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "How It Works",
          fields: [
            {
              name: "howItWorksHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.howItWorksHeadline,
            },
            {
              name: "howItWorksSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultHomepageContent.howItWorksSubheadline,
            },
            {
              name: "howItWorksButton",
              type: "text",
              label: "Button Text",
              defaultValue: defaultHomepageContent.howItWorksButton,
            },
            {
              name: "howItWorksSteps",
              type: "array",
              label: "Steps",
              defaultValue: defaultHomepageContent.howItWorksSteps,
              fields: [
                {
                  name: "number",
                  type: "text",
                  required: true,
                },
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
          label: "Services",
          fields: [
            {
              name: "servicesEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultHomepageContent.servicesEyebrow,
            },
            {
              name: "servicesHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.servicesHeadline,
            },
            {
              name: "servicesItems",
              type: "array",
              label: "Services",
              defaultValue: defaultHomepageContent.servicesItems,
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
          label: "Why Choose",
          fields: [
            {
              name: "whyChooseHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.whyChooseHeadline,
            },
            {
              name: "whyChooseDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultHomepageContent.whyChooseDescription,
            },
            {
              name: "whyChooseCta",
              type: "text",
              label: "CTA Button",
              defaultValue: defaultHomepageContent.whyChooseCta,
            },
            {
              name: "whyChooseCards",
              type: "array",
              label: "Cards",
              defaultValue: defaultHomepageContent.whyChooseCards,
              fields: [
                {
                  name: "baseImage",
                  type: "text",
                  label: "Base Image URL",
                  required: true,
                },
                {
                  name: "baseAlt",
                  type: "text",
                  label: "Base Image Alt Text",
                  required: true,
                },
                {
                  name: "overlayImage",
                  type: "text",
                  label: "Overlay Image URL",
                  required: true,
                },
                {
                  name: "overlayAlt",
                  type: "text",
                  label: "Overlay Alt Text",
                  required: true,
                },
                {
                  name: "overlayWidthClass",
                  type: "text",
                  label: "Overlay Width Class",
                  required: true,
                },
                {
                  name: "overlayPositionClassMobile",
                  type: "text",
                  label: "Overlay Position (Mobile)",
                  required: true,
                },
                {
                  name: "overlayPositionClass",
                  type: "text",
                  label: "Overlay Position (Desktop)",
                  required: true,
                },
                {
                  name: "heading",
                  type: "text",
                  required: true,
                },
                {
                  name: "body",
                  type: "textarea",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Who We Help",
          fields: [
            {
              name: "whoWeHelpHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.whoWeHelpHeadline,
            },
            {
              name: "whoWeHelpSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultHomepageContent.whoWeHelpSubheadline,
            },
            {
              name: "whoWeHelpPractices",
              type: "array",
              label: "Practices",
              defaultValue: defaultHomepageContent.whoWeHelpPractices,
              fields: [
                iconField,
                {
                  name: "name",
                  type: "text",
                  required: true,
                },
                {
                  name: "imageUrl",
                  type: "text",
                  label: "Image URL (optional, shown when expanded)",
                },
                {
                  name: "imageAlt",
                  type: "text",
                  label: "Image Alt Text",
                },
                {
                  name: "detail",
                  type: "textarea",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Story",
          fields: [
            {
              name: "storyEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultHomepageContent.storyEyebrow,
            },
            {
              name: "storyHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.storyHeadline,
            },
            {
              name: "storyDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultHomepageContent.storyDescription,
            },
            {
              name: "storyPrimaryCta",
              type: "text",
              label: "Primary CTA",
              defaultValue: defaultHomepageContent.storyPrimaryCta,
            },
            {
              name: "storySecondaryCta",
              type: "text",
              label: "Secondary CTA",
              defaultValue: defaultHomepageContent.storySecondaryCta,
            },
            {
              name: "storyImageUrl",
              type: "text",
              label: "Image URL",
              defaultValue: defaultHomepageContent.storyImageUrl,
            },
            {
              name: "storyImageAlt",
              type: "text",
              label: "Image Alt Text",
              defaultValue: defaultHomepageContent.storyImageAlt,
            },
            {
              name: "storyNotificationTitle",
              type: "text",
              label: "Notification Title",
              defaultValue: defaultHomepageContent.storyNotificationTitle,
            },
            {
              name: "storyNotificationHeading",
              type: "text",
              label: "Notification Heading",
              defaultValue: defaultHomepageContent.storyNotificationHeading,
            },
            {
              name: "storyNotificationBody",
              type: "text",
              label: "Notification Body",
              defaultValue: defaultHomepageContent.storyNotificationBody,
            },
          ],
        },
        {
          label: "CTA Section",
          fields: [
            {
              name: "ctaHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultHomepageContent.ctaHeadline,
            },
            {
              name: "ctaSubheadline",
              type: "textarea",
              label: "Subheadline",
              defaultValue: defaultHomepageContent.ctaSubheadline,
            },
            {
              name: "ctaButton",
              type: "text",
              label: "Button Text",
              defaultValue: defaultHomepageContent.ctaButton,
            },
          ],
        },
      ],
    },
  ],
}

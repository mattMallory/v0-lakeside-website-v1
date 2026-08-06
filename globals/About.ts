import type { GlobalConfig } from "payload"

import { imagePositionField } from "@/fields/imagePosition"
import { caseStudyHighlightFields } from "@/fields/caseStudyHighlight"
import { defaultAboutContent } from "@/lib/about-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

export const About: GlobalConfig = {
  slug: "about",
  label: "About Page",
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
              defaultValue: defaultAboutContent.hero.eyebrow,
            },
            {
              name: "heroTitle",
              type: "text",
              label: "Title",
              required: true,
              defaultValue: defaultAboutContent.hero.title,
            },
            {
              name: "heroDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultAboutContent.hero.description,
            },
            {
              type: "collapsible",
              label: "Hero Image",
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: "heroImage",
                  type: "upload",
                  relationTo: "media",
                  label: "Image",
                },
                {
                  name: "heroImageAlt",
                  type: "text",
                  label: "Alt Text",
                  defaultValue: defaultAboutContent.hero.imageAlt,
                },
                imagePositionField({
                  name: "heroImagePosition",
                  label: "Image Alignment",
                }),
              ],
            },
          ],
        },
        {
          label: "Vision & Mission",
          fields: [
            {
              name: "visionMissionHeadline",
              type: "text",
              label: "Headline",
              defaultValue: defaultAboutContent.visionMission.headline,
            },
            {
              name: "visionLabel",
              type: "text",
              label: "Vision Label",
              defaultValue: defaultAboutContent.visionMission.vision.label,
            },
            {
              name: "visionText",
              type: "textarea",
              label: "Vision Text",
              defaultValue: defaultAboutContent.visionMission.vision.text,
            },
            {
              name: "missionLabel",
              type: "text",
              label: "Mission Label",
              defaultValue: defaultAboutContent.visionMission.mission.label,
            },
            {
              name: "missionText",
              type: "textarea",
              label: "Mission Text",
              defaultValue: defaultAboutContent.visionMission.mission.text,
            },
          ],
        },
        {
          label: "Process",
          fields: [
            {
              name: "processEyebrow",
              type: "text",
              label: "Process Eyebrow",
              defaultValue: defaultAboutContent.process.eyebrow,
            },
            {
              name: "processTitle",
              type: "text",
              label: "Process Title",
              defaultValue: defaultAboutContent.process.title,
            },
            {
              name: "processDescription",
              type: "textarea",
              label: "Process Description",
              defaultValue: defaultAboutContent.process.description,
            },
            {
              name: "processCenterTitle",
              type: "text",
              label: "Infographic Center Title",
              defaultValue: defaultAboutContent.process.centerTitle,
            },
            {
              name: "processCenterSubtitle",
              type: "text",
              label: "Process Center Subtitle",
              defaultValue: defaultAboutContent.process.centerSubtitle,
            },
            {
              name: "processItems",
              type: "array",
              label: "Process Items",
              defaultValue: defaultAboutContent.process.items,
              fields: [
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
          label: "Team",
          fields: [
            {
              name: "teamEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultAboutContent.team.eyebrow,
            },
            {
              name: "teamTitle",
              type: "text",
              label: "Title",
              defaultValue: defaultAboutContent.team.title,
            },
            {
              name: "teamDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultAboutContent.team.description,
            },
            {
              name: "teamMembers",
              type: "array",
              label: "Team Members",
              defaultValue: defaultAboutContent.team.members.map((member) => ({
                name: member.name,
                role: member.role,
                bio: member.bio,
                initials: member.initials ?? "",
              })),
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                },
                {
                  name: "role",
                  type: "text",
                  required: true,
                },
                {
                  name: "bio",
                  type: "textarea",
                  required: true,
                },
                {
                  name: "photo",
                  type: "upload",
                  relationTo: "media",
                  label: "Photo",
                },
                imagePositionField({
                  name: "photoPosition",
                  label: "Photo Alignment",
                }),
                {
                  name: "initials",
                  type: "text",
                  label: "Initials (fallback when no photo)",
                  admin: {
                    description: "Shown when no photo is uploaded, e.g. AB",
                  },
                },
                {
                  name: "linkedinUrl",
                  type: "text",
                  label: "LinkedIn URL",
                  admin: {
                    description: "Full profile URL, e.g. https://linkedin.com/in/username",
                  },
                },
                {
                  name: "youtubeUrl",
                  type: "text",
                  label: "YouTube URL",
                  admin: {
                    description: "Channel or profile URL",
                  },
                },
                {
                  name: "instagramUrl",
                  type: "text",
                  label: "Instagram URL",
                  admin: {
                    description: "Profile URL",
                  },
                },
                {
                  name: "xUrl",
                  type: "text",
                  label: "X (Twitter) URL",
                  admin: {
                    description: "Profile URL",
                  },
                },
                {
                  name: "facebookUrl",
                  type: "text",
                  label: "Facebook URL",
                  admin: {
                    description: "Page or profile URL",
                  },
                },
              ],
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
              defaultValue: defaultAboutContent.cta.headline,
            },
            {
              name: "ctaDescription",
              type: "textarea",
              label: "Description",
              defaultValue: defaultAboutContent.cta.description,
            },
            {
              name: "ctaButton",
              type: "text",
              label: "Button Text",
              defaultValue: defaultAboutContent.cta.button,
            },
          ],
        },
      ],
    },
  ],
}

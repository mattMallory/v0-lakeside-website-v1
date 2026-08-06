import type { Block } from "payload"

export const BlogArticleCtaBlock: Block = {
  slug: "blogArticleCta",
  interfaceName: "BlogArticleCtaBlock",
  labels: {
    singular: "Article CTA",
    plural: "Article CTAs",
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Eyebrow",
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "Button Label",
      defaultValue: "Schedule a conversation",
    },
    {
      name: "ctaUrl",
      type: "text",
      label: "Button URL",
      defaultValue: "/consultation",
    },
  ],
}

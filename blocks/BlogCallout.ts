import type { Block } from "payload"

export const BlogCalloutBlock: Block = {
  slug: "blogCallout",
  interfaceName: "BlogCalloutBlock",
  labels: {
    singular: "Callout",
    plural: "Callouts",
  },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      label: "Callout Text",
    },
  ],
}

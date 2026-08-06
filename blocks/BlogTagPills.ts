import type { Block } from "payload"

export const BlogTagPillsBlock: Block = {
  slug: "blogTagPills",
  interfaceName: "BlogTagPillsBlock",
  labels: {
    singular: "Tag Pills",
    plural: "Tag Pills",
  },
  fields: [
    {
      name: "pills",
      type: "array",
      label: "Pills",
      minRows: 1,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
  ],
}

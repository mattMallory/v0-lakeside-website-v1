import type { Block } from "payload"

export const BlogCardGridBlock: Block = {
  slug: "blogCardGrid",
  interfaceName: "BlogCardGridBlock",
  labels: {
    singular: "Card Grid",
    plural: "Card Grids",
  },
  fields: [
    {
      name: "cards",
      type: "array",
      label: "Cards",
      minRows: 1,
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
}

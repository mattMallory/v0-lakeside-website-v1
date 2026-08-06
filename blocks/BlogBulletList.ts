import type { Block } from "payload"

export const BlogBulletListBlock: Block = {
  slug: "blogBulletList",
  interfaceName: "BlogBulletListBlock",
  labels: {
    singular: "Bullet List",
    plural: "Bullet Lists",
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "List Items",
      minRows: 1,
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
  ],
}

import type { Block } from "payload"

export const BlogReferencesBlock: Block = {
  slug: "blogReferences",
  interfaceName: "BlogReferencesBlock",
  labels: {
    singular: "References",
    plural: "References",
  },
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "References",
    },
    {
      name: "items",
      type: "array",
      label: "Citations",
      minRows: 1,
      fields: [
        {
          name: "text",
          type: "textarea",
          required: true,
          label: "Citation Text",
        },
        {
          name: "url",
          type: "text",
          label: "Link URL",
          admin: {
            description: "Optional. If set, the link label below becomes clickable.",
          },
        },
        {
          name: "linkLabel",
          type: "text",
          label: "Link Label",
        },
      ],
    },
  ],
}

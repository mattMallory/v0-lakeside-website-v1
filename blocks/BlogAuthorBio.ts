import type { Block } from "payload"

export const BlogAuthorBioBlock: Block = {
  slug: "blogAuthorBio",
  interfaceName: "BlogAuthorBioBlock",
  labels: {
    singular: "Author Bio",
    plural: "Author Bios",
  },
  fields: [
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Photo",
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Role / Title",
    },
    {
      name: "bio",
      type: "textarea",
      required: true,
    },
    {
      name: "linkedinUrl",
      type: "text",
      label: "LinkedIn URL",
    },
  ],
}

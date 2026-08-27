import type { GlobalConfig } from "payload"

import { defaultDemoSystemContent } from "@/lib/demo-system-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

export const DemoSystem: GlobalConfig = {
  slug: "demo-system",
  label: "Demo The System",
  access: {
    read: () => true,
  },
  admin: {
    description:
      "Coming-soon waitlist page at /demo. Edit the headline, description, and email capture copy. Linked from the main nav as “Demo The System”.",
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
          label: "Page Copy",
          fields: [
            {
              name: "eyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultDemoSystemContent.eyebrow,
            },
            {
              name: "title",
              type: "text",
              label: "Headline",
              required: true,
              defaultValue: defaultDemoSystemContent.title,
            },
            {
              name: "description",
              type: "textarea",
              label: "Description",
              defaultValue: defaultDemoSystemContent.description,
            },
          ],
        },
        {
          label: "Email Capture",
          fields: [
            {
              name: "formTitle",
              type: "text",
              label: "Form Title",
              defaultValue: defaultDemoSystemContent.formTitle,
            },
            {
              name: "formDescription",
              type: "textarea",
              label: "Form Description",
              defaultValue: defaultDemoSystemContent.formDescription,
            },
            {
              name: "formButtonLabel",
              type: "text",
              label: "Button Label",
              defaultValue: defaultDemoSystemContent.formButtonLabel,
            },
            {
              name: "successTitle",
              type: "text",
              label: "Success Title",
              defaultValue: defaultDemoSystemContent.successTitle,
            },
            {
              name: "successMessage",
              type: "textarea",
              label: "Success Message",
              defaultValue: defaultDemoSystemContent.successMessage,
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seoTitle",
              type: "text",
              label: "SEO Title",
              defaultValue: defaultDemoSystemContent.seoTitle,
            },
            {
              name: "seoDescription",
              type: "textarea",
              label: "SEO Description",
              defaultValue: defaultDemoSystemContent.seoDescription,
            },
          ],
        },
      ],
    },
  ],
}

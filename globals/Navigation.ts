import type { GlobalConfig } from "payload"

import { defaultNavigationContent } from "@/lib/navigation-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

const navItemFields = [
  {
    name: "label",
    type: "text" as const,
    label: "Label",
    required: true,
  },
  {
    name: "href",
    type: "text" as const,
    label: "Link",
    required: true,
    admin: {
      description: "Internal path (e.g. /about) or full URL.",
    },
  },
]

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
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
          label: "Header",
          fields: [
            {
              name: "headerNavItems",
              type: "array" as const,
              label: "Navigation Links",
              labels: {
                singular: "Nav Item",
                plural: "Nav Items",
              },
              defaultValue: defaultNavigationContent.headerNavItems,
              fields: navItemFields,
            },
            {
              name: "headerCtaLabel",
              type: "text" as const,
              label: "CTA Button Label",
              defaultValue: defaultNavigationContent.headerCtaLabel,
            },
            {
              name: "headerCtaHref",
              type: "text" as const,
              label: "CTA Button Link",
              defaultValue: defaultNavigationContent.headerCtaHref,
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "footerDescription",
              type: "textarea" as const,
              label: "Description Under Logo",
              defaultValue: defaultNavigationContent.footerDescription,
              admin: {
                description: "Short blurb shown under the Lakeside logo in the site footer.",
                rows: 3,
              },
            },
            {
              name: "footerNavItems",
              type: "array" as const,
              label: "Pages Column Links",
              labels: {
                singular: "Nav Item",
                plural: "Nav Items",
              },
              defaultValue: defaultNavigationContent.footerNavItems,
              fields: navItemFields,
            },
          ],
        },
      ],
    },
  ],
}

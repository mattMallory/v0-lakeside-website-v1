import type { GlobalConfig } from "payload"

import { defaultCalendarContent } from "@/lib/calendar-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

export const Calendar: GlobalConfig = {
  slug: "calendar",
  label: "Calendar Page",
  access: {
    read: () => true,
  },
  admin: {
    description:
      "Unlisted booking page at /schedule. Paste your Go High Level calendar embed code below. This page is not added to site navigation and is set to noindex.",
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
      name: "eyebrow",
      type: "text",
      label: "Eyebrow",
      defaultValue: defaultCalendarContent.eyebrow,
    },
    {
      name: "title",
      type: "text",
      label: "Page Title",
      required: true,
      defaultValue: defaultCalendarContent.title,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      defaultValue: defaultCalendarContent.description,
    },
    {
      name: "embedCode",
      type: "textarea",
      label: "High Level Calendar Embed Code",
      admin: {
        description:
          "Paste the full embed snippet from GHL (iframe + optional script). Example: Sites → Calendars → Integrate → Embed.",
        rows: 12,
      },
    },
    {
      name: "seoTitle",
      type: "text",
      label: "SEO Title",
      defaultValue: defaultCalendarContent.seoTitle,
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "SEO Description",
      defaultValue: defaultCalendarContent.seoDescription,
    },
  ],
}

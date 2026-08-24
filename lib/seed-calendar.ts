import type { Payload } from "payload"

import { defaultCalendarContent } from "@/lib/calendar-defaults"

export async function seedCalendarIfEmpty(payload: Payload) {
  try {
    const calendar = await payload.findGlobal({
      slug: "calendar",
      depth: 0,
    })

    const isNew = !calendar.id
    const hasTitle = typeof calendar.title === "string" && calendar.title.trim().length > 0

    if (!isNew && hasTitle) {
      return
    }

    await payload.updateGlobal({
      slug: "calendar",
      data: {
        eyebrow: defaultCalendarContent.eyebrow,
        title: defaultCalendarContent.title,
        description: defaultCalendarContent.description,
        embedCode: defaultCalendarContent.embedCode,
        seoTitle: defaultCalendarContent.seoTitle,
        seoDescription: defaultCalendarContent.seoDescription,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed calendar global:", error)
  }
}

import { defaultCalendarContent, type CalendarPageContent } from "@/lib/calendar-defaults"

function withFallback(value: string | null | undefined, fallback: string): string {
  if (value === null || value === undefined) return fallback
  if (value.trim() === "") return fallback
  return value
}

function mapCalendarContent(doc: Record<string, unknown>): CalendarPageContent {
  return {
    eyebrow: withFallback(doc.eyebrow as string, defaultCalendarContent.eyebrow),
    title: withFallback(doc.title as string, defaultCalendarContent.title),
    description: withFallback(doc.description as string, defaultCalendarContent.description),
    embedCode: typeof doc.embedCode === "string" ? doc.embedCode.trim() : "",
    seoTitle: withFallback(doc.seoTitle as string, defaultCalendarContent.seoTitle),
    seoDescription: withFallback(doc.seoDescription as string, defaultCalendarContent.seoDescription),
  }
}

export async function getCalendarPageContent(): Promise<CalendarPageContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultCalendarContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const calendar = await payload.findGlobal({
      slug: "calendar",
      depth: 0,
    })

    return mapCalendarContent(calendar as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load calendar content:", error)
    return defaultCalendarContent
  }
}

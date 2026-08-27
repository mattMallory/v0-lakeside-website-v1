import { cache } from "react"

import {
  defaultDemoSystemContent,
  type DemoSystemContent,
} from "@/lib/demo-system-defaults"

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mapDemoSystemContent(doc: Record<string, unknown>): DemoSystemContent {
  return {
    eyebrow: withFallback(doc.eyebrow as string, defaultDemoSystemContent.eyebrow),
    title: withFallback(doc.title as string, defaultDemoSystemContent.title),
    description: withFallback(doc.description as string, defaultDemoSystemContent.description),
    formTitle: withFallback(doc.formTitle as string, defaultDemoSystemContent.formTitle),
    formDescription: withFallback(
      doc.formDescription as string,
      defaultDemoSystemContent.formDescription,
    ),
    formButtonLabel: withFallback(
      doc.formButtonLabel as string,
      defaultDemoSystemContent.formButtonLabel,
    ),
    successTitle: withFallback(doc.successTitle as string, defaultDemoSystemContent.successTitle),
    successMessage: withFallback(
      doc.successMessage as string,
      defaultDemoSystemContent.successMessage,
    ),
    seoTitle: withFallback(doc.seoTitle as string, defaultDemoSystemContent.seoTitle),
    seoDescription: withFallback(
      doc.seoDescription as string,
      defaultDemoSystemContent.seoDescription,
    ),
  }
}

async function fetchDemoSystemContent(): Promise<DemoSystemContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultDemoSystemContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const demoSystem = await payload.findGlobal({
      slug: "demo-system",
      depth: 0,
    })

    return mapDemoSystemContent(demoSystem as unknown as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load demo system content:", error)
    return defaultDemoSystemContent
  }
}

export const getDemoSystemContent = cache(fetchDemoSystemContent)
export type { DemoSystemContent }

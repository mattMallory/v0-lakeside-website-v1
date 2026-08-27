import type { Payload } from "payload"

import { defaultDemoSystemContent } from "@/lib/demo-system-defaults"

export async function seedDemoSystemIfEmpty(payload: Payload) {
  try {
    const demoSystem = await payload.findGlobal({
      slug: "demo-system",
      depth: 0,
    })

    const isNew = !demoSystem.id
    const hasTitle = typeof demoSystem.title === "string" && demoSystem.title.trim().length > 0

    if (!isNew && hasTitle) {
      return
    }

    await payload.updateGlobal({
      slug: "demo-system",
      data: {
        eyebrow: defaultDemoSystemContent.eyebrow,
        title: defaultDemoSystemContent.title,
        description: defaultDemoSystemContent.description,
        formTitle: defaultDemoSystemContent.formTitle,
        formDescription: defaultDemoSystemContent.formDescription,
        formButtonLabel: defaultDemoSystemContent.formButtonLabel,
        successTitle: defaultDemoSystemContent.successTitle,
        successMessage: defaultDemoSystemContent.successMessage,
        seoTitle: defaultDemoSystemContent.seoTitle,
        seoDescription: defaultDemoSystemContent.seoDescription,
      },
    })
  } catch (error) {
    console.error("[payload] Failed to seed demo-system global:", error)
  }
}

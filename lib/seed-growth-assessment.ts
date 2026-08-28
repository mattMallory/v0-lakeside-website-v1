import type { Payload } from "payload"

import { defaultGrowthAssessmentContent } from "@/lib/growth-assessment-defaults"
import { growthAssessmentToPayloadData } from "@/lib/growth-assessment-payload"

export async function seedGrowthAssessmentIfEmpty(payload: Payload) {
  try {
    const existing = await payload.findGlobal({
      slug: "growth-assessment",
      depth: 0,
    })

    if (existing.id) {
      return
    }

    await payload.updateGlobal({
      slug: "growth-assessment",
      data: growthAssessmentToPayloadData(defaultGrowthAssessmentContent),
    })
  } catch (error) {
    console.error("[payload] Failed to seed growth-assessment global:", error)
  }
}

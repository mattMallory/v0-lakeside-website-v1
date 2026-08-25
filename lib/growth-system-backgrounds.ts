import type { CSSProperties } from "react"

import { getHomepageContent } from "@/lib/payload"
import type { GrowthSystemBackgrounds } from "@/lib/homepage-template"
import { growthSystemBackgrounds as defaultBackgrounds } from "@/lib/homepage-growth-system-defaults"

/**
 * Build a CSS background that always keeps the gradient, and only layers an
 * image when Payload has one uploaded (avoids broken remote hotlinks).
 */
export function layeredSectionBackground(
  gradient: string,
  imageUrl: string | undefined | null,
  options?: {
    backgroundSize?: string
    backgroundPosition?: string
  },
): CSSProperties {
  const url = typeof imageUrl === "string" ? imageUrl.trim() : ""
  return {
    backgroundImage: url ? `${gradient}, url('${url}')` : gradient,
    backgroundSize: options?.backgroundSize ?? "cover",
    backgroundPosition: options?.backgroundPosition ?? "center",
  }
}

export async function getGrowthSystemBackgrounds(): Promise<GrowthSystemBackgrounds> {
  try {
    const homepage = await getHomepageContent()
    return homepage.backgrounds
  } catch {
    return { ...defaultBackgrounds }
  }
}

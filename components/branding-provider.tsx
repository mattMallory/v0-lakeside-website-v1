"use client"

import { createContext, useContext, type ReactNode } from "react"

import type { BrandingContent } from "@/lib/branding-defaults"
import { defaultBrandingContent } from "@/lib/branding-defaults"

const BrandingContext = createContext<BrandingContent>(defaultBrandingContent)

export function BrandingProvider({
  value,
  children,
}: {
  value: BrandingContent
  children: ReactNode
}) {
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
}

export function useBranding() {
  return useContext(BrandingContext)
}

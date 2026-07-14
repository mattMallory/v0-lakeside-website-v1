import type { GoogleFontName } from "@/lib/google-fonts"

export type BrandingContent = {
  logoUrl: string
  logoAlt: string
  /** Rendered logo height in pixels (width scales proportionally). */
  logoHeight: number
  primaryColor: string
  iconColor: string
  buttonColor: string
  buttonTextColor: string
  secondaryButtonColor: string
  secondaryButtonTextColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  headingColor: string
  textColor: string
  mutedTextColor: string
  borderColor: string
  focusRingColor: string
  headingFont: GoogleFontName
  bodyFont: GoogleFontName
}

export const defaultBrandingContent: BrandingContent = {
  logoUrl: "/lakeside-logo.svg",
  logoAlt: "Lakeside",
  logoHeight: 44,
  primaryColor: "#3B6FD8",
  iconColor: "#3B6FD8",
  buttonColor: "#3B6FD8",
  buttonTextColor: "#FFFFFF",
  secondaryButtonColor: "#3B6FD8",
  secondaryButtonTextColor: "#3B6FD8",
  secondaryColor: "#E8EEF9",
  accentColor: "#D7E4F8",
  backgroundColor: "#F7F9FC",
  headingColor: "#1B2433",
  textColor: "#1B2433",
  mutedTextColor: "#6B7A90",
  borderColor: "#D9E1EE",
  focusRingColor: "#3B6FD8",
  headingFont: "Lexend Deca",
  bodyFont: "Geist",
}

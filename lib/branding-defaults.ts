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
  surfaceColor: string
  mutedSurfaceColor: string
  buttonHoverColor: string
  buttonActiveColor: string
  inkColor: string
}

/** Lakeside Brand Guide v20 tokens. */
export const defaultBrandingContent: BrandingContent = {
  logoUrl: "/lakeside-logo.svg",
  logoAlt: "Lakeside",
  // 34px is what the header and footer render, so a fresh install is unchanged.
  logoHeight: 34,
  primaryColor: "#2563A8",
  iconColor: "#2563A8",
  buttonColor: "#2563A8",
  buttonTextColor: "#FFFFFF",
  secondaryButtonColor: "#D5D7DB",
  secondaryButtonTextColor: "#374151",
  secondaryColor: "#EFF6FF",
  accentColor: "#DBEAFE",
  backgroundColor: "#F9F7F4",
  headingColor: "#111827",
  textColor: "#111827",
  mutedTextColor: "#6B7280",
  borderColor: "#E8E9EB",
  focusRingColor: "#2563A8",
  // Defaults are the literals the CSS generator used to hardcode, so default branding
  // emits exactly the same values it did before these became editable.
  surfaceColor: "#FFFFFF",
  mutedSurfaceColor: "#F3F4F6",
  buttonHoverColor: "#1D4F8A",
  buttonActiveColor: "#163D6E",
  inkColor: "#0E1726",
}

export const brandGuideTokens = {
  lake: "#2563A8",
  lakeHover: "#1D4F8A",
  lakeActive: "#163D6E",
  lakeLight: "#DBEAFE",
  lakePale: "#EFF6FF",
  ink: "#0E1726",
  offWhite: "#F9F7F4",
  white: "#FFFFFF",
  gray50: "#F3F4F6",
  gray100: "#E8E9EB",
  gray200: "#D5D7DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
} as const

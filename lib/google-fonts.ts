export const googleFontOptions = [
  { label: "Satoshi", value: "Satoshi" },
  { label: "Manrope", value: "Manrope" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Lexend Deca", value: "Lexend Deca" },
  { label: "Geist", value: "Geist" },
  { label: "Inter", value: "Inter" },
  { label: "DM Sans", value: "DM Sans" },
  { label: "Outfit", value: "Outfit" },
  { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { label: "Poppins", value: "Poppins" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Nunito Sans", value: "Nunito Sans" },
  { label: "Source Sans 3", value: "Source Sans 3" },
  { label: "IBM Plex Sans", value: "IBM Plex Sans" },
  { label: "Lato", value: "Lato" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Roboto", value: "Roboto" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Fraunces", value: "Fraunces" },
  { label: "Merriweather", value: "Merriweather" },
  { label: "Libre Baskerville", value: "Libre Baskerville" },
] as const

export type GoogleFontName = (typeof googleFontOptions)[number]["value"]

/** Satoshi is served from Fontshare, not Google Fonts. */
const FONTS_NOT_ON_GOOGLE = new Set<string>(["Satoshi", "Geist"])

export function toGoogleFontFamily(fontName: string): string {
  return `"${fontName}", sans-serif`
}

export function buildGoogleFontsStylesheetUrl(fonts: string[]): string | null {
  const unique = [
    ...new Set(
      fonts
        .map((font) => font.trim())
        .filter((font) => font && !FONTS_NOT_ON_GOOGLE.has(font)),
    ),
  ]

  if (unique.length === 0) {
    return null
  }

  const families = unique
    .map((font) => `family=${encodeURIComponent(font).replace(/%20/g, "+")}:wght@400;500;600;700;800`)
    .join("&")

  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

export function buildFontshareStylesheetUrl(fonts: string[]): string | null {
  const needsSatoshi = fonts.some((font) => font.trim() === "Satoshi")
  if (!needsSatoshi) return null
  return "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap"
}

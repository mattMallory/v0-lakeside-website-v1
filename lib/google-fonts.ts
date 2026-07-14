export const googleFontOptions = [
  { label: "Lexend Deca", value: "Lexend Deca" },
  { label: "Geist", value: "Geist" },
  { label: "Inter", value: "Inter" },
  { label: "DM Sans", value: "DM Sans" },
  { label: "Manrope", value: "Manrope" },
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
  { label: "Space Grotesk", value: "Space Grotesk" },
] as const

export type GoogleFontName = (typeof googleFontOptions)[number]["value"]

export function toGoogleFontFamily(fontName: string): string {
  return `"${fontName}", sans-serif`
}

export function buildGoogleFontsStylesheetUrl(fonts: string[]): string | null {
  const unique = [...new Set(fonts.map((font) => font.trim()).filter(Boolean))]

  if (unique.length === 0) {
    return null
  }

  const families = unique
    .map((font) => `family=${encodeURIComponent(font).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&")

  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

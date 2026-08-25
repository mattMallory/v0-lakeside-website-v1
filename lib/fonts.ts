import localFont from "next/font/local"

// Every font here is self-hosted. `next/font/google` fetches from fonts.gstatic.com at
// build time, which failed four builds during this project with no code change between
// them — the same outage breaks local builds, CI and deploys alike. The files below are
// byte-identical to the ones those fetches were returning.

/** Brand Guide display font — self-hosted. */
export const satoshi = localFont({
  src: [
    {
      path: "../app/fonts/satoshi/Satoshi-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/satoshi/Satoshi-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/satoshi/Satoshi-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

/**
 * Brand Guide body font — self-hosted.
 *
 * One variable file rather than five static ones: the weight axis covers the whole
 * 400–800 range that was declared before, so every weight still resolves from a single
 * request. `fallback` is deliberately not set here, unlike Satoshi above — adding it
 * would append `system-ui, sans-serif` to the emitted stack and change what this font
 * produced before, and this change is meant to be invisible.
 */
export const manrope = localFont({
  src: [
    {
      path: "../app/fonts/manrope/Manrope-Variable.woff2",
      weight: "400 800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
})

/** Logo wordmark only — self-hosted. Variable file, axis covers the declared 500–700. */
export const spaceGrotesk = localFont({
  src: [
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Variable.woff2",
      weight: "500 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
})

/** Resolved font stacks from next/font — use in CSS when variables fail to chain. */
export const headingFontFamily = satoshi.style.fontFamily
export const bodyFontFamily = manrope.style.fontFamily
export const logoFontFamily = spaceGrotesk.style.fontFamily

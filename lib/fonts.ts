import localFont from "next/font/local"
import { Manrope, Space_Grotesk } from "next/font/google"

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
    {
      path: "../app/fonts/satoshi/Satoshi-700.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

/** Brand Guide body font. */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
})

/** Logo wordmark only. */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

/** Resolved font stacks from next/font — use in CSS when variables fail to chain. */
export const headingFontFamily = satoshi.style.fontFamily
export const bodyFontFamily = manrope.style.fontFamily
export const logoFontFamily = spaceGrotesk.style.fontFamily

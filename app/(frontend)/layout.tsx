import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist_Mono, Manrope, Space_Grotesk } from "next/font/google"

import { BrandingProvider } from "@/components/branding-provider"
import { buildBrandingCssVariables, getBrandingContent } from "@/lib/branding"
import {
  buildFontshareStylesheetUrl,
  buildGoogleFontsStylesheetUrl,
} from "@/lib/google-fonts"
import { getHomepageSeo } from "@/lib/homepage-seo"
import "../globals.css"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSeo()

  return {
    title: seo.title,
    description: seo.description,
    generator: "v0.app",
    openGraph: {
      title: seo.title,
      description: seo.description,
      ...(seo.imageUrl
        ? {
            images: [
              {
                url: seo.imageUrl,
                alt: seo.imageAlt || seo.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: seo.imageUrl ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      ...(seo.imageUrl ? { images: [seo.imageUrl] } : {}),
    },
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const branding = await getBrandingContent()
  const googleFontsHref = buildGoogleFontsStylesheetUrl([
    branding.headingFont,
    branding.bodyFont,
    "Space Grotesk",
  ])
  const fontshareHref = buildFontshareStylesheetUrl([
    branding.headingFont,
    branding.bodyFont,
    "Satoshi",
  ])

  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontshareHref ? <link rel="stylesheet" href={fontshareHref} /> : null}
        {googleFontsHref ? <link rel="stylesheet" href={googleFontsHref} /> : null}
        <style dangerouslySetInnerHTML={{ __html: buildBrandingCssVariables(branding) }} />
      </head>
      <body className="font-sans antialiased bg-background text-[18px] leading-[1.72]">
        <BrandingProvider value={branding}>{children}</BrandingProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

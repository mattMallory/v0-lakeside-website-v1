import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Lexend_Deca } from "next/font/google"

import { BrandingProvider } from "@/components/branding-provider"
import { buildBrandingCssVariables, getBrandingContent } from "@/lib/branding"
import { buildGoogleFontsStylesheetUrl } from "@/lib/google-fonts"
import { getHomepageSeo } from "@/lib/homepage-seo"
import "../globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
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
  ])

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${lexendDeca.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {googleFontsHref ? <link rel="stylesheet" href={googleFontsHref} /> : null}
        <style dangerouslySetInnerHTML={{ __html: buildBrandingCssVariables(branding) }} />
      </head>
      <body className="font-sans antialiased bg-background">
        <BrandingProvider value={branding}>{children}</BrandingProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

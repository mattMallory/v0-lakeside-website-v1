import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import Script from "next/script"

import { BrandingProvider } from "@/components/branding-provider"
import { NavigationProvider } from "@/components/navigation-provider"
import { buildBrandingCssVariables, getBrandingContent } from "@/lib/branding"
import { getNavigationContent } from "@/lib/navigation"
import { manrope, satoshi, spaceGrotesk } from "@/lib/fonts"
import { getHomepageSeo } from "@/lib/homepage-seo"
import "../globals.css"

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
  const [branding, navigation] = await Promise.all([
    getBrandingContent(),
    getNavigationContent(),
  ])

  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${manrope.variable} ${spaceGrotesk.variable} max-w-full overflow-x-clip`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildBrandingCssVariables(branding) }} />
      </head>
      <body className={`${manrope.variable} overflow-x-clip antialiased bg-background text-lead leading-[1.72]`}>
        <BrandingProvider value={branding}>
          <NavigationProvider value={navigation}>{children}</NavigationProvider>
        </BrandingProvider>
        <Script src="/scripts/lakeside-budget-planner.js" strategy="afterInteractive" />
        <Script src="/scripts/lakeside-offer-builder.js" strategy="afterInteractive" />
        <Script src="/scripts/lakeside-metric-count-up.js" strategy="afterInteractive" />
        <Script src="/scripts/lakeside-tech-logos-reveal.js" strategy="afterInteractive" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

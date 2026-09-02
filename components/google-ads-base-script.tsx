"use client"

import Script from "next/script"

import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  getGoogleTagLoaderId,
  isGoogleTagConfigured,
} from "@/lib/google-ads"

/**
 * Loads gtag.js for Google Ads and/or GA4 when env vars are set.
 * Place once in the root layout.
 */
export function GoogleAdsBaseScript() {
  if (!isGoogleTagConfigured()) return null

  const loaderId = getGoogleTagLoaderId()
  if (!loaderId) return null

  const configLines = [
    GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : "",
    GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}');` : "",
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-base" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}
        `.trim()}
      </Script>
    </>
  )
}

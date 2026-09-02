"use client"

import Script from "next/script"

import { GOOGLE_ADS_ID, isGoogleAdsConfigured } from "@/lib/google-ads"

/**
 * Loads the Google tag (gtag.js) for Ads when NEXT_PUBLIC_GOOGLE_ADS_ID is set.
 * Place once in the root layout.
 */
export function GoogleAdsBaseScript() {
  if (!isGoogleAdsConfigured()) return null

  const id = GOOGLE_ADS_ID

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-ads-base" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
        `.trim()}
      </Script>
    </>
  )
}

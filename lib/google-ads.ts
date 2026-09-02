/**
 * Google tag (gtag.js) — Ads + Analytics
 *
 * Vercel → Environment Variables (Config, Production):
 *   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL=AbCdEfGhIjKlMnOp
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * Consultation conversion:
 *   In Google Ads → Goals → Conversions → Website thank-you page
 *   URL contains: /consultation/thank-you
 *
 * GA4:
 *   Reuse an existing Measurement ID (G-…) from another site, or create a new
 *   data stream in the same GA4 property for madebylakeside.com.
 *
 * Redeploy after setting env vars.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || ""

export const GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL?.trim() || ""

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || ""

export const CONSULTATION_THANK_YOU_PATH = "/consultation/thank-you"

/** sessionStorage key set after a successful consultation submit */
export const CONSULTATION_CONVERSION_FLAG = "lakeside_consultation_conversion"

export function getGoogleAdsConsultationSendTo(): string | null {
  if (!GOOGLE_ADS_ID || !GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL) return null
  return `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL}`
}

export function isGoogleAdsConfigured(): boolean {
  return Boolean(GOOGLE_ADS_ID)
}

export function isGoogleAnalyticsConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID)
}

/** True when Ads and/or GA4 should load gtag.js */
export function isGoogleTagConfigured(): boolean {
  return isGoogleAdsConfigured() || isGoogleAnalyticsConfigured()
}

/** Primary ID used to load the gtag.js script (Ads preferred, else GA4). */
export function getGoogleTagLoaderId(): string | null {
  return GOOGLE_ADS_ID || GA_MEASUREMENT_ID || null
}

/**
 * Google Ads conversion tracking (gtag.js)
 *
 * Vercel → Environment Variables:
 *   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL=AbCdEfGhIjKlMnOp
 *
 * In Google Ads → Goals → Conversions → New conversion → Website:
 *   - Category: Submit lead form (or similar)
 *   - Use "Thank-you page" / page load
 *   - URL contains: /consultation/thank-you
 *
 * Paste the Conversion ID into NEXT_PUBLIC_GOOGLE_ADS_ID and the
 * Conversion Label into NEXT_PUBLIC_GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL.
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

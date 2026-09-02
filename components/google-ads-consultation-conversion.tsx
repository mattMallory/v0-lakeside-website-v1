"use client"

import { useEffect, useRef } from "react"

import {
  CONSULTATION_CONVERSION_FLAG,
  getGoogleAdsConsultationSendTo,
} from "@/lib/google-ads"

/**
 * Fires the Google Ads consultation conversion once after a real form submit.
 * Requires sessionStorage flag set by the consultation form before redirect.
 */
export function GoogleAdsConsultationConversion() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    if (typeof window === "undefined") return

    const flag = sessionStorage.getItem(CONSULTATION_CONVERSION_FLAG)
    if (flag !== "1") return

    sessionStorage.removeItem(CONSULTATION_CONVERSION_FLAG)
    fired.current = true

    const sendTo = getGoogleAdsConsultationSendTo()
    if (!sendTo || typeof window.gtag !== "function") return

    window.gtag("event", "conversion", { send_to: sendTo })
  }, [])

  return null
}

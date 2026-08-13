import { getGhlConfig } from "@/lib/ghl-private-integration"

/**
 * Go High Level — consultation page (Private Integration)
 *
 * 1. Private Integration with contacts.write scope
 * 2. Server env: GHL_PRIVATE_INTEGRATION_TOKEN, GHL_LOCATION_ID
 * 3. Custom field for the message textarea:
 *    - Unique Key: what_would_you_like_help_with
 *    - Optional env override: GHL_CF_WHAT_WOULD_YOU_LIKE_HELP_WITH=<field id>
 * 4. Message is also saved as a contact Note (Notes tab) on every submission.
 */
export const GHL_CONSULTATION_FIELD_KEYS = {
  message: "what_would_you_like_help_with",
} as const

/** Alternate GHL Unique Keys for the consultation message field. */
export const GHL_CONSULTATION_MESSAGE_ALIASES = [
  "what_would_you_like_help_with",
  "message",
  "help_with",
  "consultation_message",
  "contact_message",
] as const

/** Optional direct field ID when auto-mapping fails (from GHL Custom Fields). */
export function getConsultationMessageFieldId(): string | undefined {
  return (
    process.env.GHL_CONSULTATION_MESSAGE_FIELD_ID?.trim() ||
    process.env.GHL_CF_WHAT_WOULD_YOU_LIKE_HELP_WITH?.trim() ||
    process.env.GHL_CF_MESSAGE?.trim() ||
    undefined
  )
}

export const GHL_CONSULTATION_NOTE_TITLE = "What would you like help with?"

export const GHL_CONSULTATION_TAGS = ["consultation-request", "website-lead"] as const

export const GHL_CONSULTATION_SOURCE = "Consultation Page"

export type ConsultationFormMode = "native" | "embed"

/**
 * Native HTML form when Private Integration is configured on the server.
 * Set NEXT_PUBLIC_GHL_CONTACT_FORM_MODE=embed to keep the legacy GHL iframe.
 */
export function resolveConsultationFormMode(): ConsultationFormMode {
  const mode = process.env.NEXT_PUBLIC_GHL_CONTACT_FORM_MODE?.trim().toLowerCase()

  if (mode === "embed") {
    return "embed"
  }

  if (mode === "api") {
    return "native"
  }

  return getGhlConfig() ? "native" : "embed"
}

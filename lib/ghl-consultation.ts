import { getGhlConfig } from "@/lib/ghl-private-integration"

/**
 * Go High Level — consultation page (Private Integration)
 *
 * 1. Private Integration with contacts.write scope
 * 2. Server env: GHL_PRIVATE_INTEGRATION_TOKEN, GHL_LOCATION_ID
 * 3. Optional custom field for the message textarea:
 *    - Unique Key: message
 *    - Env: GHL_CF_MESSAGE=<field id from GHL Settings → Custom Fields>
 * 4. Workflow trigger: tag "consultation-request" or "website-lead"
 */
export const GHL_CONSULTATION_FIELD_KEYS = {
  message: "message",
} as const

/** Alternate GHL Unique Keys / labels for the consultation message field. */
export const GHL_CONSULTATION_MESSAGE_ALIASES = [
  "message",
  "what_would_you_like_help_with",
  "help_with",
  "consultation_message",
  "contact_message",
  "notes",
] as const

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

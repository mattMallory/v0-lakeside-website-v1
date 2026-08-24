import { getGhlConfig } from "@/lib/ghl-private-integration"
import { GHL_CONSULTATION_QUALIFIED_FIELD_KEYS } from "@/lib/consultation-form"

/**
 * Go High Level — consultation page (Private Integration)
 *
 * 1. Private Integration with contacts.write scope
 * 2. Server env: GHL_PRIVATE_INTEGRATION_TOKEN, GHL_LOCATION_ID
 * 3. Create Contact custom fields with Unique Keys from
 *    lib/consultation-form.ts (GHL_CONSULTATION_QUALIFIED_FIELD_KEYS)
 * 4. Qualified answers are saved as custom fields + a contact Note
 */
export const GHL_CONSULTATION_FIELD_KEYS = {
  message: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.summary,
  practiceWebsite: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.practiceWebsite,
  practiceType: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.practiceType,
  growthChallenge: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.growthChallenge,
  growthChallengeOther: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.growthChallengeOther,
  monthlyNewPatientLeads: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.monthlyNewPatientLeads,
  newPatientCapacity: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.newPatientCapacity,
  paidAdvertising: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.paidAdvertising,
  marketingInvestment: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.marketingInvestment,
  acquisitionTimeline: GHL_CONSULTATION_QUALIFIED_FIELD_KEYS.acquisitionTimeline,
} as const

/** Alternate GHL Unique Keys for the consultation summary / help field. */
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

export const GHL_CONSULTATION_NOTE_TITLE = "Consultation qualification answers"

export const GHL_CONSULTATION_TAGS = [
  "Request Growth Consultation",
  "consultation-request",
  "website-lead",
] as const

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

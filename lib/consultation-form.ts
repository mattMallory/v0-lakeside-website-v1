/**
 * Consultation form options + GHL custom field Unique Keys.
 *
 * Create these Contact custom fields in GHL → Settings → Custom Fields
 * (Single Line Text unless noted). Unique Keys must match exactly.
 *
 * | Unique Key                         | Type              | Example                              |
 * |------------------------------------|-------------------|--------------------------------------|
 * | practice_website                   | Single Line Text | https://exampleclinic.com            |
 * | practice_type                      | Large Text       | Chiropractic; Physical therapy       |
 * | growth_challenge                   | Single Line Text | We need more patient leads           |
 * | growth_challenge_other             | Large Text       | Description when Other is selected   |
 * | monthly_new_patient_leads          | Single Line Text | 10–25                                |
 * | new_patient_capacity               | Single Line Text | 10–25                                |
 * | paid_advertising                   | Large Text       | Google Ads; Facebook or Instagram Ads|
 * | marketing_investment               | Single Line Text | $2,000–$5,000                        |
 * | acquisition_timeline               | Single Line Text | As soon as possible                  |
 * | what_would_you_like_help_with      | Large Text       | Summary of answers (also saved Note) |
 *
 * City and State map to standard GHL contact fields (no custom field needed).
 *
 * Optional env overrides (field IDs):
 *   GHL_CF_PRACTICE_WEBSITE=...
 *   GHL_CF_PRACTICE_TYPE=...
 *   GHL_CF_GROWTH_CHALLENGE=...
 *   GHL_CF_GROWTH_CHALLENGE_OTHER=...
 *   GHL_CF_MONTHLY_NEW_PATIENT_LEADS=...
 *   GHL_CF_NEW_PATIENT_CAPACITY=...
 *   GHL_CF_PAID_ADVERTISING=...
 *   GHL_CF_MARKETING_INVESTMENT=...
 *   GHL_CF_ACQUISITION_TIMELINE=...
 *   GHL_CF_WHAT_WOULD_YOU_LIKE_HELP_WITH=...
 */

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
] as const

export const CONSULTATION_PRACTICE_TYPES = [
  "Chiropractic",
  "Acupuncture",
  "Functional or integrative medicine",
  "Physical therapy",
  "Medical spa",
  "Other wellness practice",
] as const

export const CONSULTATION_GROWTH_CHALLENGES = [
  "We need more patient leads",
  "Leads aren’t scheduling",
  "Follow-up is inconsistent",
  "Our marketing isn’t producing a clear return",
  "We need a complete growth system",
  "Other",
] as const

export const CONSULTATION_MONTHLY_NEW_PATIENT_LEADS = [
  "Fewer than 10",
  "10–25",
  "26–50",
  "More than 50",
  "Not sure",
] as const

export const CONSULTATION_NEW_PATIENT_CAPACITY = [
  "Fewer than 10",
  "10–25",
  "26–50",
  "More than 50",
] as const

export const CONSULTATION_PAID_ADVERTISING = [
  "No, we’re not currently advertising",
  "Google Ads",
  "Facebook or Instagram Ads",
  "Google and Facebook/Instagram Ads",
  "Other platforms",
  "An agency manages our advertising",
  "Not sure",
] as const

export const CONSULTATION_PAID_ADVERTISING_EXCLUSIVE = [
  "No, we’re not currently advertising",
  "Not sure",
] as const

export const CONSULTATION_MARKETING_INVESTMENT = [
  "Not currently investing",
  "Under $2,000",
  "$2,000–$5,000",
  "$5,000–$10,000",
  "More than $10,000",
] as const

export const CONSULTATION_ACQUISITION_TIMELINE = [
  "As soon as possible",
  "Within 1–3 months",
  "Later this year",
  "I’m exploring options",
] as const

export type ConsultationPracticeType = (typeof CONSULTATION_PRACTICE_TYPES)[number]
export type ConsultationGrowthChallenge = (typeof CONSULTATION_GROWTH_CHALLENGES)[number]
export type ConsultationMonthlyNewPatientLeads =
  (typeof CONSULTATION_MONTHLY_NEW_PATIENT_LEADS)[number]
export type ConsultationNewPatientCapacity = (typeof CONSULTATION_NEW_PATIENT_CAPACITY)[number]
export type ConsultationPaidAdvertising = (typeof CONSULTATION_PAID_ADVERTISING)[number]
export type ConsultationMarketingInvestment = (typeof CONSULTATION_MARKETING_INVESTMENT)[number]
export type ConsultationAcquisitionTimeline = (typeof CONSULTATION_ACQUISITION_TIMELINE)[number]

export type ConsultationFormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  practiceName: string
  practiceWebsite: string
  city: string
  state: string
  practiceType: ConsultationPracticeType[]
  growthChallenge: ConsultationGrowthChallenge | ""
  growthChallengeOther: string
  monthlyNewPatientLeads: ConsultationMonthlyNewPatientLeads | ""
  newPatientCapacity: ConsultationNewPatientCapacity | ""
  paidAdvertising: ConsultationPaidAdvertising[]
  marketingInvestment: ConsultationMarketingInvestment | ""
  acquisitionTimeline: ConsultationAcquisitionTimeline | ""
}

export const defaultConsultationFormState: ConsultationFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  practiceName: "",
  practiceWebsite: "",
  city: "",
  state: "",
  practiceType: [],
  growthChallenge: "",
  growthChallengeOther: "",
  monthlyNewPatientLeads: "",
  newPatientCapacity: "",
  paidAdvertising: [],
  marketingInvestment: "",
  acquisitionTimeline: "",
}

export const GHL_CONSULTATION_QUALIFIED_FIELD_KEYS = {
  practiceWebsite: "practice_website",
  practiceType: "practice_type",
  growthChallenge: "growth_challenge",
  growthChallengeOther: "growth_challenge_other",
  monthlyNewPatientLeads: "monthly_new_patient_leads",
  newPatientCapacity: "new_patient_capacity",
  paidAdvertising: "paid_advertising",
  marketingInvestment: "marketing_investment",
  acquisitionTimeline: "acquisition_timeline",
  /** Summary of qualified answers — also used as the contact note body. */
  summary: "what_would_you_like_help_with",
} as const

export function resolveGrowthChallenge(state: ConsultationFormState): string {
  if (state.growthChallenge === "Other") {
    return state.growthChallengeOther.trim() || "Other"
  }
  return state.growthChallenge
}

export function buildConsultationSummary(state: ConsultationFormState): string {
  const lines = [
    `City / State: ${[state.city.trim(), state.state].filter(Boolean).join(", ") || "—"}`,
    `Practice type: ${state.practiceType.length ? state.practiceType.join("; ") : "—"}`,
    `Biggest growth challenge: ${resolveGrowthChallenge(state) || "—"}`,
    `Monthly new patient leads: ${state.monthlyNewPatientLeads || "—"}`,
    `Additional new patients/month: ${state.newPatientCapacity || "—"}`,
    `Paid advertising: ${state.paidAdvertising.length ? state.paidAdvertising.join("; ") : "—"}`,
    `Monthly marketing investment: ${state.marketingInvestment || "—"}`,
    `Timeline: ${state.acquisitionTimeline || "—"}`,
    `Practice website: ${state.practiceWebsite.trim() || "—"}`,
  ]

  return lines.join("\n")
}

export function buildConsultationCustomFields(
  state: ConsultationFormState,
): Record<string, string> {
  const keys = GHL_CONSULTATION_QUALIFIED_FIELD_KEYS
  const summary = buildConsultationSummary(state)
  const growthChallenge = resolveGrowthChallenge(state)

  return {
    [keys.practiceWebsite]: state.practiceWebsite.trim(),
    [keys.practiceType]: state.practiceType.join("; "),
    [keys.growthChallenge]: growthChallenge,
    [keys.growthChallengeOther]:
      state.growthChallenge === "Other" ? state.growthChallengeOther.trim() : "",
    [keys.monthlyNewPatientLeads]: state.monthlyNewPatientLeads,
    [keys.newPatientCapacity]: state.newPatientCapacity,
    [keys.paidAdvertising]: state.paidAdvertising.join("; "),
    [keys.marketingInvestment]: state.marketingInvestment,
    [keys.acquisitionTimeline]: state.acquisitionTimeline,
    [keys.summary]: summary,
  }
}

export function toggleMultiSelectOption<T extends string>(current: T[], option: T): T[] {
  return current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option]
}

export function togglePaidAdvertisingSelection(
  current: ConsultationPaidAdvertising[],
  option: ConsultationPaidAdvertising,
): ConsultationPaidAdvertising[] {
  const exclusive = CONSULTATION_PAID_ADVERTISING_EXCLUSIVE as readonly string[]
  const isExclusive = exclusive.includes(option)
  const alreadySelected = current.includes(option)

  if (alreadySelected) {
    return current.filter((item) => item !== option)
  }

  if (isExclusive) {
    return [option]
  }

  return [...current.filter((item) => !exclusive.includes(item)), option]
}

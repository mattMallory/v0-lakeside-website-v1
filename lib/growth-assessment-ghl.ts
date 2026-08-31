/**
 * Go High Level setup — Growth Assessment (native form → /api/ghl/contact)
 * ========================================================================
 *
 * 1. ENV (Vercel → Project → Settings → Environment Variables)
 *    GHL_PRIVATE_INTEGRATION_TOKEN=...
 *    GHL_LOCATION_ID=...
 *    Optional overrides if auto-discovery fails:
 *    GHL_CF_PRACTICE_WEBSITE=...
 *    GHL_CF_ZIP_CODE=...
 *    GHL_CF_PRIMARY_SERVICE=...
 *    GHL_CF_NEW_PATIENTS_GOAL=...
 *    GHL_CF_NEW_PATIENT_VALUE=...
 *    GHL_CF_GROWTH_ASSESSMENT_SUMMARY=...
 *
 * 2. CUSTOM FIELDS (GHL → Settings → Custom Fields → Contact)
 *    Create Single Line Text fields with these Unique Keys:
 *
 *    | Unique Key                  | Example                          |
 *    |-----------------------------|----------------------------------|
 *    | practice_website            | https://example.com              |
 *    | zip_code                    | 60156                            |
 *    | primary_service             | Chiropractic care                |
 *    | new_patients_goal           | 15                               |
 *    | new_patient_value           | $700                             |
 *    | growth_assessment_summary   | (full multi-line summary)        |
 *
 *    Reuse `practice_website` if you already created it for Consultation.
 *
 * 3. PRIVATE INTEGRATION SCOPES
 *    contacts.write (upsert + update custom fields)
 *    contacts.notes.write (fallback summary note if fields are missing)
 *
 * 4. TAGS (optional — created on first use)
 *    growth-assessment, website-lead
 */
export const GHL_GROWTH_ASSESSMENT_FIELD_KEYS = {
  practiceWebsite: "practice_website",
  zipCode: "zip_code",
  primaryService: "primary_service",
  newPatientsGoal: "new_patients_goal",
  newPatientValue: "new_patient_value",
  summary: "growth_assessment_summary",
} as const

export type GrowthAssessmentGhlFields = {
  website: string
  zipCode: string
  service: string
  goal: string
  value: string
  smsNonMarketingConsent: boolean
  smsMarketingConsent: boolean
}

export function buildGrowthAssessmentSummary(fields: GrowthAssessmentGhlFields): string {
  return [
    `Website: ${fields.website || "—"}`,
    `Zip code: ${fields.zipCode || "—"}`,
    `Primary service: ${fields.service || "—"}`,
    `New patients goal: ${fields.goal ? `${fields.goal}/mo` : "—"}`,
    `New patient value: ${fields.value || "—"}`,
    `SMS non-marketing consent: ${fields.smsNonMarketingConsent ? "Yes" : "No"}`,
    `SMS marketing consent: ${fields.smsMarketingConsent ? "Yes" : "No"}`,
  ].join("\n")
}

export function buildGrowthAssessmentCustomFields(
  fields: GrowthAssessmentGhlFields,
): Record<string, string> {
  const keys = GHL_GROWTH_ASSESSMENT_FIELD_KEYS
  const summary = buildGrowthAssessmentSummary(fields)

  return {
    [keys.practiceWebsite]: fields.website.trim(),
    [keys.zipCode]: fields.zipCode.trim(),
    [keys.primaryService]: fields.service.trim(),
    [keys.newPatientsGoal]: fields.goal.trim(),
    [keys.newPatientValue]: fields.value.trim(),
    [keys.summary]: summary,
  }
}

import {
  computeBudgetPlanner,
  formatBudgetCurrency,
  formatBudgetRange,
  getBudgetPlannerLabels,
  getBudgetPlannerNextStep,
  type BudgetPlannerState,
} from "@/lib/budget-planner"
import { buildGhlFormUrl } from "@/lib/ghl-form"

/**
 * Go High Level setup — budget planner embed flow (default)
 * ================================================
 *
 * 1. ENV (Lakeside site)
 *    NEXT_PUBLIC_BUDGET_PLANNER_SUBMIT_MODE=embed
 *    NEXT_PUBLIC_GHL_BUDGET_PLANNER_FORM_URL=https://api.leadconnectorhq.com/widget/form/xxx
 *
 * 2. CONTACT CUSTOM FIELDS (GHL → Settings → Custom Fields)
 *    Create one field per row below. Use Single Line Text unless noted.
 *    The Unique Key must match exactly (case-sensitive).
 *
 * 3. FORM (GHL → Sites → Forms → Integrate → Embed)
 *    - Visible: email only (optional: first name)
 *    - Hidden: all fields below except email
 *    - Copy the iframe embed URL (not the funnel preview URL)
 *    - In Form Settings, turn OFF "Save Exit Confirmation" for embed flows
 *    - Test pre-fill: append ?email=test@practice.com&budget_range=$1,000–$1,750
 *
 * 4. WORKFLOW (optional — contact + opportunity, no email required)
 *    Trigger: Form Submitted → create opportunity in pipeline stage + tag
 *
 * 5. TEST
 *    - Open /blog/google-ads-budget-planner or /tools/google-ads-budget-planner
 *    - Adjust calculator sliders — hidden fields pre-fill in the embedded form
 *    - Enter email in the GHL form and submit
 *
 * For full-page redirect instead, set NEXT_PUBLIC_BUDGET_PLANNER_SUBMIT_MODE=redirect
 *
 * Field mapping (Unique Key → example value):
 *
 * | Unique Key       | Hidden | Example value                    |
 * |------------------|--------|----------------------------------|
 * | email            | no     | doc@practice.com                 |
 * | patient_value    | yes    | $1,500                           |
 * | market           | yes    | Moderate · suburb                |
 * | service_type     | yes    | General chiropractic care        |
 * | followup         | yes    | Average · same day               |
 * | lead_conversion  | yes    | 17%                              |
 * | budget_low       | yes    | $1,000                           |
 * | budget_high      | yes    | $1,750                           |
 * | budget_range     | yes    | $1,000–$1,750                    |
 * | cost_per_lead    | yes    | $142                             |
 * | cost_per_patient | yes    | $835                             |
 * | next_step        | yes    | Start at the low end…            |
 * | planner_source   | yes    | budget-planner                   |
 * | planner_page_url | yes    | https://lakeside.com/tools/...   |
 *
 * Email template merge fields (adjust to your GHL field names):
 *   {{contact.budget_range}}
 *   {{contact.cost_per_lead}}
 *   {{contact.cost_per_patient}}
 *   {{contact.next_step}}
 *   {{contact.patient_value}}
 *   {{contact.market}}
 */
export const GHL_BUDGET_PLANNER_FIELD_KEYS = {
  email: "email",
  patientValue: "patient_value",
  market: "market",
  serviceType: "service_type",
  followup: "followup",
  leadConversion: "lead_conversion",
  budgetLow: "budget_low",
  budgetHigh: "budget_high",
  budgetRange: "budget_range",
  costPerLead: "cost_per_lead",
  costPerPatient: "cost_per_patient",
  nextStep: "next_step",
  plannerSource: "planner_source",
  plannerPageUrl: "planner_page_url",
} as const

export type BudgetPlannerGhlPayload = {
  /** Omit when the GHL form collects email directly in the embed. */
  email?: string
  state: BudgetPlannerState
  pageUrl?: string
}

export function buildBudgetPlannerFieldValues(payload: BudgetPlannerGhlPayload): Record<string, string> {
  const result = computeBudgetPlanner(payload.state)
  const labels = getBudgetPlannerLabels(payload.state)
  const nextStep = getBudgetPlannerNextStep(payload.state)

  return {
    [GHL_BUDGET_PLANNER_FIELD_KEYS.patientValue]: formatBudgetCurrency(payload.state.patientValue),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.market]: labels.market,
    [GHL_BUDGET_PLANNER_FIELD_KEYS.serviceType]: labels.service,
    [GHL_BUDGET_PLANNER_FIELD_KEYS.followup]: labels.followup,
    [GHL_BUDGET_PLANNER_FIELD_KEYS.leadConversion]: `${payload.state.leadConversion}%`,
    [GHL_BUDGET_PLANNER_FIELD_KEYS.budgetLow]: formatBudgetCurrency(result.budgetLow),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.budgetHigh]: formatBudgetCurrency(result.budgetHigh),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.budgetRange]: formatBudgetRange(
      result.budgetLow,
      result.budgetHigh,
    ),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.costPerLead]: formatBudgetCurrency(result.costPerLead),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.costPerPatient]: formatBudgetCurrency(result.costPerPatient),
    [GHL_BUDGET_PLANNER_FIELD_KEYS.nextStep]: nextStep,
    [GHL_BUDGET_PLANNER_FIELD_KEYS.plannerSource]: "budget-planner",
    [GHL_BUDGET_PLANNER_FIELD_KEYS.plannerPageUrl]: payload.pageUrl ?? "",
  }
}

export function buildBudgetPlannerGhlUrl(
  formBaseUrl: string,
  payload: BudgetPlannerGhlPayload,
): string {
  const fields = buildBudgetPlannerFieldValues(payload)
  const email = payload.email?.trim()
  if (email) {
    fields[GHL_BUDGET_PLANNER_FIELD_KEYS.email] = email
  }
  return buildGhlFormUrl(formBaseUrl, fields)
}

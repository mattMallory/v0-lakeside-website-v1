import type { BudgetPlannerState } from "@/lib/budget-planner"

export function readBudgetPlannerStateFromDom(root: HTMLElement): BudgetPlannerState {
  const patientValueEl = root.querySelector<HTMLInputElement>("#bp-patient-value")
  const leadConversionEl = root.querySelector<HTMLInputElement>("#bp-lead-conversion")
  const marketEl = root.querySelector<HTMLInputElement>('input[name="bp-market"]:checked')
  const serviceEl = root.querySelector<HTMLInputElement>('input[name="bp-service"]:checked')
  const followupEl = root.querySelector<HTMLInputElement>('input[name="bp-followup"]:checked')

  return {
    patientValue: patientValueEl ? Number(patientValueEl.value) : 1500,
    market: (marketEl?.value as BudgetPlannerState["market"]) || "moderate",
    service: (serviceEl?.value as BudgetPlannerState["service"]) || "general",
    followup: (followupEl?.value as BudgetPlannerState["followup"]) || "average",
    leadConversion: leadConversionEl ? Number(leadConversionEl.value) : 17,
  }
}

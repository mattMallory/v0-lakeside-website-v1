export type BudgetMarket = "low" | "moderate" | "high"
export type BudgetService = "general" | "highvalue"
export type BudgetFollowup = "strong" | "average" | "weak"

export type BudgetPlannerState = {
  patientValue: number
  market: BudgetMarket
  service: BudgetService
  followup: BudgetFollowup
  leadConversion: number
}

export type BudgetPlannerResult = {
  budgetLow: number
  budgetHigh: number
  budgetMid: number
  costPerLead: number
  costPerPatient: number
  landingConversion: number
}

const marketLabels: Record<BudgetMarket, string> = {
  low: "Low · small town",
  moderate: "Moderate · suburb",
  high: "High · metro area",
}

const serviceLabels: Record<BudgetService, string> = {
  general: "General chiropractic care",
  highvalue: "Higher-value cash-pay program",
}

const followupLabels: Record<BudgetFollowup, string> = {
  strong: "Strong · minutes",
  average: "Average · same day",
  weak: "Weak · sporadic",
}

export const followupLeadConversionPresets: Record<BudgetFollowup, number> = {
  strong: 25,
  average: 17,
  weak: 9,
}

export const defaultBudgetPlannerState: BudgetPlannerState = {
  patientValue: 1500,
  market: "moderate",
  service: "general",
  followup: "average",
  leadConversion: 17,
}

export function formatBudgetCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`
}

function roundToFifty(value: number): number {
  return Math.round(value / 50) * 50
}

export function computeBudgetPlanner(
  state: BudgetPlannerState,
  assumedLandingConversion = 10,
): BudgetPlannerResult {
  const { patientValue, market, service, leadConversion } = state
  const landingConversion = assumedLandingConversion / 100

  const baseRanges = {
    general: {
      low: [750, 1250],
      moderate: [1000, 1750],
      high: [1500, 2750],
    },
    highvalue: {
      low: [1250, 2000],
      moderate: [1500, 3000],
      high: [2000, 4000],
    },
  } as const

  const [baseLow, baseHigh] = baseRanges[service][market]
  const factor = 0.85 + ((patientValue - 500) / (5000 - 500)) * 0.55
  const budgetLow = roundToFifty(baseLow * factor)
  const budgetHigh = roundToFifty(baseHigh * factor)
  const budgetMid = (budgetLow + budgetHigh) / 2

  const costPerClick = { low: 6, moderate: 8, high: 11 }[market]
  const clicks = budgetMid / costPerClick
  const leads = clicks * landingConversion
  const patients = Math.max(leads * (leadConversion / 100), 0.3)

  return {
    budgetLow,
    budgetHigh,
    budgetMid,
    costPerLead: budgetMid / leads,
    costPerPatient: budgetMid / patients,
    landingConversion,
  }
}

export function getBudgetPlannerNextStep(state: BudgetPlannerState): string {
  const { patientValue, market, service, followup } = state

  if (followup === "weak") {
    return "Fix your front-desk follow-up before you increase spend. More budget just sends more people into a leaky process."
  }

  if (service === "general" && patientValue < 1200) {
    return "Lead with one defined offer (like a sciatica consultation) on a single focused landing page before scaling."
  }

  if (market === "high") {
    return "Start at the low end. Prove new patients trace back to the campaign, then scale into the competitive auction."
  }

  return "Start near the low end of your range, watch your cost per acquired patient, and increase once patients book consistently."
}

export function formatBudgetRange(low: number, high: number): string {
  const plus = high >= 3500 ? "+" : ""
  return `${formatBudgetCurrency(low)}–${formatBudgetCurrency(high)}${plus}`
}

export function buildLocalBudgetPlan(
  state: BudgetPlannerState,
  result: BudgetPlannerResult,
): string {
  const { patientValue, market, service, followup, leadConversion } = state
  const marketWord = {
    low: "less competitive",
    moderate: "moderately competitive",
    high: "competitive metro",
  }[market]
  const servicePhrase =
    service === "highvalue" ? "higher-value cash-pay program" : "general chiropractic care"

  const paragraphOne =
    `Start at ${formatBudgetCurrency(result.budgetLow)} per month, not the top of the range. ` +
    `In a ${marketWord} market promoting ${servicePhrase}, that budget buys enough clicks to gather real conversion data ` +
    `without overspending before the funnel is proven. At roughly ${formatBudgetCurrency(result.costPerLead)} per lead and ` +
    `${formatBudgetCurrency(result.costPerPatient)} per new patient against a ${formatBudgetCurrency(patientValue)} patient value, ` +
    `the math ${
      result.costPerPatient < patientValue * 0.4
        ? "leaves comfortable margin"
        : "is workable but leaves little room for waste"
    }.`

  let focus: string
  if (followup === "weak") {
    focus =
      `Fix front-desk follow-up first. You're currently converting about ${leadConversion}% of leads to patients — ` +
      "the cheapest way to lower your cost per patient is to answer, text, and book faster, not to buy more clicks."
  } else if (service === "general" && patientValue < 1200) {
    focus =
      `Put your money behind one defined offer on a single focused landing page. A general "new patients welcome" homepage will drag your ` +
      `${leadConversion}% conversion down; a dedicated consultation page for one problem lifts it.`
  } else if (market === "high") {
    focus =
      'Tighten keywords before you widen them. In a competitive auction, "chiropractor for sciatica near me" beats broad "chiropractor near me" clicks — fewer, but closer to booking.'
  } else {
    focus = `Protect the ${leadConversion}% lead-to-patient rate you're assuming. Track cost per booked consultation and show rate, not just cost per click.`
  }

  const paragraphThree =
    `Before you scale past ${formatBudgetCurrency(result.budgetLow)}, confirm three things for 30–60 days: leads are qualified, ` +
    `patients trace back to the campaign, and your cost per patient stays well under ${formatBudgetCurrency(patientValue)}. ` +
    `Once those hold, step up toward ${formatBudgetCurrency(result.budgetHigh)} in increments — and revisit this planner as your real numbers replace these estimates.`

  return `${paragraphOne}\n\n${focus}\n\n${paragraphThree}`
}

export function getBudgetPlannerLabels(state: BudgetPlannerState) {
  return {
    market: marketLabels[state.market],
    service: serviceLabels[state.service],
    followup: followupLabels[state.followup],
  }
}

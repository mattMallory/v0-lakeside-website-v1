export type OfferBuilderState = {
  audience: string
  concern: string
  concernCustom: string
  firstStep: string
  happens: string[]
  takeaway: string
  action: string
  price: string
}

export const OFFER_BUILDER_AUDIENCES = [
  "Desk workers",
  "Active adults",
  "Golfers",
  "Runners",
  "New chiropractic patients",
  "Parents exploring family care",
  "People comparing local chiropractors",
] as const

export const OFFER_BUILDER_CONCERNS = [
  "Recurring back stiffness",
  "Limited mobility",
  "Discomfort while sitting",
  "Difficulty moving comfortably",
  "Returning to activity",
  "Understanding chiropractic options",
  "Finding the right local practice",
] as const

export const OFFER_BUILDER_FIRST_STEPS = [
  "15-minute discovery visit",
  "New patient fit call",
  "Mobility consultation",
  "Introductory office visit",
  "Educational assessment",
  "Complete new patient evaluation",
] as const

export const OFFER_BUILDER_HAPPENS_OPTS = [
  "Discuss your primary concerns",
  "Review relevant history",
  "Meet the chiropractor",
  "Learn about the practice's approach",
  "Complete a basic movement review",
  "Discuss evaluation options",
  "Review scheduling and payment questions",
] as const

export const OFFER_BUILDER_TAKEAWAYS = [
  "Understand whether the practice may be a good fit",
  "Learn what a complete evaluation would involve",
  "Receive a clear explanation of possible next steps",
  "Better understand the practice's approach",
  "Decide whether to schedule a full new patient visit",
] as const

export const OFFER_BUILDER_ACTIONS = ["Choose a Time", "Request a Call", "Start the Short Form"] as const

export const OFFER_BUILDER_PRICES = [
  "Complimentary",
  "$29 introductory visit",
  "$49 new patient visit",
  "No price shown",
] as const

export const defaultOfferBuilderState: OfferBuilderState = {
  audience: "",
  concern: "",
  concernCustom: "",
  firstStep: "",
  happens: [],
  takeaway: "",
  action: "",
  price: "",
}

export type OfferBuilderClarity = {
  audience: boolean
  experience: boolean
  value: boolean
  nextStep: boolean
  ready: boolean
}

export type OfferBuilderPreview = {
  eyebrow: string
  title: string
  body: string
  action: string
  price: string
  priceShown: boolean
}

export function lc(value: string): string {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value
}

export function prettyOfferLabel(value: string): string {
  return value ? value.replace(/\b[a-z]/g, (char) => char.toUpperCase()) : value
}

export function effectiveConcern(state: OfferBuilderState): string {
  return (state.concernCustom || "").trim() || state.concern
}

export function joinHappens(happens: string[]): string {
  const normalized = happens.map((item) => lc(item))
  if (normalized.length === 0) return "discuss your concerns"
  if (normalized.length === 1) return normalized[0]
  if (normalized.length === 2) return `${normalized[0]} and ${normalized[1]}`
  return `${normalized[0]}, ${normalized[1]}, and ${normalized[2]}`
}

export function computeOfferClarity(state: OfferBuilderState): OfferBuilderClarity {
  const audience = Boolean(state.audience)
  const experience = Boolean(state.firstStep) && state.happens.length >= 1
  const value = Boolean(state.takeaway)
  const nextStep = Boolean(state.action)

  return {
    audience,
    experience,
    value,
    nextStep,
    ready: audience && experience && value && nextStep,
  }
}

export function computeOfferPreview(state: OfferBuilderState): OfferBuilderPreview {
  const concern = effectiveConcern(state)
  const priceShown = Boolean(state.price) && state.price !== "No price shown"

  return {
    eyebrow: state.audience ? `For ${state.audience}` : "For your chosen audience",
    title: state.firstStep ? prettyOfferLabel(state.firstStep) : "Your first-step visit",
    body:
      `Experiencing ${concern ? concern.toLowerCase() : "a specific concern"}? Meet with a chiropractor to ` +
      `${joinHappens(state.happens)} so you can ` +
      `${state.takeaway ? lc(state.takeaway) : "understand your next step"}.`,
    action: state.action || "Choose a Time",
    price: priceShown ? state.price : "",
    priceShown,
  }
}

export function buildOfferSummary(state: OfferBuilderState): string {
  const concern = effectiveConcern(state)

  return (
    `FOR ${(state.audience || "your audience").toUpperCase()}\n` +
    `${state.firstStep ? prettyOfferLabel(state.firstStep) : "First-step visit"}\n` +
    `Concern: ${concern || "—"}\n` +
    `Visit includes: ${state.happens.join(", ") || "—"}\n` +
    `Takeaway: ${state.takeaway || "—"}\n` +
    `Next step: ${state.action || "—"}` +
    (state.price && state.price !== "No price shown" ? ` (${state.price})` : "")
  )
}

export function applyOfferBuilderSelect(
  state: OfferBuilderState,
  field: string,
  value: string,
): OfferBuilderState {
  switch (field) {
    case "audience":
      return { ...state, audience: value }
    case "firstStep":
      return { ...state, firstStep: value }
    case "concern":
      return { ...state, concern: value, concernCustom: "" }
    case "concernCustom":
      return { ...state, concernCustom: value, concern: "" }
    case "happen": {
      const has = state.happens.includes(value)
      if (has) {
        return { ...state, happens: state.happens.filter((item) => item !== value) }
      }
      if (state.happens.length >= 3) return state
      return { ...state, happens: [...state.happens, value] }
    }
    case "takeaway":
      return { ...state, takeaway: value }
    case "action":
      return { ...state, action: value }
    case "price":
      return { ...state, price: state.price === value ? "" : value }
    default:
      return state
  }
}

export function offerBuilderStateKey(state: OfferBuilderState): string {
  return [
    state.audience,
    state.concern,
    state.concernCustom,
    state.firstStep,
    state.happens.join("|"),
    state.takeaway,
    state.action,
    state.price,
  ].join("::")
}

import {
  buildOfferSummary,
  computeOfferPreview,
  type OfferBuilderState,
} from "@/lib/offer-builder"
import { buildGhlFormUrl } from "@/lib/ghl-form"

/**
 * Go High Level setup — offer builder embed flow (default)
 * ================================================
 *
 * 1. ENV (Lakeside site)
 *    NEXT_PUBLIC_OFFER_BUILDER_SUBMIT_MODE=embed
 *    NEXT_PUBLIC_GHL_OFFER_BUILDER_FORM_URL=https://api.leadconnectorhq.com/widget/form/xxx
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
 *      (avoids "unfinished submission" prompts when the iframe reloads)
 *
 * 4. TEST
 *    - Open /blog/best-chiropractic-advertising-offers
 *    - Complete the offer builder — hidden fields pre-fill in the embedded form
 *
 * For full-page redirect instead, set NEXT_PUBLIC_OFFER_BUILDER_SUBMIT_MODE=redirect
 */
export const GHL_OFFER_BUILDER_FIELD_KEYS = {
  email: "email",
  audience: "offer_audience",
  concern: "offer_concern",
  firstStep: "offer_first_step",
  visitIncludes: "offer_visit_includes",
  takeaway: "offer_takeaway",
  action: "offer_action",
  price: "offer_price",
  previewEyebrow: "offer_preview_eyebrow",
  previewTitle: "offer_preview_title",
  previewBody: "offer_preview_body",
  offerSummary: "offer_summary",
  builderSource: "builder_source",
  builderPageUrl: "builder_page_url",
} as const

export type OfferBuilderGhlPayload = {
  /** Omit when the GHL form collects email directly in the embed. */
  email?: string
  state: OfferBuilderState
  pageUrl?: string
}

export function buildOfferBuilderFieldValues(payload: OfferBuilderGhlPayload): Record<string, string> {
  const preview = computeOfferPreview(payload.state)
  const concern = (payload.state.concernCustom || "").trim() || payload.state.concern

  return {
    [GHL_OFFER_BUILDER_FIELD_KEYS.audience]: payload.state.audience,
    [GHL_OFFER_BUILDER_FIELD_KEYS.concern]: concern,
    [GHL_OFFER_BUILDER_FIELD_KEYS.firstStep]: payload.state.firstStep,
    [GHL_OFFER_BUILDER_FIELD_KEYS.visitIncludes]: payload.state.happens.join("; "),
    [GHL_OFFER_BUILDER_FIELD_KEYS.takeaway]: payload.state.takeaway,
    [GHL_OFFER_BUILDER_FIELD_KEYS.action]: payload.state.action,
    [GHL_OFFER_BUILDER_FIELD_KEYS.price]: payload.state.price,
    [GHL_OFFER_BUILDER_FIELD_KEYS.previewEyebrow]: preview.eyebrow,
    [GHL_OFFER_BUILDER_FIELD_KEYS.previewTitle]: preview.title,
    [GHL_OFFER_BUILDER_FIELD_KEYS.previewBody]: preview.body,
    [GHL_OFFER_BUILDER_FIELD_KEYS.offerSummary]: buildOfferSummary(payload.state),
    [GHL_OFFER_BUILDER_FIELD_KEYS.builderSource]: "offer-builder",
    [GHL_OFFER_BUILDER_FIELD_KEYS.builderPageUrl]: payload.pageUrl ?? "",
  }
}

export function buildOfferBuilderGhlUrl(formBaseUrl: string, payload: OfferBuilderGhlPayload): string {
  const fields = buildOfferBuilderFieldValues(payload)
  const email = payload.email?.trim()
  if (email) {
    fields[GHL_OFFER_BUILDER_FIELD_KEYS.email] = email
  }
  return buildGhlFormUrl(formBaseUrl, fields)
}

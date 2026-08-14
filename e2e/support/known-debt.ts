/**
 * Pre-existing defects this suite detects but does not fail on.
 *
 * Every entry was **measured** by the suite on the branch that introduced it, not
 * copied from a report. Each names the audit finding it belongs to, or NEW where
 * the suite found something the audit did not.
 *
 * This is a ledger, not a tolerance. The rules that keep it honest:
 *
 *   - Entries are specific selectors. Never a wildcard, never a raised threshold.
 *   - e2e/harness-self-check.spec.ts proves each assertion still fires, so a green
 *     suite means the assertions work and these are the known exceptions.
 *   - Fixing a control means deleting its entry. An entry for a fixed control is
 *     not an error, but the ledger stops being an accurate account of the debt.
 *
 * None of these were introduced by the breakpoint-canon work; the layout-snapshot
 * diff for that change touched only the offer builder at 768/810/820px.
 */
export type DebtEntry = {
  /** Route the control appears on, or "*" for site-wide chrome. */
  route: string
  /** Substring matched against the selector the assertion generates. */
  match: string
  /** Audit finding identifier, or NEW. */
  finding: string
  note: string
}

/**
 * Controls below the 44px minimum. Sizes are as measured at the widths where the
 * control is visible.
 */
export const TOUCH_TARGET_DEBT: DebtEntry[] = [
  // --- Site-wide chrome (footer and header) ---
  {
    route: "*",
    match: "a.flex.items-center",
    finding: "MOB-04",
    note: "Footer navigation links, 34px tall.",
  },
  {
    route: "*",
    match: "a.flex.shrink-0.items-center",
    finding: "MOB-04",
    note: "Footer brand link, 152x34px.",
  },
  {
    route: "*",
    match: "a.font-brand-display.rounded-[7px].px-[11px]",
    finding: "MOB-04",
    note: "Footer pill links, 38px tall.",
  },
  {
    route: "*",
    match: "a.text-sm.text-slate-500.hover:text-white",
    finding: "MOB-04",
    note: "Footer legal links, 40x20px.",
  },
  {
    route: "*",
    match: "a.group/button.inline-flex.shrink-0",
    finding: "MOB-04",
    note: "Header CTA button, 204x42px — 2px short.",
  },
  {
    route: "/",
    match: "a.font-brand-display.text-body.font-bold",
    finding: "MOB-04",
    note: "Homepage inline section link, 141x24px. Was 124x20px as text-sm; it grew with the body-text step to 16px and is still short of 44px.",
  },
  {
    route: "/",
    match: "a.mt-3.5.inline-block.font-brand-display",
    finding: "MOB-04",
    note: "Homepage card link, 73x23px.",
  },

  // --- Blog index (MOB-04) ---
  {
    route: "/blog",
    match: "button.font-brand-display.flex.w-full",
    finding: "MOB-04",
    note: "Sidebar category filters, 36px tall.",
  },
  {
    route: "/blog",
    match: "button.rounded-[8px].p-2.transition-colors",
    finding: "MOB-04",
    note: "Grid/list view toggles, 32x32px.",
  },
  {
    route: "/blog",
    match: "input.w-full.rounded-full.border",
    finding: "MOB-04",
    note: "Article search input, 42px tall.",
  },
  {
    route: "/blog",
    match: "select.appearance-none.rounded-[10px].border",
    finding: "MOB-04",
    note: "Sort select, 98x38px.",
  },
  // These two only render once the blog has posts and tags to show. The local database
  // had neither until the schema work landed, so the suite could not see them before —
  // the CSS is unchanged and predates that work. Measured on this branch at every width.
  {
    route: "/blog",
    match: "button.font-brand-display.min-w-10.rounded-[10px]",
    finding: "MOB-04",
    note: "Pagination buttons in components/blog-roll.tsx, 40x36px and 44x38px. Only render with enough posts to paginate.",
  },
  {
    route: "/blog",
    match: "button.rounded-full.px-3.py-1.5",
    finding: "MOB-04",
    note: "Tag filter pills in components/blog-sidebar.tsx, 28px tall (47-106px wide). Only render when tags exist.",
  },

  // --- Budget planner ---
  {
    route: "/tools/google-ads-budget-planner",
    match: "input#bp-lead-conversion",
    finding: "MOB-02",
    note: "Range slider, 6px tall. The primary input of the lead-gen tool.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "input#bp-patient-value",
    finding: "MOB-02",
    note: "Range slider, 6px tall. The primary input of the lead-gen tool.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "label.budget-planner-pill-label",
    finding: "MOB-04",
    note: "Pill labels measured 42px, not the 43px computed from class strings.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "label.font-brand-display.text-body.font-bold",
    finding: "NEW",
    note: "Slider field labels, 24px tall. Not recorded in the audit. Was 26px as text-[15px]; the body-text step took the font to 16px and the leading to a paired 1.5, which is a net 2px shorter.",
  },

  // --- Offer builder ---
  {
    route: "/e2e-fixtures/offer-builder",
    match: "label.offer-builder-chip-label",
    finding: "MOB-04",
    note: "Chip labels measured 38px, not the 39px computed from class strings.",
  },
  {
    route: "/e2e-fixtures/offer-builder",
    match: "button.rounded-full.border.border-border",
    finding: "MOB-04",
    note: '"Reset offer" button, 116x42px. Matches the audit exactly.',
  },
]

/**
 * Content extending past the viewport. All of these occur only at 320px, the
 * narrowest width in the matrix, and none is recorded in the audit — the audit
 * was performed by reading source, and overflow is not visible that way.
 *
 * `overflow-x-clip` on html and body means a user sees content cut off rather
 * than a scrollbar, which is why this went unnoticed.
 */
export const OVERFLOW_DEBT: DebtEntry[] = [
  {
    route: "/",
    match: "min-w-[300px]",
    finding: "NEW",
    note: "Card with a 300px min-width overflows a 320px viewport by 5px once page gutters are applied.",
  },
  {
    route: "/about",
    match: "min-w-[300px]",
    finding: "NEW",
    note: "Same 300px min-width card as the homepage.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "budget-planner-form",
    finding: "NEW",
    note: "Form column overflows a 320px viewport by 46px.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "div.mb-3.flex.items-baseline",
    finding: "NEW",
    note: "Slider label row, carried out by the overflowing form column.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "div.mt-2.flex.justify-between",
    finding: "NEW",
    note: "Slider min/max row, carried out by the overflowing form column.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "input#bp-patient-value",
    finding: "NEW",
    note: "Range input, carried out by the overflowing form column.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "span",
    finding: "NEW",
    note: "Slider value readouts, carried out by the overflowing form column.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "div",
    finding: "NEW",
    note: "Unclassed wrappers inside the overflowing form column.",
  },
]

function matches(entries: DebtEntry[], route: string, selector: string): boolean {
  return entries.some(
    (entry) => (entry.route === "*" || entry.route === route) && selector.includes(entry.match),
  )
}

export const isKnownTouchTargetDebt = (route: string, selector: string) =>
  matches(TOUCH_TARGET_DEBT, route, selector)

export const isKnownOverflowDebt = (route: string, selector: string) =>
  matches(OVERFLOW_DEBT, route, selector)

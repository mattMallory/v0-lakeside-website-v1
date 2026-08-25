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
  /**
   * Substring matched against the offender's **stableId**, not its selector.
   *
   * stableId is class-free — an id, a test hook, an href, one of the project's
   * own semantic classes, or a structural path. Matching on the selector meant
   * every entry stopped matching the moment a utility class was renamed, and a
   * styling migration resurfaced pre-existing debt as new failures.
   */
  match: string
  /**
   * Which identity `match` is compared against.
   *
   * `stableId` is the default and the one to use: it is class-free, so it
   * survives a styling rename. `selector` is the legacy form, kept only for
   * controls that could not be re-measured because they do not render against
   * the local database — blog pagination and search need posts to exist. Those
   * should move to `stableId` the first time they are observed failing.
   */
  on?: "stableId" | "selector"
  /** Audit finding identifier, or NEW. */
  finding: string
  note: string
}

/**
 * Controls below the 44px minimum. Sizes are as measured at the widths where the
 * control is visible.
 */
export const TOUCH_TARGET_DEBT: DebtEntry[] = [
  // --- Site-wide chrome (header and footer), identified by destination ---
  {
    route: "*",
    match: "a[href=/]",
    finding: "MOB-04",
    note: "Footer brand link, 152x34px.",
  },
  {
    route: "*",
    match: "a[href=/about]",
    finding: "MOB-04",
    note: "Nav pill, 64x38px.",
  },
  {
    route: "*",
    match: "a[href=/services]",
    finding: "MOB-04",
    note: "Nav pill, 81x38px.",
  },
  {
    route: "*",
    match: "a[href=/blog]",
    finding: "MOB-04",
    note: "Nav pill, 54x38px. Also covers the homepage inline section link to the same destination, 141x24px.",
  },
  {
    route: "*",
    match: "a[href=/consultation]",
    finding: "MOB-04",
    note: "Nav pill, 78x38px. Also covers the header CTA button, 204x42px — 2px short.",
  },
  {
    route: "*",
    match: "a[href=/privacy]",
    finding: "MOB-04",
    note: "Footer legal link, 46x20px.",
  },
  {
    route: "*",
    match: "a[href=/terms]",
    finding: "MOB-04",
    note: "Footer legal link, 40x20px.",
  },
  {
    route: "/",
    match: "a[href=https://www.linkedin.com/in/pete-wisniewski]",
    finding: "MOB-04",
    note: "Team profile link, 73x23px.",
  },

  // --- Blog index (MOB-04) ---
  // These are repeated controls with no id, href or semantic class, so they fall
  // back to a structural path. Matching the shared container rather than each
  // child keeps it to one entry and survives a tag being added or removed.
  {
    route: "/blog",
    match: "aside:nth-of-type(1)>section:nth-of-type(3)>div:nth-of-type(1)>button",
    finding: "MOB-04",
    note: "Sidebar tag filter pills, 28px tall (47-106px wide). Nine of them; the match is their shared container.",
  },
  {
    route: "/blog",
    match: "div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>button",
    finding: "MOB-04",
    note: "Grid/list view toggles, 32x32px.",
  },
  {
    route: "/blog",
    match: "label:nth-of-type(1)>span:nth-of-type(1)>select:nth-of-type(1)",
    finding: "MOB-04",
    note: "Sort select, 105x42px.",
  },
  // Not re-measured: these need posts and tags in the database to render, and the
  // local database has too few. Left on the legacy selector match until they are
  // next observed failing, at which point they should move to a stable identity.
  {
    route: "/blog",
    match: "button.font-brand-display.flex.w-full",
    on: "selector",
    finding: "MOB-04",
    note: "Sidebar category filters, 36px tall.",
  },
  {
    route: "/blog",
    match: "input.w-full.rounded-full.border",
    on: "selector",
    finding: "MOB-04",
    note: "Article search input, 42px tall.",
  },
  {
    route: "/blog",
    match: "div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>button",
    finding: "MOB-04",
    note: "Pagination buttons in components/blog-roll.tsx, 42x40px and 47x42px, measured once they became visible to the suite. The match is their shared container, so adding a page does not break it. Previously matched on class names and stopped matching when the radius token was adopted — this is that entry converted.",
  },

  // --- Budget planner ---
  {
    route: "/tools/google-ads-budget-planner",
    match: "#bp-lead-conversion",
    finding: "MOB-02",
    note: "Range slider, 6px tall. The primary input of the lead-gen tool.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "#bp-patient-value",
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
    match: "div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>label:nth-of-type(1)",
    finding: "NEW",
    note: "Slider field label, 224x24px. Not recorded in the audit.",
  },
  {
    route: "/tools/google-ads-budget-planner",
    match: "div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(5)>div:nth-of-type(1)>label:nth-of-type(1)",
    finding: "NEW",
    note: "Slider field label, 332x24px. Not recorded in the audit.",
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
    on: "selector",
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
  // The same 300px-min-width card on two pages: at a 320px viewport it is wider
  // than the space left after the page gutters. Identified structurally, so a
  // styling rename cannot make these stop matching.
  {
    route: "/",
    match: "main:nth-of-type(1)>div:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)",
    finding: "NEW",
    note: "Card with a 300px min-width overflows a 320px viewport by 5px once page gutters are applied.",
  },
  {
    route: "/",
    match: "main:nth-of-type(1)>div:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)",
    finding: "NEW",
    note: "Its sibling card, same 300px min-width, same 5px overflow.",
  },
  {
    route: "/about",
    match: "main:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)",
    finding: "NEW",
    note: "Same 300px min-width card as the homepage.",
  },
  {
    route: "/about",
    match: "main:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)",
    finding: "NEW",
    note: "Its sibling card, same 300px min-width, same 5px overflow.",
  },
  // The budget planner's six entries were deleted rather than converted. Emptying
  // this ledger and re-running showed all 14 of its overflow assertions passing at
  // every width: the form column no longer overflows, so the entries described
  // something that no longer happens. Two of them — a bare "span" and a bare "div"
  // — were also broad enough to permit any overflow on that route, which is
  // exactly what this ledger must not do.

]

function matches(
  entries: DebtEntry[],
  route: string,
  ids: { stableId: string; selector: string },
): boolean {
  return entries.some((entry) => {
    if (entry.route !== "*" && entry.route !== route) return false
    const against = entry.on === "selector" ? ids.selector : ids.stableId
    return against.includes(entry.match)
  })
}

export const isKnownTouchTargetDebt = (
  route: string,
  ids: { stableId: string; selector: string },
) => matches(TOUCH_TARGET_DEBT, route, ids)

export const isKnownOverflowDebt = (route: string, ids: { stableId: string; selector: string }) =>
  matches(OVERFLOW_DEBT, route, ids)

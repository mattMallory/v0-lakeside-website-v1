import type { Page } from "@playwright/test"

/** Minimum touch target, per WCAG 2.5.5 / the Apple and Material guidelines. */
export const MIN_TOUCH_TARGET_PX = 44

export type Offender = {
  selector: string
  detail: string
}

export type LeadCaptureGroup = {
  group: string
  total: number
  visible: number
}

/**
 * Builds a short, human-readable selector for an element so a failure message
 * points at something findable in the source.
 */
const SELECTOR_FN = `
function describe(el) {
  const id = el.id ? "#" + el.id : ""
  const cls = typeof el.className === "string" && el.className
    ? "." + el.className.trim().split(/\\s+/).slice(0, 3).join(".")
    : ""
  const data = el.getAttribute("data-lead-capture")
    ? "[data-lead-capture=" + el.getAttribute("data-lead-capture") + "]"
    : ""
  return el.tagName.toLowerCase() + id + cls + data
}
`

/**
 * Lead capture must be reachable at every width.
 *
 * Elements are grouped by their `data-lead-capture` value. A responsive pair
 * deliberately hides one of its two members, so the invariant is not "nothing is
 * hidden" — it is that **at least one member of each group is visible**. That is
 * the property the 768–820px dead zone violated: both members resolved to
 * `display: none`, so the Go High Level form was reachable at neither.
 */
export async function leadCaptureGroups(page: Page): Promise<LeadCaptureGroup[]> {
  return page.evaluate(() => {
    const groups = new Map<string, { total: number; visible: number }>()

    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-lead-capture]"))) {
      const name = el.getAttribute("data-lead-capture") || "unnamed"
      const entry = groups.get(name) || { total: 0, visible: 0 }
      entry.total += 1

      // offsetParent is null for display:none subtrees; the rect check also
      // catches zero-sized and clipped-away elements.
      const rect = el.getBoundingClientRect()
      const style = window.getComputedStyle(el)
      const shown =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0

      if (shown) entry.visible += 1
      groups.set(name, entry)
    }

    return [...groups.entries()].map(([group, v]) => ({ group, ...v }))
  })
}

/**
 * Finds elements extending past the viewport horizontally.
 *
 * `document.documentElement.scrollWidth` is useless here: the root layout sets
 * `overflow-x-clip` on both `html` and `body` (app/(frontend)/layout.tsx), and a
 * clipped box reports its clamped padding box, so scrollWidth equals the viewport
 * width even when content genuinely overflows. This walks element rects instead,
 * which the clip cannot mask. e2e/harness-self-check.spec.ts proves both halves of
 * that claim against a deliberately overflowing element.
 */
export async function horizontalOverflow(page: Page, tolerance = 1): Promise<Offender[]> {
  return page.evaluate(
    ({ tolerance, describeSrc }) => {
      const describe = new Function("el", `${describeSrc}; return describe(el)`) as (
        el: Element,
      ) => string

      const viewportWidth = document.documentElement.clientWidth
      const offenders: { selector: string; detail: string }[] = []

      for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
        const style = window.getComputedStyle(el)
        if (style.display === "none" || style.visibility === "hidden") continue

        // Off-canvas drawers and decorative layers are positioned outside the
        // viewport on purpose and are not overflow.
        if (style.position === "fixed") continue
        if (el.closest("[aria-hidden='true']")) continue

        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue

        if (rect.right > viewportWidth + tolerance || rect.left < -tolerance) {
          offenders.push({
            selector: describe(el),
            detail: `left=${Math.round(rect.left)} right=${Math.round(
              rect.right,
            )} viewport=${viewportWidth}`,
          })
        }
      }

      // Nested offenders repeat the same root cause; the outermost few are enough.
      return offenders.slice(0, 8)
    },
    { tolerance, describeSrc: SELECTOR_FN },
  )
}

/**
 * Finds interactive controls smaller than the 44px minimum on either axis.
 *
 * Inline controls are excluded: WCAG 2.5.8 exempts targets in a sentence or block
 * of text, and inline links in prose cannot meet 44px without breaking line
 * height. Only controls that establish their own box are measured.
 */
export async function smallTouchTargets(page: Page, minimum = MIN_TOUCH_TARGET_PX): Promise<Offender[]> {
  return page.evaluate(
    ({ minimum, describeSrc }) => {
      const describe = new Function("el", `${describeSrc}; return describe(el)`) as (
        el: Element,
      ) => string

      const CONTROLS = "a[href], button, input, select, textarea, [role='button'], label[for], summary"
      const offenders: { selector: string; detail: string }[] = []

      for (const el of Array.from(document.querySelectorAll<HTMLElement>(CONTROLS))) {
        const style = window.getComputedStyle(el)
        if (style.display === "none" || style.visibility === "hidden") continue
        if (style.display === "inline") continue
        if (el.closest("[aria-hidden='true']")) continue

        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue

        // Visually-hidden native inputs paired with a styled label — `sr-only`
        // radios and the offer builder's `.offer-builder-native-input`. They are
        // accessibility proxies, never touched directly; the <label> is the real
        // target and is measured on its own.
        const visuallyHidden =
          style.position === "absolute" &&
          (style.opacity === "0" ||
            style.clipPath !== "none" ||
            rect.width <= 1 ||
            rect.height <= 1)
        if (visuallyHidden) continue

        if (rect.width + 0.5 < minimum || rect.height + 0.5 < minimum) {
          offenders.push({
            selector: describe(el),
            detail: `${Math.round(rect.width)}x${Math.round(rect.height)}px`,
          })
        }
      }

      return offenders
    },
    { minimum, describeSrc: SELECTOR_FN },
  )
}

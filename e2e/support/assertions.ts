import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import type { Page } from "@playwright/test"

/** Minimum touch target, per WCAG 2.5.5 / the Apple and Material guidelines. */
export const MIN_TOUCH_TARGET_PX = 44

export type Offender = {
  /** Human-readable, carries utility classes. For failure messages only. */
  selector: string
  /**
   * Class-free identity, used to match against the known-debt ledger.
   *
   * `selector` cannot be used for that: it is built from utility classes, so a
   * styling rename makes every ledger entry stop matching and a batch of
   * pre-existing debt resurfaces as new failures. That happened once, for 27
   * tests, during the body-copy migration. This is the same defect the layout
   * differ had, fixed the same way — identify the element by something the
   * styling cannot change.
   */
  stableId: string
  detail: string
}

/**
 * Class names the project's own stylesheet defines, read from source rather
 * than guessed. These are semantic (`budget-planner-pill-label`), not utility
 * classes, so they survive a styling migration and make a useful identity.
 */
const PROJECT_CLASSES: string[] = (() => {
  const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8")
  return [...new Set([...css.matchAll(/^\s*\.([a-zA-Z][\w-]*)/gm)].map((m) => m[1]))]
})()

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
 * Builds the class-free identity described on `Offender.stableId`.
 *
 * Preference order, most durable first: an id, a test hook, an href, the
 * project's own semantic classes, and finally a structural DOM path. Every one
 * of those survives a utility-class rename. None of them is a wildcard — each
 * addresses one element.
 *
 * The structural path is the weakest of them, because moving an element in the
 * markup changes it. That is deliberate: a control that moved is worth
 * re-confirming, whereas a control that was merely restyled is not.
 */
const STABLE_ID_FN = `
function stableId(el, projectClasses) {
  if (el.id) return "#" + el.id
  for (const attr of ["data-lead-capture", "data-ob", "data-testid"]) {
    const v = el.getAttribute(attr)
    if (v !== null) return "[" + attr + "=" + v + "]"
  }
  const tag = el.tagName.toLowerCase()
  const href = el.getAttribute("href")
  if (href) return tag + "[href=" + href + "]"
  // Typographic project classes are excluded: they describe type, not a
  // component, and are applied across dozens of unrelated elements. Using one
  // as an identity would match a family rather than a control, which is the
  // wildcard this ledger must not become.
  const TOO_BROAD = ["font-brand-display", "prose-blog"]
  const own = typeof el.className === "string" && el.className
    ? el.className
        .trim()
        .split(/\\s+/)
        .filter((c) => projectClasses.indexOf(c) !== -1 && TOO_BROAD.indexOf(c) === -1)
    : []
  if (own.length) return tag + "." + own.slice(0, 2).join(".")
  let node = el
  const parts = []
  while (node && node.tagName && node.tagName.toLowerCase() !== "body") {
    const t = node.tagName.toLowerCase()
    let i = 1
    let sib = node.previousElementSibling
    while (sib) {
      if (sib.tagName === node.tagName) i++
      sib = sib.previousElementSibling
    }
    parts.unshift(t + ":nth-of-type(" + i + ")")
    node = node.parentElement
  }
  return "body>" + parts.join(">")
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
    ({ tolerance, describeSrc, stableIdSrc, projectClasses }) => {
      const describe = new Function("el", `${describeSrc}; return describe(el)`) as (
        el: Element,
      ) => string
      const identify = new Function(
        "el",
        "projectClasses",
        `${stableIdSrc}; return stableId(el, projectClasses)`,
      ) as (el: Element, projectClasses: string[]) => string

      const viewportWidth = document.documentElement.clientWidth
      const offenders: { selector: string; stableId: string; detail: string }[] = []

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
            stableId: identify(el, projectClasses),
            detail: `left=${Math.round(rect.left)} right=${Math.round(
              rect.right,
            )} viewport=${viewportWidth}`,
          })
        }
      }

      // Nested offenders repeat the same root cause; the outermost few are enough.
      return offenders.slice(0, 8)
    },
    { tolerance, describeSrc: SELECTOR_FN, stableIdSrc: STABLE_ID_FN, projectClasses: PROJECT_CLASSES },
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
    ({ minimum, describeSrc, stableIdSrc, projectClasses }) => {
      const describe = new Function("el", `${describeSrc}; return describe(el)`) as (
        el: Element,
      ) => string
      const identify = new Function(
        "el",
        "projectClasses",
        `${stableIdSrc}; return stableId(el, projectClasses)`,
      ) as (el: Element, projectClasses: string[]) => string

      const CONTROLS = "a[href], button, input, select, textarea, [role='button'], label[for], summary"
      const offenders: { selector: string; stableId: string; detail: string }[] = []

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
            stableId: identify(el, projectClasses),
            detail: `${Math.round(rect.width)}x${Math.round(rect.height)}px`,
          })
        }
      }

      return offenders
    },
    { minimum, describeSrc: SELECTOR_FN, stableIdSrc: STABLE_ID_FN, projectClasses: PROJECT_CLASSES },
  )
}

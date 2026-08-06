import { expect, test } from "@playwright/test"

import { horizontalOverflow, leadCaptureGroups, smallTouchTargets } from "./support/assertions"
import { VIEWPORT_MATRIX } from "./support/breakpoints"
import { ACTIVE_ROUTES } from "./support/routes"
import { isKnownOverflowDebt, isKnownTouchTargetDebt } from "./support/known-debt"

/**
 * The viewport sweep: every route in the registry, at every width in the matrix.
 *
 * Adding a route to e2e/support/routes.ts extends all three assertions to it
 * automatically. Adding a width to the matrix extends them to every route.
 */
for (const route of ACTIVE_ROUTES) {
  test.describe(`${route.name} (${route.path})`, () => {
    for (const viewport of VIEWPORT_MATRIX) {
      test.describe(viewport.label, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          const response = await page.goto(route.path)
          expect(response?.status(), `${route.path} did not return 200`).toBe(200)
        })

        test("keeps lead capture reachable", async ({ page }) => {
          const groups = await leadCaptureGroups(page)

          for (const group of groups) {
            expect(
              group.visible,
              `"${group.group}" has ${group.total} lead-capture panel(s) on ${route.path} ` +
                `and none are visible at ${viewport.width}px.`,
            ).toBeGreaterThan(0)

            expect(
              group.visible,
              `"${group.group}" shows ${group.visible} panels at ${viewport.width}px; ` +
                `exactly one should be visible or the form is duplicated.`,
            ).toBe(1)
          }
        })

        test("does not overflow horizontally", async ({ page }) => {
          const all = await horizontalOverflow(page)
          const offenders = all.filter((o) => !isKnownOverflowDebt(route.path, o.selector))

          expect(
            offenders,
            `Content extends past ${viewport.width}px on ${route.path}. The root layout's ` +
              `overflow-x-clip hides this from the user as a scrollbar, but the content is ` +
              `still cut off:\n` +
              offenders.map((o) => `  ${o.selector} — ${o.detail}`).join("\n"),
          ).toEqual([])
        })

        test("meets the 44px touch target minimum", async ({ page }) => {
          const offenders = await smallTouchTargets(page)
          const unexpected = offenders.filter((o) => !isKnownTouchTargetDebt(route.path, o.selector))

          expect(
            unexpected,
            `Controls below 44px on ${route.path} at ${viewport.width}px:\n` +
              unexpected.map((o) => `  ${o.selector} — ${o.detail}`).join("\n") +
              `\n\nIf these are pre-existing, record them in e2e/support/touch-target-debt.ts ` +
              `with the audit finding they belong to. Do not widen the tolerance.`,
          ).toEqual([])
        })
      })
    }
  })
}

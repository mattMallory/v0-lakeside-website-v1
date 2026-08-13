import { expect, test } from "@playwright/test"

import { leadCaptureGroups } from "./support/assertions"
import { OFFER_BUILDER_FIXTURE } from "./support/routes"

/**
 * Regression test for the 768–820px lead-capture dead zone.
 *
 * Before the fix, three rules disagreed about where "medium" starts:
 *
 *   - the desktop side panel appeared at `md:flex`            → visible ≥768px
 *   - a hand-written `@media (max-width: 820px)` block hid it → hidden ≤820px, !important
 *   - the mobile panel was `md:hidden`                        → hidden ≥768px
 *
 * In the 53px band where all three hold, both copies of the Go High Level form
 * resolved to `display: none`. A prospect finished the offer builder and was shown
 * nothing to submit — no error, nothing logged. iPad Mini portrait is exactly 768px.
 *
 * These widths span the whole band and both of its edges.
 */
const DEAD_ZONE_WIDTHS = [768, 780, 800, 820] as const

/** Widths either side of the band, which were never broken and must stay working. */
const SURROUNDING_WIDTHS = [767, 821, 1023, 1024] as const

/**
 * Loads the fixture and proves the component actually rendered before measuring.
 * Without this, a 404 or a build that dropped the fixture would surface as
 * "no panels found", which reads identically to the defect being tested.
 */
async function openOfferBuilder(page: import("@playwright/test").Page, width: number) {
  await page.setViewportSize({ width, height: 900 })
  const response = await page.goto(OFFER_BUILDER_FIXTURE)

  expect(
    response?.status(),
    `${OFFER_BUILDER_FIXTURE} did not load. The fixture route only exists when ` +
      `E2E_FIXTURES=1 is set for both the build and the server.`,
  ).toBe(200)

  await expect(
    page.locator(".offer-builder-layout"),
    "the offer builder did not render on the fixture page",
  ).toBeAttached()
}

async function visibleLeadCapturePanels(page: import("@playwright/test").Page) {
  const groups = await leadCaptureGroups(page)
  const offerBuilder = groups.find((group) => group.group === "offer-builder")
  expect(
    offerBuilder,
    "expected the offer builder to declare data-lead-capture panels",
  ).toBeTruthy()
  return offerBuilder!
}

test.describe("offer builder lead capture", () => {
  for (const width of DEAD_ZONE_WIDTHS) {
    test(`is reachable at ${width}px (dead zone)`, async ({ page }) => {
      await openOfferBuilder(page, width)

      const group = await visibleLeadCapturePanels(page)

      expect(
        group.visible,
        `At ${width}px none of the ${group.total} offer-builder lead-capture panels ` +
          `are visible, so the Go High Level form cannot be reached.`,
      ).toBeGreaterThan(0)
    })
  }

  for (const width of SURROUNDING_WIDTHS) {
    test(`is reachable at ${width}px`, async ({ page }) => {
      await openOfferBuilder(page, width)

      const group = await visibleLeadCapturePanels(page)

      expect(group.visible).toBeGreaterThan(0)
    })
  }

  test("shows exactly one lead-capture panel at every tested width", async ({ page }) => {
    for (const width of [...SURROUNDING_WIDTHS, ...DEAD_ZONE_WIDTHS]) {
      await openOfferBuilder(page, width)

      const group = await visibleLeadCapturePanels(page)

      // Two visible copies would mean the form is rendered twice on one screen,
      // which duplicates the embedded iframe and the submitted lead.
      expect(group.visible, `${group.visible} panels visible at ${width}px`).toBe(1)
    }
  })
})

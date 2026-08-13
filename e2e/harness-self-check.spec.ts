import { expect, test } from "@playwright/test"

import { horizontalOverflow, leadCaptureGroups, smallTouchTargets } from "./support/assertions"

/**
 * Tests for the test harness.
 *
 * An assertion that has never fired is not evidence of anything. Each check here
 * introduces a known-bad element and confirms the corresponding assertion catches
 * it, so a green suite means "nothing is broken" rather than "nothing is looking".
 */
test.describe("harness self-check", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await page.goto("/")
  })

  test("scrollWidth cannot see overflow, which is why the assertion does not use it", async ({
    page,
  }) => {
    // The root layout sets `overflow-x-clip` on html and body. This documents the
    // consequence: the obvious measurement is blind here.
    const clipped = await page.evaluate(() => {
      const html = window.getComputedStyle(document.documentElement).overflowX
      const body = window.getComputedStyle(document.body).overflowX
      return { html, body }
    })
    expect(clipped.html).toBe("clip")
    expect(clipped.body).toBe("clip")

    const reported = await page.evaluate(() => {
      const probe = document.createElement("div")
      probe.id = "overflow-probe"
      probe.style.cssText = "width:200vw;height:20px;background:red"
      document.body.appendChild(probe)

      const root = document.documentElement
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
      }
    })

    // The proof: a 200vw element is present, yet scrollWidth reports no overflow.
    expect(
      reported.scrollWidth,
      "if this ever exceeds clientWidth the clip is gone and scrollWidth became usable",
    ).toBeLessThanOrEqual(reported.clientWidth)
  })

  test("the overflow assertion catches an element scrollWidth misses", async ({ page }) => {
    const before = await horizontalOverflow(page)
    expect(before, `page had pre-existing overflow: ${JSON.stringify(before)}`).toEqual([])

    await page.evaluate(() => {
      const probe = document.createElement("div")
      probe.id = "overflow-probe"
      probe.style.cssText = "width:200vw;height:20px;background:red"
      document.body.appendChild(probe)
    })

    const after = await horizontalOverflow(page)
    expect(after.length, "the deliberately overflowing element was not detected").toBeGreaterThan(0)
    expect(after.some((o) => o.selector.includes("overflow-probe"))).toBe(true)
  })

  test("the touch-target assertion catches an undersized control", async ({ page }) => {
    await page.evaluate(() => {
      const probe = document.createElement("button")
      probe.id = "tiny-probe"
      probe.style.cssText = "display:block;width:10px;height:10px"
      document.body.appendChild(probe)
    })

    const offenders = await smallTouchTargets(page)
    expect(offenders.some((o) => o.selector.includes("tiny-probe"))).toBe(true)
  })

  test("the lead-capture assertion counts a hidden panel as not visible", async ({ page }) => {
    await page.evaluate(() => {
      const shown = document.createElement("div")
      shown.setAttribute("data-lead-capture", "probe")
      shown.style.cssText = "display:block;width:100px;height:100px"

      const hidden = document.createElement("div")
      hidden.setAttribute("data-lead-capture", "probe")
      hidden.style.cssText = "display:none"

      document.body.append(shown, hidden)
    })

    const groups = await leadCaptureGroups(page)
    const probe = groups.find((group) => group.group === "probe")

    expect(probe).toEqual({ group: "probe", total: 2, visible: 1 })
  })
})

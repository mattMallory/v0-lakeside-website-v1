import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { test } from "@playwright/test"

import { VIEWPORT_MATRIX } from "../support/breakpoints"
import { ACTIVE_ROUTES } from "../support/routes"

/**
 * Records the rendered geometry of every route at every width so a change can be
 * diffed against the state before it.
 *
 * This is a measuring instrument, not an assertion, so it is skipped unless
 * LAYOUT_SNAPSHOT=1. Usage:
 *
 *   LAYOUT_SNAPSHOT=1 SNAPSHOT_OUT=.layout/before.json pnpm test:e2e layout-snapshot
 *   # ...make the change...
 *   LAYOUT_SNAPSHOT=1 SNAPSHOT_OUT=.layout/after.json pnpm test:e2e layout-snapshot
 *   node e2e/tools/diff-layout.mjs .layout/before.json .layout/after.json
 *
 * It exists because "visual output must not change" is a claim that needs
 * evidence, and reasoning about a CSS cascade is not evidence.
 */
const ENABLED = process.env.LAYOUT_SNAPSHOT === "1"
const OUT = process.env.SNAPSHOT_OUT ?? ".layout/snapshot.json"

type ElementBox = {
  /**
   * Class-free structural address, e.g. `body:nth-of-type(1)>main:nth-of-type(1)`.
   *
   * This is the identity the diff compares on. `selector` cannot be: it is built
   * from class names, so migrating a class to a token renames it and the element
   * reads as one deletion plus one addition. A batch that renamed classes without
   * moving anything reported 196 changes that way, and a real regression hiding
   * inside 196 false positives is a regression nobody reads.
   */
  path: string
  /** Kept for human-readable output — it names the classes a reader can search for. */
  selector: string
  display: string
  position: string
  x: number
  y: number
  width: number
  height: number
}

test.describe("layout snapshot", () => {
  test.skip(!ENABLED, "set LAYOUT_SNAPSHOT=1 to record a snapshot")
  test.describe.configure({ mode: "serial" })

  test("record every route at every width", async ({ page }) => {
    test.setTimeout(300_000)
    const snapshot: Record<string, ElementBox[]> = {}

    for (const route of ACTIVE_ROUTES) {
      for (const viewport of VIEWPORT_MATRIX) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto(route.path)
        await page.waitForLoadState("domcontentloaded")

        const boxes = await page.evaluate(() => {
          const results: ElementBox[] = []
          // Every element carrying a layout-bearing class or a test hook. Text
          // nodes and leaf spans are excluded: they move as a consequence of
          // layout, and including them makes the diff unreadable.
          const SELECTOR = [
            "[data-lead-capture]",
            "[class*='offer-builder-']",
            "[class*='budget-planner-']",
            "header",
            "main",
            "footer",
            "section",
          ].join(", ")

          // Structural address built only from tag names and sibling position, so
          // it is unaffected by any class change.
          const domPath = (el: HTMLElement): string => {
            const parts: string[] = []
            let node: HTMLElement | null = el
            while (node && node !== document.documentElement) {
              const parent: HTMLElement | null = node.parentElement
              if (!parent) break
              const sameTag = Array.from(parent.children).filter(
                (child) => child.tagName === node!.tagName,
              )
              parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${sameTag.indexOf(node) + 1})`)
              node = parent
            }
            return parts.join(">")
          }

          for (const el of Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))) {
            const style = window.getComputedStyle(el)
            const rect = el.getBoundingClientRect()
            const cls =
              typeof el.className === "string" && el.className
                ? el.className.trim().split(/\s+/).slice(0, 4).join(".")
                : ""
            results.push({
              path: domPath(el),
              selector: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`,
              display: style.display,
              position: style.position,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            })
          }
          return results
        })

        snapshot[`${route.path} @ ${viewport.width}`] = boxes
      }
    }

    const target = resolve(process.cwd(), OUT)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, JSON.stringify(snapshot, null, 2))
    console.log(`layout snapshot written to ${target}`)
  })
})

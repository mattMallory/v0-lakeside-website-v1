#!/usr/bin/env node
/**
 * Diffs two layout snapshots recorded by e2e/tools/layout-snapshot.spec.ts.
 *
 * Prints one line per element whose box or computed display changed, grouped by
 * route and width. Exit code is 0 either way — this reports, it does not gate.
 *
 *   node e2e/tools/diff-layout.mjs .layout/before.json .layout/after.json
 */
import { readFileSync } from "node:fs"

const [beforePath, afterPath] = process.argv.slice(2)
if (!beforePath || !afterPath) {
  console.error("usage: diff-layout.mjs <before.json> <after.json>")
  process.exit(2)
}

const before = JSON.parse(readFileSync(beforePath, "utf8"))
const after = JSON.parse(readFileSync(afterPath, "utf8"))

const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
let changedGroups = 0
let changedElements = 0

for (const key of keys) {
  const a = before[key] ?? []
  const b = after[key] ?? []
  const index = (list) => {
    const map = new Map()
    for (const item of list) {
      const bucket = map.get(item.selector) ?? []
      bucket.push(item)
      map.set(item.selector, bucket)
    }
    return map
  }
  const ai = index(a)
  const bi = index(b)
  const selectors = [...new Set([...ai.keys(), ...bi.keys()])].sort()

  const lines = []
  for (const selector of selectors) {
    const av = ai.get(selector) ?? []
    const bv = bi.get(selector) ?? []
    const n = Math.max(av.length, bv.length)
    for (let i = 0; i < n; i++) {
      const x = av[i]
      const y = bv[i]
      const fmt = (v) =>
        v ? `${v.display} ${v.width}x${v.height} @${v.x},${v.y}` : "(absent)"
      if (fmt(x) !== fmt(y)) {
        lines.push(`    ${selector}\n      before: ${fmt(x)}\n      after:  ${fmt(y)}`)
      }
    }
  }

  if (lines.length) {
    changedGroups += 1
    changedElements += lines.length
    console.log(`\n${key}`)
    console.log(lines.join("\n"))
  }
}

console.log(
  `\n${changedElements} element(s) changed across ${changedGroups} route/width combination(s).`,
)
if (changedElements === 0) console.log("Rendered geometry is identical.")

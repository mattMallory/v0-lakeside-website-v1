#!/usr/bin/env node
/**
 * Diffs two layout snapshots recorded by e2e/tools/layout-snapshot.spec.ts.
 *
 *   node e2e/tools/diff-layout.mjs .layout/before.json .layout/after.json
 *
 * Elements are matched on `path` — a class-free structural address. They used to
 * be matched on `selector`, which is built from class names, so renaming a class
 * made every element read as one deletion plus one addition. Migrating classes to
 * tokens is *precisely* a rename, and one batch reported 196 changed elements
 * where comparing by position showed 0.
 *
 * The danger was never the noise. It is that a real regression hides inside 196
 * false positives and the reviewer stops reading. So a rename with unchanged
 * geometry is now reported as a rename — counted, not listed — and only genuine
 * movement appears in the body of the report.
 *
 * Exit code is 0 either way; this reports, it does not gate.
 */
import { readFileSync } from "node:fs"

const format = (box) =>
  box ? `${box.display} ${box.width}x${box.height} @${box.x},${box.y}` : "(absent)"

/** True when both snapshots carry structural paths. Older snapshots do not. */
function hasPaths(before, after) {
  const any = (snapshot) =>
    Object.values(snapshot).some((list) => list.some((item) => typeof item.path === "string"))
  return any(before) && any(after)
}

/**
 * Keys elements for comparison.
 *
 * With `path`, identity is structural and survives renames. Without it — an older
 * snapshot — fall back to document order, which is also rename-safe. Never key on
 * `selector`: that is the defect this tool had.
 */
function keyed(list, byPath) {
  const map = new Map()
  list.forEach((item, index) => {
    // Duplicate paths cannot occur (nth-of-type is unique per parent), but an
    // index suffix keeps the fallback total and the two branches symmetric.
    const key = byPath ? item.path : `position:${index}`
    map.set(key, item)
  })
  return map
}

export function diffSnapshots(before, after) {
  const byPath = hasPaths(before, after)
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()

  const groups = []
  let changedElements = 0
  let renamedElements = 0

  for (const key of keys) {
    const a = keyed(before[key] ?? [], byPath)
    const b = keyed(after[key] ?? [], byPath)
    const ids = [...new Set([...a.keys(), ...b.keys()])]

    const changes = []
    for (const id of ids) {
      const x = a.get(id)
      const y = b.get(id)

      if (!x || !y) {
        changes.push({
          id,
          kind: x ? "removed" : "added",
          selector: (x ?? y).selector,
          before: x ? format(x) : "(absent)",
          after: y ? format(y) : "(absent)",
        })
        continue
      }

      if (format(x) !== format(y)) {
        changes.push({
          id,
          kind: "moved",
          selector: x.selector === y.selector ? x.selector : `${x.selector} -> ${y.selector}`,
          before: format(x),
          after: format(y),
        })
        continue
      }

      // Same structure, same geometry, different classes: a rename. This is the
      // expected shape of a token migration and is not a change in rendering.
      if (x.selector !== y.selector) renamedElements += 1
    }

    if (changes.length > 0) {
      changedElements += changes.length
      groups.push({ key, changes })
    }
  }

  return {
    comparedBy: byPath ? "structural path" : "document position",
    groups,
    changedElements,
    changedGroups: groups.length,
    renamedElements,
  }
}

function main() {
  const [beforePath, afterPath] = process.argv.slice(2)
  if (!beforePath || !afterPath) {
    console.error("usage: diff-layout.mjs <before.json> <after.json>")
    process.exit(2)
  }

  const before = JSON.parse(readFileSync(beforePath, "utf8"))
  const after = JSON.parse(readFileSync(afterPath, "utf8"))
  const result = diffSnapshots(before, after)

  for (const group of result.groups) {
    console.log(`\n${group.key}`)
    for (const change of group.changes) {
      console.log(`    ${change.selector}${change.kind === "moved" ? "" : ` (${change.kind})`}`)
      console.log(`      before: ${change.before}`)
      console.log(`      after:  ${change.after}`)
    }
  }

  console.log(
    `\nMatched elements by ${result.comparedBy}.\n` +
      `${result.changedElements} element(s) changed across ${result.changedGroups} route/width combination(s).`,
  )

  if (result.renamedElements > 0) {
    console.log(
      `${result.renamedElements} element(s) kept identical geometry under a different class name ` +
        `— a rename, not a rendering change.`,
    )
  }

  if (result.changedElements === 0) console.log("Rendered geometry is identical.")
}

// Only run the CLI when invoked directly, so tests can import diffSnapshots.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main()
}

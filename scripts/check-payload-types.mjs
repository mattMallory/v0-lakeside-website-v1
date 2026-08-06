import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Regenerates payload-types.ts and fails if the result differs from the committed
// file. The generated types are the only checkable record of the Payload schema, so a
// build that runs against a stale or missing copy would report success while type
// checking against the wrong schema.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const typesPath = path.join(root, "payload-types.ts")
const payloadBin = path.join(root, "node_modules", "payload", "bin.js")

const env = { ...process.env }
env.NODE_OPTIONS = ["--no-deprecation", "--disable-warning=ExperimentalWarning"]
  .concat(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])
  .filter((value, index, array) => array.indexOf(value) === index)
  .join(" ")

const committed = fs.existsSync(typesPath) ? fs.readFileSync(typesPath, "utf8") : null

if (committed === null) {
  console.warn("[types] payload-types.ts is missing — it will be generated now.")
}

function generate() {
  execFileSync(process.execPath, [payloadBin, "generate:types"], {
    stdio: "inherit",
    env,
    cwd: root,
  })
}

try {
  generate()
} catch (error) {
  // Leave whatever was committed in place; a failed generation must not mutate the tree.
  if (committed !== null) {
    fs.writeFileSync(typesPath, committed)
  }
  console.error("\n[types] Could not generate Payload types, so the committed copy could not be verified.")
  console.error("[types] Fix the Payload config or environment above and re-run.")
  process.exit(typeof error.status === "number" ? error.status : 1)
}

const regenerated = fs.readFileSync(typesPath, "utf8")

if (committed === null) {
  console.error("\n[types] payload-types.ts was not committed. It has been generated — review and commit it.")
  process.exit(1)
}

if (regenerated !== committed) {
  // The fresh output is left on disk on purpose, so `git diff` shows exactly what drifted.
  console.error("\n[types] payload-types.ts is out of date with the Payload config.")
  console.error("[types] It has been regenerated in place — review `git diff payload-types.ts` and commit it.")
  process.exit(1)
}

console.log("[types] payload-types.ts is up to date.")

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function extractInlineScript(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  const match = content.match(/export const \w+ = `\n([\s\S]*?)`\n?\.trim\(\)/)

  if (!match) {
    throw new Error(`Could not extract inline script from ${filePath}`)
  }

  return `${match[1].trim()}\n`
}

const targets = [
  ["lib/metric-count-up-inline.ts", "public/scripts/lakeside-metric-count-up.js"],
  ["lib/tech-logos-reveal-inline.ts", "public/scripts/lakeside-tech-logos-reveal.js"],
  ["lib/offer-builder-layout-script.ts", "public/scripts/lakeside-offer-builder.js"],
  ["lib/budget-planner-layout-script.ts", "public/scripts/lakeside-budget-planner.js"],
]

for (const [source, destination] of targets) {
  const outputPath = path.join(root, destination)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, extractInlineScript(path.join(root, source)))
  console.log(`Wrote ${destination}`)
}

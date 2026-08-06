import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const configUrl = pathToFileURL(path.join(root, "payload.config.sqlite.ts")).href

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)
const { seedAboutIfEmpty } = await tsImport(pathToFileURL(path.join(root, "lib/seed-about.ts")).href, import.meta.url)

const payload = await getPayload({ config })
await seedAboutIfEmpty(payload)

const about = await payload.findGlobal({ slug: "about", depth: 0 })
const memberCount = about.teamMembers?.length ?? 0
console.log(`Seeded about page content with ${memberCount} team members`)
process.exit(0)

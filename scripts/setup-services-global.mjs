import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const configUrl = pathToFileURL(path.join(root, "payload.config.sqlite.ts")).href

process.env.PAYLOAD_DB_PUSH = "false"

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)
const { seedServicesIfEmpty } = await tsImport(
  pathToFileURL(path.join(root, "lib/seed-services.ts")).href,
  import.meta.url,
)

const payload = await getPayload({ config })
await seedServicesIfEmpty(payload)

const services = await payload.findGlobal({ slug: "services-page", depth: 0 })
const categoryCount = services.technologyCategories?.length ?? 0
const offeringsCount = services.offeringsItems?.length ?? 0
console.log(`Services global ready with ${offeringsCount} offering cards and ${categoryCount} platform cards`)
process.exit(0)

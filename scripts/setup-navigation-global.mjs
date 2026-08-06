import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const configUrl = pathToFileURL(path.join(root, "payload.config.sqlite.ts")).href

process.env.PAYLOAD_DB_PUSH = "false"

const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)
const { ensureNavigationGlobalSqlite } = await tsImport(
  pathToFileURL(path.join(root, "lib/ensure-navigation-global-sqlite.ts")).href,
  import.meta.url,
)
const { seedNavigationIfEmpty } = await tsImport(
  pathToFileURL(path.join(root, "lib/seed-navigation.ts")).href,
  import.meta.url,
)

await ensureNavigationGlobalSqlite()

const payload = await getPayload({ config })
await seedNavigationIfEmpty(payload)

const navigation = await payload.findGlobal({ slug: "navigation", depth: 0 })
const headerCount = navigation.headerNavItems?.length ?? 0
const footerCount = navigation.footerNavItems?.length ?? 0
console.log(
  `Navigation global ready with ${headerCount} header links and ${footerCount} footer links.`,
)
process.exit(0)

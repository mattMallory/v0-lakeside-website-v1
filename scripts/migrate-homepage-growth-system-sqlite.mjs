import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const ensureUrl = pathToFileURL(path.join(root, "lib/ensure-homepage-growth-system-sqlite.ts")).href

const { ensureHomepageGrowthSystemSqlite } = await tsImport(ensureUrl, import.meta.url)
await ensureHomepageGrowthSystemSqlite()

import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const { ensureServicesGlobalSqlite } = await tsImport(
  pathToFileURL(path.join(root, "lib/ensure-services-global-sqlite.ts")).href,
  import.meta.url,
)

await ensureServicesGlobalSqlite()
console.log("Services page global tables are ready.")

import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const { ensureNavigationGlobalSqlite } = await tsImport(
  pathToFileURL(path.join(root, "lib/ensure-navigation-global-sqlite.ts")).href,
  import.meta.url,
)

await ensureNavigationGlobalSqlite()
console.log("Navigation global tables are ready.")

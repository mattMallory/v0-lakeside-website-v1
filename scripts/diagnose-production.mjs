import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

import { formatBlobStorageState } from "./blob-storage-state.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function isPostgresUrl(url) {
  return Boolean(url?.trim().startsWith("postgres://") || url?.trim().startsWith("postgresql://"))
}

console.log("Environment diagnostics:")
console.log(`  payloadSecret: ${process.env.PAYLOAD_SECRET?.trim() ? "yes" : "no"}`)
console.log(`  postgresUrl: ${isPostgresUrl(process.env.POSTGRES_URL) ? "yes" : "no"}`)
console.log(`  postgresUrlNonPooling: ${isPostgresUrl(process.env.POSTGRES_URL_NON_POOLING) ? "yes" : "no"}`)
console.log(`  blobStorage: ${formatBlobStorageState()}`)
console.log(`  vercel: ${process.env.VERCEL ? "yes" : "no"}`)

if (!process.env.PAYLOAD_SECRET?.trim()) {
  console.error("\nMissing PAYLOAD_SECRET.")
  process.exit(1)
}

const postgresUrl = [
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
].find((url) => url?.trim().startsWith("postgres"))

if (!postgresUrl) {
  console.error("\nMissing Postgres URL.")
  process.exit(1)
}

process.env.POSTGRES_URL = postgresUrl
process.env.PAYLOAD_DB_PUSH = "false"

const configUrl = pathToFileURL(path.join(root, "payload.config.postgres.ts")).href

try {
  const { getPayload } = await import("payload")
  const { default: config } = await tsImport(configUrl, import.meta.url)

  console.log("\nInitializing Payload...")
  const payload = await getPayload({ config })

  const users = await payload.find({ collection: "users", limit: 1 })
  console.log(`\nPayload initialized successfully. Users in DB: ${users.totalDocs}`)

  const homepage = await payload.findGlobal({ slug: "homepage" })
  console.log(`Homepage global loaded (id: ${homepage.id}).`)

  process.exit(0)
} catch (error) {
  console.error("\nPayload initialization failed:")
  console.error(error)
  process.exit(1)
}

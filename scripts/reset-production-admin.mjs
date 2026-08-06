import "dotenv/config"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { tsImport } from "tsx/esm/api"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function isPostgresUrl(url) {
  return Boolean(url?.trim().startsWith("postgres://") || url?.trim().startsWith("postgresql://"))
}

const postgresUrl = [
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
].find(isPostgresUrl)

if (!process.env.PAYLOAD_SECRET?.trim()) {
  console.error("Missing PAYLOAD_SECRET.")
  process.exit(1)
}

if (!postgresUrl) {
  console.error("Missing Postgres URL.")
  process.exit(1)
}

process.env.POSTGRES_URL = postgresUrl
process.env.PAYLOAD_DB_PUSH = "false"

const email = process.env.PRODUCTION_ADMIN_EMAIL || "matt@madebylakeside.com"
const password = process.env.PRODUCTION_ADMIN_PASSWORD

if (!password?.trim()) {
  console.error(
    "Set PRODUCTION_ADMIN_PASSWORD before running this script (choose a strong password for /admin).",
  )
  process.exit(1)
}

const configUrl = pathToFileURL(path.join(root, "payload.config.postgres.ts")).href
const { getPayload } = await import("payload")
const { default: config } = await tsImport(configUrl, import.meta.url)

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
})

if (existing.docs.length === 0) {
  await payload.create({
    collection: "users",
    data: { email, password },
  })
  console.log(`Created production admin user: ${email}`)
} else {
  await payload.update({
    collection: "users",
    id: existing.docs[0].id,
    data: { password },
  })
  console.log(`Reset password for production admin user: ${email}`)
}

console.log("\nLog in at https://v0-madebylakeside.vercel.app/admin")
process.exit(0)

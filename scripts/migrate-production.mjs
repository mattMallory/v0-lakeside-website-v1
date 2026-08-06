import "dotenv/config"
import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

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
  console.error("Missing PAYLOAD_SECRET. Copy it from Vercel → Production environment variables.")
  process.exit(1)
}

if (!postgresUrl) {
  console.error("Missing Postgres URL. Set POSTGRES_URL_NON_POOLING or POSTGRES_URL from Vercel.")
  process.exit(1)
}

const env = {
  ...process.env,
  POSTGRES_URL: postgresUrl,
  NODE_OPTIONS: ["--no-deprecation", ...(process.env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])].join(
    " ",
  ),
}

console.log("Running Payload migrations against production Postgres...")
execSync("node ./node_modules/payload/bin.js migrate", {
  stdio: "inherit",
  env,
  cwd: root,
})
console.log("Migrations complete.")

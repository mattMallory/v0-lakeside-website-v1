import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = { ...process.env }

env.NODE_OPTIONS = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
  .filter((value, index, array) => array.indexOf(value) === index)
  .join(" ")

const postgresUrl =
  env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL || env.DATABASE_URL

function run(label, command) {
  console.log(`\n[build] ${label}`)
  console.log(`[build] $ ${command}`)
  execSync(command, { stdio: "inherit", env, cwd: root, shell: true })
}

if (env.PAYLOAD_SECRET && postgresUrl) {
  env.POSTGRES_URL = env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL
  run("Running database migrations", "node ./node_modules/payload/bin.js migrate")
} else {
  console.warn("[build] Skipping migrations — missing PAYLOAD_SECRET or Postgres URL")
}

run("Running Next.js build", "node ./node_modules/next/dist/bin/next build")

console.log("\n[build] Done.")

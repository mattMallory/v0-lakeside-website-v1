import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = { ...process.env }

if (!env.PAYLOAD_SECRET) {
  console.error("[ci] ERROR: PAYLOAD_SECRET is not set in Vercel Environment Variables.")
  process.exit(1)
}

const postgresUrl =
  env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL || env.DATABASE_URL

if (!postgresUrl) {
  console.error("[ci] ERROR: No Postgres URL found.")
  console.error("[ci] Link Neon in Vercel → Storage → Connect to Project.")
  process.exit(1)
}

env.POSTGRES_URL = postgresUrl
env.NODE_OPTIONS = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
  .filter((value, index, array) => array.indexOf(value) === index)
  .join(" ")

console.log("[ci] Env check:")
console.log(`  PAYLOAD_SECRET: set (${env.PAYLOAD_SECRET.length} chars)`)
console.log(
  `  POSTGRES_URL: set (${env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL_UNPOOLED ? "non-pooling" : "pooled"})`,
)

function run(label, command) {
  console.log(`\n[ci] ===== ${label} =====`)
  console.log(`[ci] $ ${command}`)
  try {
    execSync(command, { stdio: "inherit", env, cwd: root, shell: true })
  } catch (error) {
    const exitCode = typeof error.status === "number" ? error.status : 1
    console.error(`\n[ci] FAILED: ${label} (exit ${exitCode})`)
    process.exit(exitCode)
  }
}

run("payload migrate", "node ./node_modules/payload/bin.js migrate")
run("next build", "node ./node_modules/next/dist/bin/next build")

console.log("\n[ci] Build complete.")

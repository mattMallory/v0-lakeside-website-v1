import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = { ...process.env }

if (!env.PAYLOAD_SECRET) {
  console.error("[ci] ERROR: PAYLOAD_SECRET is not set in Vercel Environment Variables.")
  process.exit(1)
}

const postgresUrl = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL
if (!postgresUrl) {
  console.error(
    "[ci] ERROR: POSTGRES_URL is not set. Link your Neon database in Vercel → Storage → Connect to Project.",
  )
  process.exit(1)
}

// Neon: DDL migrations need a direct (non-pooled) connection.
env.POSTGRES_URL = postgresUrl

const nodeOptions = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
env.NODE_OPTIONS = [...new Set(nodeOptions)].join(" ")

function run(label, command) {
  console.log(`[ci] ${label}...`)
  try {
    execSync(command, { stdio: "inherit", env, cwd: root, shell: true })
  } catch (error) {
    console.error(`[ci] FAILED: ${label}`)
    if (error.status !== undefined) process.exit(error.status ?? 1)
    throw error
  }
}

run("Running payload migrate", "pnpm exec payload migrate")
run("Running next build", "pnpm exec next build")

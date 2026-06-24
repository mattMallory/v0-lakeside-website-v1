import { spawnSync } from "node:child_process"
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
  console.error("[ci] Expected one of: POSTGRES_URL_NON_POOLING, POSTGRES_URL, DATABASE_URL")
  console.error("[ci] Link Neon in Vercel → Storage → Connect to Project (enable Production + Preview).")
  process.exit(1)
}

env.POSTGRES_URL = postgresUrl

const nodeOptions = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
env.NODE_OPTIONS = [...new Set(nodeOptions)].join(" ")

console.log("[ci] Env check:")
console.log(`  PAYLOAD_SECRET: set (${env.PAYLOAD_SECRET.length} chars)`)
console.log(`  POSTGRES_URL: set (using ${env.POSTGRES_URL_NON_POOLING ? "non-pooling" : "pooled"} connection)`)
console.log(`  VERCEL: ${env.VERCEL ?? "0"}`)

function run(label, command, args) {
  console.log(`\n[ci] ${label}...`)
  const result = spawnSync(command, args, {
    env,
    cwd: root,
    encoding: "utf8",
    shell: false,
  })

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  if (result.status !== 0) {
    console.error(`\n[ci] FAILED: ${label} (exit ${result.status ?? "unknown"})`)
    console.error(
      "[ci] If the error mentions 'already exists', reset your Neon database branch:",
    )
    console.error("[ci]   Vercel → Storage → Neon → Open in Neon → Reset branch / drop all tables")
    console.error("[ci] Then redeploy.")
    process.exit(result.status ?? 1)
  }
}

run("Migration status", "pnpm", ["exec", "payload", "migrate:status"])
run("Running payload migrate", "pnpm", ["exec", "payload", "migrate"])
run("Running next build", "pnpm", ["exec", "next", "build"])

console.log("\n[ci] Build complete.")

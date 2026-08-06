import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = { ...process.env }

env.NODE_OPTIONS = ["--no-deprecation", ...(env.NODE_OPTIONS?.split(" ").filter(Boolean) ?? [])]
  .filter((value, index, array) => array.indexOf(value) === index)
  .join(" ")

function isPostgresUrl(url) {
  const value = url?.trim()
  return Boolean(value?.startsWith("postgres://") || value?.startsWith("postgresql://"))
}

function readPostgresCandidate(value) {
  const trimmed = value?.trim()
  return isPostgresUrl(trimmed) ? trimmed : undefined
}

function buildPostgresUrlFromParts() {
  const host = env.POSTGRES_HOST?.trim()
  const user = env.POSTGRES_USER?.trim()
  const password = env.POSTGRES_PASSWORD?.trim()
  const database = env.POSTGRES_DATABASE?.trim()

  if (!host || !user || !password || !database) {
    return undefined
  }

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`
}

function getPostgresMigrationUrl() {
  const candidates = [
    env.POSTGRES_URL_NON_POOLING,
    env.DATABASE_URL_UNPOOLED,
    env.POSTGRES_URL,
    env.POSTGRES_PRISMA_URL,
    env.DATABASE_URL,
  ]

  for (const candidate of candidates) {
    const resolved = readPostgresCandidate(candidate)
    if (resolved) return resolved
  }

  return buildPostgresUrlFromParts()
}

function logEnvDiagnostics() {
  console.log("[build] Environment diagnostics:")
  console.log(`[build]   payloadSecret: ${env.PAYLOAD_SECRET?.trim() ? "yes" : "no"}`)
  console.log(`[build]   postgresUrl: ${readPostgresCandidate(env.POSTGRES_URL) ? "yes" : "no"}`)
  console.log(
    `[build]   postgresUrlNonPooling: ${readPostgresCandidate(env.POSTGRES_URL_NON_POOLING) ? "yes" : "no"}`,
  )
  console.log(
    `[build]   postgresPrismaUrl: ${readPostgresCandidate(env.POSTGRES_PRISMA_URL) ? "yes" : "no"}`,
  )
  console.log(`[build]   databaseUrl: ${readPostgresCandidate(env.DATABASE_URL) ? "yes" : "no"}`)
  console.log(
    `[build]   databaseUrlUnpooled: ${readPostgresCandidate(env.DATABASE_URL_UNPOOLED) ? "yes" : "no"}`,
  )
  console.log(
    `[build]   postgresHostParts: ${
      env.POSTGRES_HOST?.trim() &&
      env.POSTGRES_USER?.trim() &&
      env.POSTGRES_PASSWORD?.trim() &&
      env.POSTGRES_DATABASE?.trim()
        ? "yes"
        : "no"
    }`,
  )
  console.log(`[build]   resolvedPostgresUrl: ${getPostgresMigrationUrl() ? "yes" : "no"}`)
  console.log(`[build]   vercel: ${env.VERCEL ? "yes" : "no"}`)
  console.log(`[build]   vercelEnv: ${env.VERCEL_ENV || "unknown"}`)
  console.log(`[build]   gitBranch: ${env.VERCEL_GIT_COMMIT_REF || "unknown"}`)
}

const postgresUrl = getPostgresMigrationUrl()

function run(label, command) {
  console.log(`\n[build] ${label}`)
  console.log(`[build] $ ${command}`)
  execSync(command, { stdio: "inherit", env, cwd: root, shell: true })
}

logEnvDiagnostics()

if (env.PAYLOAD_SECRET && postgresUrl) {
  env.POSTGRES_URL = postgresUrl
  run("Running database migrations", "node ./node_modules/payload/bin.js migrate")
} else {
  console.warn("[build] Skipping migrations — missing PAYLOAD_SECRET or Postgres URL")
  if (!env.PAYLOAD_SECRET?.trim()) {
    console.warn("[build]   Missing: PAYLOAD_SECRET")
  }
  if (!postgresUrl) {
    console.warn("[build]   Missing: a valid Postgres connection string")
  }
}

run("Running Next.js build", "node ./node_modules/next/dist/bin/next build --webpack")

console.log("\n[build] Done.")

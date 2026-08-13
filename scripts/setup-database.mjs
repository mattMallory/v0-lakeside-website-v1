#!/usr/bin/env node
/**
 * Creates the local SQLite schema and proves it actually has content.
 *
 * Booting Payload is what builds the schema: `payload.config.sqlite.ts` sets
 * `push: process.env.PAYLOAD_DB_PUSH !== "false"`, so push generates all tables
 * from the config, and `onInit` seeds them.
 *
 * `next build` does NOT do this. Measured on this repository: building from no
 * database exits 0 while creating zero tables, logging 152 "no such table"
 * errors, and prerendering 12 pages instead of 21. The site still renders,
 * because every mapper falls back to hardcoded defaults — which is exactly what
 * makes the failure dangerous. The blog assertions in the viewport suite pass
 * against an empty database, because there is nothing on the page to violate
 * them. A green run in that state manufactures confidence.
 *
 * So this script does not just create the schema, it verifies the result and
 * exits non-zero if the database is empty. A setup step that can silently no-op
 * is how that defect returns.
 *
 * Note on interactivity: push prompts (y/N) before anything destructive and will
 * wait forever in a non-interactive environment. A database created from nothing
 * has nothing to disambiguate, which is the case CI is in — `--fresh` enforces
 * that by deleting any existing database first.
 */
import { existsSync, rmSync } from "node:fs"

const FRESH = process.argv.includes("--fresh")

/** Tables that must exist. Not the full set — the ones whose absence is the known failure. */
const REQUIRED_TABLES = [
  "posts",
  "users",
  "media",
  "categories",
  "tags",
  "homepage",
  "about",
  "branding",
  "navigation",
  "legal",
  "services_page",
]

/** Globals that must load. Table existence is not the same as usability. */
const REQUIRED_GLOBALS = ["branding", "homepage", "about", "services-page", "legal", "navigation"]

/** Collections that must load, with the minimum document count that counts as seeded. */
const REQUIRED_COLLECTIONS = [
  { slug: "posts", min: 1 },
  { slug: "categories", min: 1 },
  { slug: "tags", min: 1 },
  { slug: "media", min: 1 },
  { slug: "users", min: 0 },
]

const failures = []

function fail(message) {
  failures.push(message)
  console.error(`[db] FAIL  ${message}`)
}

function ok(message) {
  console.log(`[db] ok    ${message}`)
}

function databaseFilePath() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  return url.startsWith("file:") ? url.slice("file:".length) : url
}

async function main() {
  if (!process.env.PAYLOAD_SECRET) {
    console.error("[db] PAYLOAD_SECRET is not set. Any random string works locally.")
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error("[db] DATABASE_URL is not set. Use DATABASE_URL=file:./payload.db locally.")
    process.exit(1)
  }

  const dbPath = databaseFilePath()

  if (FRESH && dbPath && existsSync(dbPath)) {
    rmSync(dbPath)
    console.log(`[db] removed existing ${dbPath} so push has nothing to disambiguate`)
  }

  console.log("[db] booting Payload — push creates the schema, onInit seeds it")
  const { default: config } = await import("@payload-config")
  const { getPayload } = await import("payload")
  const payload = await getPayload({ config })

  // --- Tables -------------------------------------------------------------
  const { createClient } = await import("@libsql/client")
  const client = createClient({ url: process.env.DATABASE_URL })

  const result = await client.execute(
    "select name from sqlite_master where type='table' and name not like 'sqlite_%'",
  )
  const tables = new Set(result.rows.map((row) => String(row.name)))

  if (tables.size === 0) {
    fail("the database has no tables at all — push did not run")
  } else {
    ok(`${tables.size} tables created`)
  }

  for (const table of REQUIRED_TABLES) {
    if (!tables.has(table)) fail(`required table "${table}" is missing`)
  }

  // --- Globals ------------------------------------------------------------
  for (const slug of REQUIRED_GLOBALS) {
    try {
      await payload.findGlobal({ slug, depth: 0 })
      ok(`global "${slug}" loads`)
    } catch (error) {
      fail(`global "${slug}" failed to load: ${String(error).split("\n")[0]}`)
    }
  }

  // --- Content ------------------------------------------------------------
  for (const { slug, min } of REQUIRED_COLLECTIONS) {
    try {
      const found = await payload.find({ collection: slug, limit: 0, depth: 0 })
      if (found.totalDocs < min) {
        fail(`collection "${slug}" has ${found.totalDocs} documents, expected at least ${min}`)
      } else {
        ok(`collection "${slug}" has ${found.totalDocs} documents`)
      }
    } catch (error) {
      fail(`collection "${slug}" failed to load: ${String(error).split("\n")[0]}`)
    }
  }

  await client.close()

  if (failures.length > 0) {
    console.error(
      `\n[db] ${failures.length} check(s) failed. The database is not usable, and running the ` +
        `test suite against it would produce a green run that tested nothing.`,
    )
    process.exit(1)
  }

  console.log("\n[db] database is ready and seeded")
  process.exit(0)
}

main().catch((error) => {
  console.error("[db] setup threw:", error)
  process.exit(1)
})

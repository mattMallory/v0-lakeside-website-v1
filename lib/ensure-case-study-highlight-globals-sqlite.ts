import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const globalTables = ["about", "services_page"] as const

const caseStudyColumns = [
  "case_study_eyebrow",
  "case_study_headline",
  "case_study_featured_post_id",
  "case_study_background_id",
] as const

const servicesBackgroundColumns = ["hero_background_id", "about_background_id"] as const

async function columnExists(client: ReturnType<typeof createClient>, table: string, column: string) {
  const result = await client.execute(`PRAGMA table_info(${table})`)
  return result.rows.some((row) => row.name === column)
}

async function tableExists(client: ReturnType<typeof createClient>, table: string) {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [table],
  )

  return result.rows.length > 0
}

export async function ensureCaseStudyHighlightGlobalsSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    for (const table of globalTables) {
      if (!(await tableExists(client, table))) continue

      for (const column of caseStudyColumns) {
        if (!(await columnExists(client, table, column))) {
          const columnType = column.endsWith("_id") ? "INTEGER" : "TEXT"
          await client.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${columnType}`)
        }
      }
    }

    if (await tableExists(client, "services_page")) {
      for (const column of servicesBackgroundColumns) {
        if (!(await columnExists(client, "services_page", column))) {
          await client.execute(`ALTER TABLE services_page ADD COLUMN ${column} INTEGER`)
        }
      }
    }

    if (await tableExists(client, "homepage")) {
      if (!(await columnExists(client, "homepage", "case_study_background_id"))) {
        await client.execute(`ALTER TABLE homepage ADD COLUMN case_study_background_id INTEGER`)
      }
    }
  } catch (error) {
    console.error("[payload] Failed to ensure case study highlight global columns:", error)
  } finally {
    client.close()
  }
}

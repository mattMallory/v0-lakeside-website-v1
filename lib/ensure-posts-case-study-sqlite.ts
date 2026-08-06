import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

async function columnExists(client: ReturnType<typeof createClient>, table: string, column: string) {
  const result = await client.execute(`PRAGMA table_info(${table})`)
  return result.rows.some((row) => row.name === column)
}

const caseStudyPracticeColumns = [
  "client_practice_type",
  "client_services",
  "client_engagement_focus",
  "client_market_reach",
] as const

export async function ensurePostsCaseStudySqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (!(await columnExists(client, "posts", "post_type"))) {
      await client.execute("ALTER TABLE posts ADD COLUMN post_type TEXT DEFAULT 'article'")
    }

    for (const column of caseStudyPracticeColumns) {
      if (!(await columnExists(client, "posts", column))) {
        await client.execute(`ALTER TABLE posts ADD COLUMN ${column} TEXT`)
      }
    }

    if (!(await columnExists(client, "posts", "read_time"))) {
      await client.execute("ALTER TABLE posts ADD COLUMN read_time TEXT")
    }
  } catch (error) {
    console.error("[payload] Failed to ensure posts case study columns:", error)
  } finally {
    client.close()
  }
}

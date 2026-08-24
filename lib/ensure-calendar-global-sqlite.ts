import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS calendar (
    id integer PRIMARY KEY NOT NULL,
    eyebrow text DEFAULT 'Schedule',
    title text DEFAULT 'Book a time that works for you',
    description text,
    embed_code text,
    seo_title text DEFAULT 'Schedule | Lakeside',
    seo_description text,
    updated_at text,
    created_at text
  )`,
  "PRAGMA foreign_keys=ON",
]

async function tableExists(client: ReturnType<typeof createClient>, name: string) {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [name],
  )

  return result.rows.length > 0
}

export async function ensureCalendarGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (await tableExists(client, "calendar")) {
      return
    }

    for (const statement of createStatements) {
      await client.execute(statement)
    }
  } catch (error) {
    console.error("[payload] Failed to ensure calendar global tables:", error)
  } finally {
    client.close()
  }
}

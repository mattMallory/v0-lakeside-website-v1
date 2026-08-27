import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS demo_system (
    id integer PRIMARY KEY NOT NULL,
    eyebrow text DEFAULT 'Demo The System',
    title text DEFAULT 'Coming soon',
    description text,
    form_title text DEFAULT 'Get early access',
    form_description text,
    form_button_label text DEFAULT 'Join the list',
    success_title text DEFAULT 'You''re on the list.',
    success_message text,
    seo_title text DEFAULT 'Demo The System | Lakeside',
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

export async function ensureDemoSystemGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (await tableExists(client, "demo_system")) {
      return
    }

    for (const statement of createStatements) {
      await client.execute(statement)
    }
  } catch (error) {
    console.error("[payload] Failed to ensure demo-system global tables:", error)
  } finally {
    client.close()
  }
}

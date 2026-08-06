import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS navigation (
    id integer PRIMARY KEY NOT NULL,
    header_cta_label text DEFAULT 'Schedule a Consultation',
    header_cta_href text DEFAULT '/consultation',
    updated_at text,
    created_at text
  )`,
  `CREATE TABLE IF NOT EXISTS navigation_header_nav_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    label text NOT NULL,
    href text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES navigation(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS navigation_footer_nav_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    label text NOT NULL,
    href text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES navigation(id) ON UPDATE no action ON DELETE cascade
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

export async function ensureNavigationGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (await tableExists(client, "navigation")) {
      return
    }

    for (const statement of createStatements) {
      await client.execute(statement)
    }
  } catch (error) {
    console.error("[payload] Failed to ensure navigation global tables:", error)
  } finally {
    client.close()
  }
}

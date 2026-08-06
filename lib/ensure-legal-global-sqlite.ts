import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS legal (
    id integer PRIMARY KEY NOT NULL,
    privacy_eyebrow text DEFAULT 'Legal',
    privacy_title text DEFAULT 'Privacy Policy',
    privacy_last_updated text DEFAULT 'August 5, 2026',
    privacy_intro text,
    privacy_seo_title text DEFAULT 'Privacy Policy | Lakeside',
    privacy_seo_description text,
    terms_eyebrow text DEFAULT 'Legal',
    terms_title text DEFAULT 'Terms of Service',
    terms_last_updated text DEFAULT 'August 5, 2026',
    terms_intro text,
    terms_seo_title text DEFAULT 'Terms of Service | Lakeside',
    terms_seo_description text,
    updated_at text,
    created_at text
  )`,
  `CREATE TABLE IF NOT EXISTS legal_privacy_sections (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES legal(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS legal_terms_sections (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES legal(id) ON UPDATE no action ON DELETE cascade
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

export async function ensureLegalGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (await tableExists(client, "legal")) {
      return
    }

    for (const statement of createStatements) {
      await client.execute(statement)
    }
  } catch (error) {
    console.error("[payload] Failed to ensure legal global tables:", error)
  } finally {
    client.close()
  }
}

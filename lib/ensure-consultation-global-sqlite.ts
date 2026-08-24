import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS consultation (
    id integer PRIMARY KEY NOT NULL,
    eyebrow text DEFAULT 'Get Started',
    title text DEFAULT 'Let''s Grow Your Practice',
    description text,
    seo_title text DEFAULT 'Schedule a Consultation | Lakeside',
    seo_description text,
    sms_non_marketing_consent_label text,
    sms_marketing_consent_label text,
    privacy_link_label text DEFAULT 'Privacy Policy',
    terms_link_label text DEFAULT 'Terms and Conditions',
    updated_at text,
    created_at text
  )`,
  "PRAGMA foreign_keys=ON",
]

const ensureColumns = [
  { name: "sms_non_marketing_consent_label", definition: "text" },
  { name: "sms_marketing_consent_label", definition: "text" },
  { name: "privacy_link_label", definition: "text DEFAULT 'Privacy Policy'" },
  { name: "terms_link_label", definition: "text DEFAULT 'Terms and Conditions'" },
]

async function tableExists(client: ReturnType<typeof createClient>, name: string) {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [name],
  )

  return result.rows.length > 0
}

async function columnExists(
  client: ReturnType<typeof createClient>,
  table: string,
  column: string,
) {
  const result = await client.execute(`PRAGMA table_info(${table})`)
  return result.rows.some((row) => row.name === column)
}

export async function ensureConsultationGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    if (!(await tableExists(client, "consultation"))) {
      for (const statement of createStatements) {
        await client.execute(statement)
      }
      return
    }

    for (const column of ensureColumns) {
      if (await columnExists(client, "consultation", column.name)) continue
      await client.execute(
        `ALTER TABLE consultation ADD COLUMN ${column.name} ${column.definition}`,
      )
    }
  } catch (error) {
    console.error("[payload] Failed to ensure consultation global tables:", error)
  } finally {
    client.close()
  }
}

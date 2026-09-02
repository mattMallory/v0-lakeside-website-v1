import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const createStatements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS services_page (
    id integer PRIMARY KEY NOT NULL,
    technology_eyebrow text DEFAULT 'Technology Stack',
    technology_headline text DEFAULT 'Best-in-Class Tools. One Connected System.',
    technology_description text DEFAULT 'We deploy and manage the platforms top-performing lead gen teams rely on — integrated, monitored, and optimized as a single operating system for your growth.',
    updated_at text,
    created_at text
  )`,
  `CREATE TABLE IF NOT EXISTS services_page_technology_categories (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    icon text NOT NULL DEFAULT 'database',
    image_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action,
    image_alt text,
    title text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES services_page(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS services_page_technology_categories_items (
    _order integer NOT NULL,
    _parent_id text NOT NULL,
    id text PRIMARY KEY NOT NULL,
    label text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES services_page_technology_categories(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS services_page_technology_logos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    logo_id text NOT NULL,
    name text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES services_page(id) ON UPDATE no action ON DELETE cascade
  )`,
  "PRAGMA foreign_keys=ON",
]

const renameStatements = [
  "PRAGMA foreign_keys=OFF",
  "ALTER TABLE services RENAME TO services_page",
  "ALTER TABLE services_technology_categories RENAME TO services_page_technology_categories",
  "ALTER TABLE services_technology_categories_items RENAME TO services_page_technology_categories_items",
  "PRAGMA foreign_keys=ON",
]

async function tableExists(client: ReturnType<typeof createClient>, name: string) {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [name],
  )

  return result.rows.length > 0
}

export async function ensureServicesGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    const hasServicesPage = await tableExists(client, "services_page")
    const hasLegacyServices = await tableExists(client, "services")

    if (hasServicesPage || hasLegacyServices) {
      if (hasLegacyServices && !hasServicesPage) {
        for (const statement of renameStatements) {
          await client.execute(statement)
        }
      }

      if (!(await tableExists(client, "services_page_technology_logos"))) {
        await client.execute(`CREATE TABLE IF NOT EXISTS services_page_technology_logos (
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          id text PRIMARY KEY NOT NULL,
          logo_id text NOT NULL,
          name text NOT NULL,
          FOREIGN KEY (_parent_id) REFERENCES services_page(id) ON UPDATE no action ON DELETE cascade
        )`)
      }
      return
    }

    for (const statement of createStatements) {
      await client.execute(statement)
    }
  } catch (error) {
    console.error("[payload] Failed to ensure services-page global tables:", error)
  } finally {
    client.close()
  }
}

import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dbPath = path.join(root, "payload.db")
const client = createClient({ url: `file:${dbPath}` })

const statements = [
  "PRAGMA foreign_keys=OFF",
  `CREATE TABLE IF NOT EXISTS homepage_why_choose_cards_new (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    image_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action,
    image_alt text,
    heading text NOT NULL,
    body text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `INSERT INTO homepage_why_choose_cards_new (_order, _parent_id, id, image_id, image_alt, heading, body)
   SELECT _order, _parent_id, id, image_id, COALESCE(image_alt, base_alt), heading, body
   FROM homepage_why_choose_cards`,
  "DROP TABLE homepage_why_choose_cards",
  'ALTER TABLE homepage_why_choose_cards_new RENAME TO homepage_why_choose_cards',
  "CREATE INDEX IF NOT EXISTS homepage_why_choose_cards_order_idx ON homepage_why_choose_cards (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_why_choose_cards_parent_id_idx ON homepage_why_choose_cards (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_why_choose_cards_image_idx ON homepage_why_choose_cards (image_id)",
  "PRAGMA foreign_keys=ON",
]

async function main() {
  const tableInfo = await client.execute(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'homepage_why_choose_cards'",
  )

  const createSql = tableInfo.rows[0]?.sql
  if (!createSql || !String(createSql).includes("base_image")) {
    console.log("Why Choose cards table already migrated.")
    return
  }

  for (const statement of statements) {
    await client.execute(statement)
  }

  console.log("Migrated homepage_why_choose_cards to upload-based image schema.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    client.close()
  })

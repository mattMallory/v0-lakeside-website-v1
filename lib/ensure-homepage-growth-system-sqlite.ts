import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const homepageColumns: Array<{ name: string; definition: string }> = [
  { name: "template", definition: "text DEFAULT 'default' NOT NULL" },
  { name: "gs_hero_eyebrow", definition: "text" },
  { name: "gs_hero_headline", definition: "text" },
  { name: "gs_hero_headline_accent", definition: "text" },
  { name: "gs_hero_subheadline", definition: "text" },
  { name: "gs_hero_primary_cta", definition: "text" },
  { name: "gs_hero_secondary_cta", definition: "text" },
  { name: "gs_who_eyebrow", definition: "text" },
  { name: "gs_who_headline", definition: "text" },
  { name: "gs_who_description", definition: "text" },
  { name: "gs_who_disqualifier", definition: "text" },
  { name: "gs_funnel_eyebrow", definition: "text" },
  { name: "gs_funnel_headline", definition: "text" },
  { name: "gs_funnel_description", definition: "text" },
  { name: "gs_funnel_link_label", definition: "text" },
  { name: "gs_funnel_link_url", definition: "text" },
  { name: "gs_pillars_eyebrow", definition: "text" },
  { name: "gs_pillars_headline", definition: "text" },
  { name: "gs_pillars_description", definition: "text" },
  { name: "gs_included_eyebrow", definition: "text" },
  { name: "gs_included_headline", definition: "text" },
  { name: "gs_included_description", definition: "text" },
  { name: "gs_results_eyebrow", definition: "text" },
  { name: "gs_results_headline", definition: "text" },
  { name: "gs_results_placeholder", definition: "text" },
  { name: "gs_team_eyebrow", definition: "text" },
  { name: "gs_team_headline", definition: "text" },
  { name: "gs_team_description", definition: "text" },
  { name: "gs_team_image_id", definition: "integer REFERENCES media(id) ON DELETE set null ON UPDATE no action" },
  { name: "gs_team_image_url", definition: "text" },
  { name: "gs_team_image_alt", definition: "text" },
  { name: "gs_bg_hero_id", definition: "integer REFERENCES media(id) ON DELETE set null ON UPDATE no action" },
  { name: "gs_bg_who_id", definition: "integer REFERENCES media(id) ON DELETE set null ON UPDATE no action" },
  { name: "gs_bg_pillars_id", definition: "integer REFERENCES media(id) ON DELETE set null ON UPDATE no action" },
  { name: "gs_bg_included_id", definition: "integer REFERENCES media(id) ON DELETE set null ON UPDATE no action" },
  { name: "gs_team_placeholder", definition: "text" },
  { name: "gs_articles_eyebrow", definition: "text" },
  { name: "gs_articles_headline", definition: "text" },
  { name: "gs_articles_link_label", definition: "text" },
  { name: "gs_next_eyebrow", definition: "text" },
  { name: "gs_next_headline", definition: "text" },
  { name: "gs_audit_headline", definition: "text" },
  { name: "gs_audit_description", definition: "text" },
  { name: "gs_audit_button_label", definition: "text" },
  { name: "gs_audit_button_url", definition: "text" },
]

const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS homepage_gs_hero_stats (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    value text NOT NULL,
    label text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_who_criteria (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    icon text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_funnel_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    tag text NOT NULL,
    title text NOT NULL,
    detail text NOT NULL,
    button_label text NOT NULL,
    image_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action,
    image_url text,
    image_alt text,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_pillars (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    icon text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_included_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_testimonials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    photo_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action,
    photo_url text,
    photo_alt text,
    quote text NOT NULL,
    name text NOT NULL,
    practice text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_team_members (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    photo_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action,
    photo_url text,
    photo_alt text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    bio text NOT NULL,
    linkedin_url text,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_gs_next_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id text PRIMARY KEY NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON UPDATE no action ON DELETE cascade
  )`,
]

const indexStatements = [
  "CREATE INDEX IF NOT EXISTS homepage_gs_hero_stats_order_idx ON homepage_gs_hero_stats (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_hero_stats_parent_id_idx ON homepage_gs_hero_stats (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_who_criteria_order_idx ON homepage_gs_who_criteria (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_who_criteria_parent_id_idx ON homepage_gs_who_criteria (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_funnel_steps_order_idx ON homepage_gs_funnel_steps (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_funnel_steps_parent_id_idx ON homepage_gs_funnel_steps (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_funnel_steps_image_idx ON homepage_gs_funnel_steps (image_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_pillars_order_idx ON homepage_gs_pillars (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_pillars_parent_id_idx ON homepage_gs_pillars (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_included_items_order_idx ON homepage_gs_included_items (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_included_items_parent_id_idx ON homepage_gs_included_items (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_testimonials_order_idx ON homepage_gs_testimonials (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_testimonials_parent_id_idx ON homepage_gs_testimonials (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_testimonials_photo_idx ON homepage_gs_testimonials (photo_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_team_members_order_idx ON homepage_gs_team_members (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_team_members_parent_id_idx ON homepage_gs_team_members (_parent_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_team_members_photo_idx ON homepage_gs_team_members (photo_id)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_next_steps_order_idx ON homepage_gs_next_steps (_order)",
  "CREATE INDEX IF NOT EXISTS homepage_gs_next_steps_parent_id_idx ON homepage_gs_next_steps (_parent_id)",
]

async function columnExists(
  client: ReturnType<typeof createClient>,
  table: string,
  column: string,
) {
  const result = await client.execute(`PRAGMA table_info(${table})`)
  return result.rows.some((row) => row.name === column)
}

export async function ensureHomepageGrowthSystemSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    const hasTemplate = await columnExists(client, "homepage", "template")
    if (!hasTemplate) {
      await client.execute("PRAGMA foreign_keys=OFF")

      for (const column of homepageColumns) {
        await client.execute(`ALTER TABLE homepage ADD COLUMN ${column.name} ${column.definition}`)
      }

      for (const statement of createTableStatements) {
        await client.execute(statement)
      }

      for (const statement of indexStatements) {
        await client.execute(statement)
      }

      await client.execute("PRAGMA foreign_keys=ON")
      console.log("[payload] Migrated homepage growth system fields for sqlite.")
    }

    await ensureHomepageFunnelStepImagesSqlite(client)
    await ensureHomepageTestimonialPhotoSqlite(client)
    await ensureHomepageTeamImageSqlite(client)
  } catch (error) {
    console.error("[payload] Failed to ensure homepage growth system tables:", error)
  } finally {
    client.close()
  }
}

async function ensureHomepageFunnelStepImagesSqlite(client: ReturnType<typeof createClient>) {
  const tableExists = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'homepage_gs_funnel_steps'",
  )
  if (tableExists.rows.length === 0) return

  const hasImageId = await columnExists(client, "homepage_gs_funnel_steps", "image_id")
  if (hasImageId) return

  await client.execute("PRAGMA foreign_keys=OFF")
  await client.execute(
    "ALTER TABLE homepage_gs_funnel_steps ADD COLUMN image_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action",
  )
  await client.execute("ALTER TABLE homepage_gs_funnel_steps ADD COLUMN image_url text")
  await client.execute("ALTER TABLE homepage_gs_funnel_steps ADD COLUMN image_alt text")
  await client.execute(
    "CREATE INDEX IF NOT EXISTS homepage_gs_funnel_steps_image_idx ON homepage_gs_funnel_steps (image_id)",
  )
  await client.execute("PRAGMA foreign_keys=ON")
  console.log("[payload] Added funnel step image fields for sqlite.")
}

async function ensureHomepageTestimonialPhotoSqlite(client: ReturnType<typeof createClient>) {
  const tableExists = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'homepage_gs_testimonials'",
  )
  if (tableExists.rows.length === 0) return

  const hasPhotoId = await columnExists(client, "homepage_gs_testimonials", "photo_id")
  if (hasPhotoId) return

  await client.execute("PRAGMA foreign_keys=OFF")
  await client.execute(
    "ALTER TABLE homepage_gs_testimonials ADD COLUMN photo_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action",
  )
  await client.execute("ALTER TABLE homepage_gs_testimonials ADD COLUMN photo_url text")
  await client.execute("ALTER TABLE homepage_gs_testimonials ADD COLUMN photo_alt text")
  await client.execute(
    "CREATE INDEX IF NOT EXISTS homepage_gs_testimonials_photo_idx ON homepage_gs_testimonials (photo_id)",
  )
  await client.execute("PRAGMA foreign_keys=ON")
  console.log("[payload] Added testimonial photo fields for sqlite.")
}

async function ensureHomepageTeamImageSqlite(client: ReturnType<typeof createClient>) {
  const hasTeamImageId = await columnExists(client, "homepage", "gs_team_image_id")
  if (hasTeamImageId) return

  await client.execute("PRAGMA foreign_keys=OFF")
  await client.execute(
    "ALTER TABLE homepage ADD COLUMN gs_team_image_id integer REFERENCES media(id) ON DELETE set null ON UPDATE no action",
  )
  await client.execute("ALTER TABLE homepage ADD COLUMN gs_team_image_url text")
  await client.execute("ALTER TABLE homepage ADD COLUMN gs_team_image_alt text")
  await client.execute(
    "CREATE INDEX IF NOT EXISTS homepage_gs_team_image_idx ON homepage (gs_team_image_id)",
  )
  await client.execute("PRAGMA foreign_keys=ON")
  console.log("[payload] Added team image fields for sqlite.")
}

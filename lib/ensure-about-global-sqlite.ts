import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dbPath = path.join(root, "payload.db")

const teamMemberSocialColumns = [
  "linkedin_url",
  "youtube_url",
  "instagram_url",
  "x_url",
  "facebook_url",
] as const

const aboutBackgroundColumns = [
  "hero_background_id",
  "vision_mission_background_id",
  "case_study_background_id",
] as const

async function columnExists(client: ReturnType<typeof createClient>, table: string, column: string) {
  const result = await client.execute(`PRAGMA table_info(${table})`)
  return result.rows.some((row) => row.name === column)
}

export async function ensureAboutGlobalSqlite() {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL?.startsWith("postgres")) {
    return
  }

  const client = createClient({ url: `file:${dbPath}` })

  try {
    for (const column of teamMemberSocialColumns) {
      if (!(await columnExists(client, "about_team_members", column))) {
        await client.execute(`ALTER TABLE about_team_members ADD COLUMN ${column} TEXT`)
      }
    }

    for (const column of aboutBackgroundColumns) {
      if (!(await columnExists(client, "about", column))) {
        await client.execute(`ALTER TABLE about ADD COLUMN ${column} INTEGER`)
      }
    }
  } catch (error) {
    console.error("[payload] Failed to ensure about global columns:", error)
  } finally {
    client.close()
  }
}

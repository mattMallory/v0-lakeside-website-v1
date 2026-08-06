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
  } catch (error) {
    console.error("[payload] Failed to ensure about global columns:", error)
  } finally {
    client.close()
  }
}

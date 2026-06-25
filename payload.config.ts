import path from "path"
import { fileURLToPath } from "url"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Media } from "./collections/Media"
import { Users } from "./collections/Users"
import { Homepage } from "./globals/Homepage"
import { seedHomepageIfEmpty } from "./lib/seed-homepage"
import { migrations } from "./migrations"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function getPostgresUrl() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL
  )
}

const postgresUrl = getPostgresUrl()
const usePostgres = Boolean(postgresUrl)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  globals: [Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: postgresUrl,
        },
        prodMigrations: migrations,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || "file:./payload.db",
        },
      }),
  sharp,
  onInit: async (payload) => {
    await seedHomepageIfEmpty(payload)
  },
})

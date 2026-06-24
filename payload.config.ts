import path from "path"
import { fileURLToPath } from "url"
import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Media } from "./collections/Media"
import { Users } from "./collections/Users"
import { Homepage } from "./globals/Homepage"
import { seedHomepageIfEmpty } from "./lib/seed-homepage"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isVercel = process.env.VERCEL === "1"

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
  db: isVercel
    ? vercelPostgresAdapter()
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

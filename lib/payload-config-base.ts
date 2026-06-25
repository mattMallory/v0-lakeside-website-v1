import path from "path"
import { fileURLToPath } from "url"
import type { Config } from "payload"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Media } from "../collections/Media"
import { Users } from "../collections/Users"
import { Homepage } from "../globals/Homepage"
import { seedHomepageIfEmpty } from "./seed-homepage"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export function createPayloadConfig(
  db: Config["db"],
  options: {
    plugins?: Config["plugins"]
  } = {},
) {
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname, ".."),
      },
    },
    collections: [Users, Media],
    globals: [Homepage],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
      outputFile: path.resolve(dirname, "..", "payload-types.ts"),
    },
    db,
    ...(options.plugins ? { plugins: options.plugins } : {}),
    sharp,
    onInit: async (payload) => {
      await seedHomepageIfEmpty(payload)
    },
  })
}

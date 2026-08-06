import path from "path"
import { fileURLToPath } from "url"
import type { Config } from "payload"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Media } from "../collections/Media"
import { Categories } from "../collections/Categories"
import { Posts } from "../collections/Posts"
import { Tags } from "../collections/Tags"
import { Users } from "../collections/Users"
import { About } from "../globals/About"
import { Branding } from "../globals/Branding"
import { Homepage } from "../globals/Homepage"
import { Legal } from "../globals/Legal"
import { Navigation } from "../globals/Navigation"
import { Services } from "../globals/Services"
import { getSeoPlugin } from "./seo-plugin"
import { seedAboutIfEmpty } from "./seed-about"
import { seedBlogIfEmpty } from "./seed-blog"
import { seedBrandingIfEmpty } from "./seed-branding"
import { seedCaseStudyHighlightGlobal } from "./seed-case-study-highlight"
import { seedLegalIfEmpty } from "./seed-legal"
import { seedNavigationIfEmpty } from "./seed-navigation"
import { seedHomepageIfEmpty } from "./seed-homepage"
import { seedServicesIfEmpty } from "./seed-services"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Payload signs admin session tokens with this secret. An empty value is
 * publicly known, which would make those tokens forgeable, so refuse to build a
 * config rather than fall back to one.
 *
 * Callers that only need CMS content (the mapper layer in `lib/`) check
 * `PAYLOAD_SECRET` themselves and return defaults before importing this config,
 * so this throw is reached only when something is actually booting Payload —
 * the admin panel, the REST/GraphQL API, or a seeding/migration script.
 */
function requirePayloadSecret(): string {
  const secret = process.env.PAYLOAD_SECRET?.trim()

  if (!secret) {
    throw new Error(
      "PAYLOAD_SECRET is not set. Payload cannot start without it, because it signs admin session tokens.\n" +
        "  Local development: add PAYLOAD_SECRET to .env (any long random string, e.g. `openssl rand -hex 32`).\n" +
        "  Production: set PAYLOAD_SECRET in Vercel → Settings → Environment Variables, for both Production and Preview.",
    )
  }

  return secret
}

export function createPayloadConfig(
  db: Config["db"],
  options: {
    plugins?: Config["plugins"]
    beforeSeed?: () => Promise<void>
  } = {},
) {
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname, ".."),
      },
    },
    collections: [Users, Media, Categories, Tags, Posts],
    globals: [Branding, Homepage, About, Services, Legal, Navigation],
    editor: lexicalEditor(),
    secret: requirePayloadSecret(),
    typescript: {
      outputFile: path.resolve(dirname, "..", "payload-types.ts"),
    },
    db,
    plugins: [getSeoPlugin(), ...(options.plugins ?? [])],
    sharp,
    onInit: async (payload) => {
      try {
        if (options.beforeSeed) {
          await options.beforeSeed()
        }
        await seedBrandingIfEmpty(payload)
        await seedHomepageIfEmpty(payload)
        await seedAboutIfEmpty(payload)
        await seedServicesIfEmpty(payload)
        await seedLegalIfEmpty(payload)
        await seedNavigationIfEmpty(payload)
        await seedBlogIfEmpty(payload)
        await seedCaseStudyHighlightGlobal(payload, "homepage")
        await seedCaseStudyHighlightGlobal(payload, "about")
        await seedCaseStudyHighlightGlobal(payload, "services-page")
      } catch (error) {
        console.error("[payload] onInit seeding failed:", error)
      }
    },
  })
}

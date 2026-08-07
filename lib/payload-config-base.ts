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

/**
 * Runs one seeding step, logging and swallowing any failure so the remaining steps still
 * run. Seeding is best-effort: a global that cannot be seeded should not stop the others.
 */
async function runSeedStep(label: string, step: () => Promise<void>) {
  try {
    await step()
  } catch (error) {
    console.error(`[payload] Seed step "${label}" failed; continuing with the rest:`, error)
  }
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
      // Each step is isolated so one failure cannot skip the steps after it. Previously a
      // single try/catch wrapped the whole chain, which made the outcome depend on
      // ordering: anything after the first throw silently never ran.
      if (options.beforeSeed) {
        await runSeedStep("prepare database schema", options.beforeSeed)
      }
      await runSeedStep("branding", () => seedBrandingIfEmpty(payload))
      await runSeedStep("homepage", () => seedHomepageIfEmpty(payload))
      await runSeedStep("about", () => seedAboutIfEmpty(payload))
      await runSeedStep("services", () => seedServicesIfEmpty(payload))
      await runSeedStep("legal", () => seedLegalIfEmpty(payload))
      await runSeedStep("navigation", () => seedNavigationIfEmpty(payload))
      await runSeedStep("blog", () => seedBlogIfEmpty(payload))
      await runSeedStep("case study highlight (homepage)", () =>
        seedCaseStudyHighlightGlobal(payload, "homepage"),
      )
      await runSeedStep("case study highlight (about)", () =>
        seedCaseStudyHighlightGlobal(payload, "about"),
      )
      await runSeedStep("case study highlight (services)", () =>
        seedCaseStudyHighlightGlobal(payload, "services-page"),
      )
    },
  })
}

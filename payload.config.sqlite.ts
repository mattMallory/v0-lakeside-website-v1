import { sqliteAdapter } from "@payloadcms/db-sqlite"

import { ensureAboutGlobalSqlite } from "./lib/ensure-about-global-sqlite"
import { ensureCalendarGlobalSqlite } from "./lib/ensure-calendar-global-sqlite"
import { ensureCaseStudyHighlightGlobalsSqlite } from "./lib/ensure-case-study-highlight-globals-sqlite"
import { ensureHomepageGrowthSystemSqlite } from "./lib/ensure-homepage-growth-system-sqlite"
import { ensureLegalGlobalSqlite } from "./lib/ensure-legal-global-sqlite"
import { ensureNavigationGlobalSqlite } from "./lib/ensure-navigation-global-sqlite"
import { ensurePostsCaseStudySqlite } from "./lib/ensure-posts-case-study-sqlite"
import { ensureServicesGlobalSqlite } from "./lib/ensure-services-global-sqlite"
import { createPayloadConfig } from "./lib/payload-config-base"

async function ensureSqliteGlobals() {
  await ensureLegalGlobalSqlite()
  await ensureNavigationGlobalSqlite()
  await ensureServicesGlobalSqlite()
  await ensureHomepageGrowthSystemSqlite()
  await ensurePostsCaseStudySqlite()
  await ensureAboutGlobalSqlite()
  await ensureCaseStudyHighlightGlobalsSqlite()
  await ensureCalendarGlobalSqlite()
}

export default createPayloadConfig(
  sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  {
    beforeSeed: ensureSqliteGlobals,
  },
)

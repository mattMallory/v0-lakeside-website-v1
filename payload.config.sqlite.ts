import { sqliteAdapter } from "@payloadcms/db-sqlite"

import { createPayloadConfig } from "./lib/payload-config-base"

// Local development only — this config is selected when no Postgres URL is set and VERCEL
// is unset (see lib/db-url.ts). Production goes through payload.config.postgres.ts, whose
// adapter hard-codes push: false and takes its schema from migrations/.
//
// Push is on by default so a fresh clone gets a working database. Payload generates the
// whole local schema from this config, which is the only way local and the config can be
// guaranteed to agree — hand-written DDL can only ever match by coincidence, and used to
// leave the local database missing 28 of its 37 tables.
//
// Set PAYLOAD_DB_PUSH=false to opt out. Note that push asks for confirmation on the
// terminal before anything it considers destructive, so a non-interactive process that
// hits a destructive diff will wait for input rather than fail.
export default createPayloadConfig(
  sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
    push: process.env.PAYLOAD_DB_PUSH !== "false",
  }),
)

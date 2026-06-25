import { sqliteAdapter } from "@payloadcms/db-sqlite"

import { createPayloadConfig } from "./lib/payload-config-base"

export default createPayloadConfig(
  sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
  }),
)

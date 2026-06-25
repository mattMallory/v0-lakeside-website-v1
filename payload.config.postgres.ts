import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres"

import { getPayloadBlobPlugins } from "./lib/get-payload-blob-plugins"
import { getPostgresUrl } from "./lib/db-url"
import { createPayloadConfig } from "./lib/payload-config-base"

const postgresUrl = getPostgresUrl()

if (!postgresUrl) {
  throw new Error("Postgres URL is required for the production Payload config")
}

export default createPayloadConfig(
  vercelPostgresAdapter({
    pool: {
      connectionString: postgresUrl,
    },
  }),
  {
    plugins: getPayloadBlobPlugins(),
  },
)

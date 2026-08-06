import { shouldUsePostgresConfig } from "./lib/db-url"

const config = shouldUsePostgresConfig()
  ? (await import("./payload.config.postgres")).default
  : (await import("./payload.config.sqlite")).default

export default config

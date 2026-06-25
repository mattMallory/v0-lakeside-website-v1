import { getPostgresUrl } from "./lib/db-url"

const config = getPostgresUrl()
  ? (await import("./payload.config.postgres")).default
  : (await import("./payload.config.sqlite")).default

export default config

export function isPostgresUrl(url?: string | null): url is string {
  return Boolean(url?.startsWith("postgres://") || url?.startsWith("postgresql://"))
}

export function getPostgresUrl(): string | undefined {
  const candidates = [
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DATABASE_URL,
  ]

  return candidates.find(isPostgresUrl)
}

export function getPostgresMigrationUrl(): string | undefined {
  const candidates = [
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL,
  ]

  return candidates.find(isPostgresUrl)
}

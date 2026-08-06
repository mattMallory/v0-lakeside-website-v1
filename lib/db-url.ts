export function isPostgresUrl(url?: string | null): url is string {
  const value = url?.trim()
  return Boolean(value?.startsWith("postgres://") || value?.startsWith("postgresql://"))
}

function readPostgresCandidate(value?: string | null): string | undefined {
  const trimmed = value?.trim()
  return isPostgresUrl(trimmed) ? trimmed : undefined
}

function buildPostgresUrlFromParts(): string | undefined {
  const host = process.env.POSTGRES_HOST?.trim()
  const user = process.env.POSTGRES_USER?.trim()
  const password = process.env.POSTGRES_PASSWORD?.trim()
  const database = process.env.POSTGRES_DATABASE?.trim()

  if (!host || !user || !password || !database) {
    return undefined
  }

  const encodedUser = encodeURIComponent(user)
  const encodedPassword = encodeURIComponent(password)

  return `postgresql://${encodedUser}:${encodedPassword}@${host}/${database}?sslmode=require`
}

export function getPostgresUrl(): string | undefined {
  const candidates = [
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DATABASE_URL,
  ]

  for (const candidate of candidates) {
    const resolved = readPostgresCandidate(candidate)
    if (resolved) return resolved
  }

  return buildPostgresUrlFromParts()
}

export function getPostgresMigrationUrl(): string | undefined {
  const candidates = [
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL,
  ]

  for (const candidate of candidates) {
    const resolved = readPostgresCandidate(candidate)
    if (resolved) return resolved
  }

  return buildPostgresUrlFromParts()
}

export function shouldUsePostgresConfig(): boolean {
  return Boolean(getPostgresUrl() || process.env.VERCEL)
}

export function getPostgresEnvDiagnostics(): Record<string, boolean> {
  return {
    payloadSecret: Boolean(process.env.PAYLOAD_SECRET?.trim()),
    postgresUrl: Boolean(readPostgresCandidate(process.env.POSTGRES_URL)),
    postgresUrlNonPooling: Boolean(readPostgresCandidate(process.env.POSTGRES_URL_NON_POOLING)),
    postgresPrismaUrl: Boolean(readPostgresCandidate(process.env.POSTGRES_PRISMA_URL)),
    databaseUrl: Boolean(readPostgresCandidate(process.env.DATABASE_URL)),
    databaseUrlUnpooled: Boolean(readPostgresCandidate(process.env.DATABASE_URL_UNPOOLED)),
    postgresHostParts: Boolean(
      process.env.POSTGRES_HOST?.trim() &&
        process.env.POSTGRES_USER?.trim() &&
        process.env.POSTGRES_PASSWORD?.trim() &&
        process.env.POSTGRES_DATABASE?.trim(),
    ),
    resolvedPostgresUrl: Boolean(getPostgresUrl()),
    vercel: Boolean(process.env.VERCEL),
  }
}

const MAX_URL_LENGTH = 2000
const MAX_FIELD_LENGTH = 500

export type GhlFormFields = Record<string, string | number | boolean | null | undefined>

/**
 * Build a Go High Level form URL with query parameters that map to hidden fields.
 * Parameter keys must match each field's Unique Key / Query Key in GHL exactly.
 */
export function buildGhlFormUrl(baseUrl: string, fields: GhlFormFields): string {
  const url = new URL(baseUrl)

  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined) continue

    const stringValue = String(value).trim()
    if (!stringValue) continue

    url.searchParams.set(key, truncateField(stringValue))
  }

  const href = url.toString()
  if (href.length > MAX_URL_LENGTH) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[ghl-form] URL length (${href.length}) exceeds ${MAX_URL_LENGTH} chars. ` +
          "Consider shortening long field values or using the GHL API instead.",
      )
    }
  }

  return href
}

function truncateField(value: string): string {
  if (value.length <= MAX_FIELD_LENGTH) return value
  return `${value.slice(0, MAX_FIELD_LENGTH - 1)}…`
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

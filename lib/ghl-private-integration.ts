const GHL_API_BASE = "https://services.leadconnectorhq.com"
const GHL_API_VERSION = "2021-07-28"

export type GhlCustomField = {
  id: string
  /** GHL upsert API expects `field_value`, not `value`. */
  field_value: string
  key?: string
}

export type GhlUpsertContactInput = {
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  companyName?: string
  source?: string
  tags?: string[]
  customFields?: GhlCustomField[]
}

export type GhlConfig = {
  token: string
  locationId: string
}

export class GhlConfigError extends Error {
  constructor() {
    super("GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID must be set on the server.")
    this.name = "GhlConfigError"
  }
}

export class GhlApiError extends Error {
  status: number

  constructor(status: number, detail: string) {
    super(`GoHighLevel API error (${status}): ${detail}`)
    this.name = "GhlApiError"
    this.status = status
  }
}

export function getGhlConfig(): GhlConfig | null {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim()
  const locationId = process.env.GHL_LOCATION_ID?.trim()

  if (!token || !locationId) {
    return null
  }

  return { token, locationId }
}

/**
 * Create or update a contact via Private Integration (contacts.write scope).
 * Uses upsert so repeat submissions from the same email do not create duplicates.
 */
export async function upsertGhlContact(input: GhlUpsertContactInput): Promise<unknown> {
  const config = getGhlConfig()
  if (!config) {
    throw new GhlConfigError()
  }

  const email = input.email?.trim()
  const phone = input.phone?.trim()

  if (!email && !phone) {
    throw new Error("At least one of email or phone is required for GHL contact upsert.")
  }

  const body: Record<string, unknown> = {
    locationId: config.locationId,
    firstName: input.firstName?.trim() || undefined,
    lastName: input.lastName?.trim() || undefined,
    name: input.name?.trim() || undefined,
    email: email || undefined,
    phone: phone || undefined,
    companyName: input.companyName?.trim() || undefined,
    source: input.source?.trim() || "Lakeside Website",
    tags: input.tags?.length ? input.tags : undefined,
    customFields: input.customFields?.length ? input.customFields : undefined,
  }

  const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  let parsed: unknown = text

  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    // keep raw text for error logging
  }

  if (!response.ok) {
    const detail =
      typeof parsed === "object" && parsed !== null && "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : text || response.statusText
    throw new GhlApiError(response.status, detail)
  }

  return parsed
}

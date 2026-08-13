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

export type GhlContactNoteInput = {
  body: string
  title?: string
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

/** Parse contact id from upsert / search responses (shape varies slightly). */
export function extractGhlContactId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined

  const root = payload as Record<string, unknown>

  const contact = root.contact
  if (contact && typeof contact === "object") {
    const id = (contact as Record<string, unknown>).id
    if (typeof id === "string" && id.trim()) return id.trim()
  }

  if (typeof root.id === "string" && root.id.trim()) return root.id.trim()
  if (typeof root.contactId === "string" && root.contactId.trim()) return root.contactId.trim()

  return undefined
}

export async function findGhlContactIdByEmailOrPhone(
  email?: string,
  phone?: string,
): Promise<string | undefined> {
  const config = getGhlConfig()
  if (!config) return undefined

  const trimmedEmail = email?.trim()
  const trimmedPhone = phone?.trim()
  if (!trimmedEmail && !trimmedPhone) return undefined

  const params = new URLSearchParams({ locationId: config.locationId })
  if (trimmedEmail) params.set("email", trimmedEmail)
  if (trimmedPhone) params.set("number", trimmedPhone)

  const response = await fetch(
    `${GHL_API_BASE}/contacts/search/duplicate?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Version: GHL_API_VERSION,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  )

  if (!response.ok) return undefined

  const text = await response.text()
  try {
    const parsed = text ? JSON.parse(text) : null
    return extractGhlContactId(parsed)
  } catch {
    return undefined
  }
}

export async function resolveGhlContactId(
  upsertResult: unknown,
  email?: string,
  phone?: string,
): Promise<string | undefined> {
  const fromUpsert = extractGhlContactId(upsertResult)
  if (fromUpsert) return fromUpsert

  return findGhlContactIdByEmailOrPhone(email, phone)
}

export async function updateGhlContact(
  contactId: string,
  input: Pick<GhlUpsertContactInput, "customFields">,
): Promise<unknown> {
  const config = getGhlConfig()
  if (!config) {
    throw new GhlConfigError()
  }

  if (!input.customFields?.length) {
    throw new Error("customFields are required for contact update.")
  }

  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      customFields: input.customFields,
    }),
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

/**
 * Attach a note to a contact (contacts scope). Used when a message cannot map to a custom field.
 */
export async function createGhlContactNote(
  contactId: string,
  input: GhlContactNoteInput,
): Promise<unknown> {
  const config = getGhlConfig()
  if (!config) {
    throw new GhlConfigError()
  }

  const body = input.body?.trim()
  if (!body) {
    throw new Error("Note body is required.")
  }

  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      body,
      title: input.title?.trim() || undefined,
    }),
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

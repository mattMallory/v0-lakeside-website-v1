import type { GhlConfig, GhlCustomField } from "@/lib/ghl-private-integration"
import { getGhlConfig } from "@/lib/ghl-private-integration"

const GHL_API_BASE = "https://services.leadconnectorhq.com"
const GHL_API_VERSION = "2021-07-28"
const FIELD_ID_CACHE_TTL_MS = 5 * 60 * 1000

type CustomFieldIdCache = {
  map: Map<string, string>
  fetchedAt: number
}

let customFieldIdCache: CustomFieldIdCache | null = null

function normalizeCustomFieldKey(fieldKey: string): string {
  const trimmed = fieldKey.trim()
  const dotIndex = trimmed.lastIndexOf(".")
  return dotIndex >= 0 ? trimmed.slice(dotIndex + 1) : trimmed
}

function envCustomFieldId(uniqueKey: string): string | undefined {
  const envName = `GHL_CF_${uniqueKey.toUpperCase()}`
  return process.env[envName]?.trim() || undefined
}

function parseCustomFieldList(payload: unknown): Array<{ id: string; fieldKey: string }> {
  if (!payload || typeof payload !== "object") return []

  const root = payload as Record<string, unknown>
  const list = Array.isArray(root.customFields)
    ? root.customFields
    : Array.isArray(payload)
      ? payload
      : []

  const fields: Array<{ id: string; fieldKey: string }> = []

  for (const item of list) {
    if (!item || typeof item !== "object") continue

    const record = item as Record<string, unknown>
    const id = typeof record.id === "string" ? record.id.trim() : ""
    const fieldKey =
      typeof record.fieldKey === "string"
        ? record.fieldKey.trim()
        : typeof record.key === "string"
          ? record.key.trim()
          : ""

    if (id && fieldKey) {
      fields.push({ id, fieldKey })
    }
  }

  return fields
}

async function fetchCustomFieldIdMap(config: GhlConfig): Promise<Map<string, string>> {
  const now = Date.now()

  if (
    customFieldIdCache &&
    now - customFieldIdCache.fetchedAt < FIELD_ID_CACHE_TTL_MS
  ) {
    return customFieldIdCache.map
  }

  const response = await fetch(
    `${GHL_API_BASE}/locations/${config.locationId}/customFields`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Version: GHL_API_VERSION,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  )

  const text = await response.text()
  let parsed: unknown = null

  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = null
  }

  if (!response.ok) {
    const detail =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : text || response.statusText

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ghl] Could not load custom field IDs (${response.status}): ${detail}`)
    }

    return customFieldIdCache?.map ?? new Map()
  }

  const map = new Map<string, string>()

  for (const field of parseCustomFieldList(parsed)) {
    map.set(normalizeCustomFieldKey(field.fieldKey), field.id)
    map.set(field.fieldKey, field.id)
  }

  customFieldIdCache = { map, fetchedAt: now }
  return map
}

async function resolveCustomFieldId(
  uniqueKey: string,
  idMap: Map<string, string>,
): Promise<string | undefined> {
  const fromEnv = envCustomFieldId(uniqueKey)
  if (fromEnv) return fromEnv

  return idMap.get(uniqueKey) ?? idMap.get(`contact.${uniqueKey}`)
}

/**
 * Maps GHL custom field Unique Keys to field IDs, then builds the API payload.
 *
 * Resolution order per key:
 * 1. GHL_CF_<UNIQUE_KEY> env var (e.g. patient_value → GHL_CF_PATIENT_VALUE)
 * 2. Auto-fetch from GET /locations/{id}/customFields (cached 5 min)
 */
export async function buildCustomFieldsFromKeys(
  fields: Record<string, string | number | boolean | null | undefined>,
): Promise<GhlCustomField[]> {
  const config = getGhlConfig()
  const idMap = config ? await fetchCustomFieldIdMap(config) : new Map<string, string>()

  const customFields: GhlCustomField[] = []
  const unresolved: string[] = []

  for (const [uniqueKey, rawValue] of Object.entries(fields)) {
    if (rawValue === null || rawValue === undefined) continue

    const field_value = String(rawValue).trim()
    if (!field_value) continue

    const fieldId = await resolveCustomFieldId(uniqueKey, idMap)
    if (!fieldId) {
      unresolved.push(uniqueKey)
      continue
    }

    customFields.push({
      id: fieldId,
      key: uniqueKey,
      field_value,
    })
  }

  if (unresolved.length && process.env.NODE_ENV !== "production") {
    console.warn(
      `[ghl] Custom fields skipped (no ID found): ${unresolved.join(", ")}. ` +
        "Create them in GHL or set GHL_CF_<KEY> env vars.",
    )
  }

  return customFields
}

export type SubmitGhlContactPayload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  source?: string
  tags?: string[]
  /** Keys must match GHL custom field Unique Keys (mapped server-side via GHL_CF_* env). */
  customFields?: Record<string, string>
}

export type SubmitGhlContactResult = {
  ok: boolean
  contactId?: string
  error?: string
}

/**
 * Submit a native HTML form to the server-side GHL Private Integration proxy.
 * Never put your Private Integration token in the browser.
 */
export async function submitGhlContact(
  payload: SubmitGhlContactPayload,
): Promise<SubmitGhlContactResult> {
  const response = await fetch("/api/ghl/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as SubmitGhlContactResult | null

  if (!response.ok) {
    return {
      ok: false,
      error: data?.error ?? `Request failed (${response.status})`,
    }
  }

  return data ?? { ok: true }
}

import { NextResponse } from "next/server"

import { buildCustomFieldsFromKeys } from "@/lib/ghl-custom-field-ids"
import { isValidEmail } from "@/lib/ghl-form"
import {
  GhlApiError,
  GhlConfigError,
  getGhlConfig,
  upsertGhlContact,
} from "@/lib/ghl-private-integration"

type ContactRequestBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  source?: string
  tags?: string[]
  customFields?: Record<string, string>
}

function parseTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const tags = value.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
  return tags.length ? tags : undefined
}

function parseCustomFields(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object") return undefined

  const fields: Record<string, string> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw !== "string") continue
    const trimmed = raw.trim()
    if (!trimmed) continue
    fields[key] = trimmed
  }

  return Object.keys(fields).length ? fields : undefined
}

export async function POST(request: Request) {
  if (!getGhlConfig()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "GoHighLevel is not configured. Set GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID on the server.",
      },
      { status: 503 },
    )
  }

  let body: ContactRequestBody

  try {
    body = (await request.json()) as ContactRequestBody
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const phone = typeof body.phone === "string" ? body.phone.trim() : ""

  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "Email or phone is required." },
      { status: 400 },
    )
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 })
  }

  const customFieldKeys = parseCustomFields(body.customFields)
  const customFields = customFieldKeys ? await buildCustomFieldsFromKeys(customFieldKeys) : []

  try {
    const result = await upsertGhlContact({
      firstName: body.firstName,
      lastName: body.lastName,
      email: email || undefined,
      phone: phone || undefined,
      companyName: body.companyName,
      source: body.source,
      tags: parseTags(body.tags),
      customFields: customFields.length ? customFields : undefined,
    })

    const contactId =
      typeof result === "object" &&
      result !== null &&
      "contact" in result &&
      typeof (result as { contact?: { id?: string } }).contact?.id === "string"
        ? (result as { contact: { id: string } }).contact.id
        : undefined

    return NextResponse.json({ ok: true, contactId })
  } catch (error) {
    if (error instanceof GhlConfigError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 })
    }

    if (error instanceof GhlApiError) {
      console.error("[ghl/contact]", error.message)
      return NextResponse.json(
        { ok: false, error: "Could not save your request. Please try again or contact us directly." },
        { status: error.status >= 500 ? 502 : 400 },
      )
    }

    console.error("[ghl/contact]", error)
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 })
  }
}

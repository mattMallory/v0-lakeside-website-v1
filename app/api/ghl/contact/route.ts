import { NextResponse } from "next/server"

import { buildCustomFieldsFromKeys } from "@/lib/ghl-custom-field-ids"
import { isValidEmail } from "@/lib/ghl-form"
import {
  GHL_CONSULTATION_FIELD_KEYS,
  GHL_CONSULTATION_MESSAGE_ALIASES,
  GHL_CONSULTATION_NOTE_TITLE,
  getConsultationMessageFieldId,
} from "@/lib/ghl-consultation"
import {
  GHL_GROWTH_ASSESSMENT_NOTE_TITLE,
  GHL_GROWTH_ASSESSMENT_SOURCE,
} from "@/lib/ghl-growth-assessment"
import {
  createGhlContactNote,
  GhlApiError,
  GhlConfigError,
  getGhlConfig,
  resolveGhlContactId,
  updateGhlContact,
  upsertGhlContact,
} from "@/lib/ghl-private-integration"

type ContactRequestBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  city?: string
  state?: string
  source?: string
  tags?: string[]
  note?: string
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
  let customFields = customFieldKeys
    ? await buildCustomFieldsFromKeys(customFieldKeys, {
        keyAliases: {
          [GHL_CONSULTATION_FIELD_KEYS.message]: [...GHL_CONSULTATION_MESSAGE_ALIASES],
        },
      })
    : []

  const noteBody = typeof body.note === "string" ? body.note.trim() : ""
  const messageKey = GHL_CONSULTATION_FIELD_KEYS.message
  const messageText = customFieldKeys?.[messageKey]
  const directMessageFieldId = getConsultationMessageFieldId()

  if (messageText && directMessageFieldId) {
    customFields = [
      ...customFields.filter((field) => field.key !== messageKey),
      {
        id: directMessageFieldId,
        key: messageKey,
        field_value: messageText,
      },
    ]
  }

  try {
    const result = await upsertGhlContact({
      firstName: body.firstName,
      lastName: body.lastName,
      email: email || undefined,
      phone: phone || undefined,
      companyName: body.companyName,
      city: body.city,
      state: body.state,
      source: body.source,
      tags: parseTags(body.tags),
    })

    const contactId = await resolveGhlContactId(result, email || undefined, phone || undefined)

    if (!contactId) {
      console.error("[ghl/contact] upsert succeeded but contact id could not be resolved", result)
      return NextResponse.json(
        {
          ok: false,
          error: "Could not save your request. Please try again or contact us directly.",
        },
        { status: 502 },
      )
    }

    if (customFields.length) {
      try {
        await updateGhlContact(contactId, { customFields })
      } catch (updateError) {
        console.error("[ghl/contact] custom field update failed", updateError)
      }
    }

    if (noteBody) {
      const noteTitle =
        body.source?.trim() === GHL_GROWTH_ASSESSMENT_SOURCE
          ? GHL_GROWTH_ASSESSMENT_NOTE_TITLE
          : GHL_CONSULTATION_NOTE_TITLE

      try {
        await createGhlContactNote(contactId, {
          title: noteTitle,
          body: noteBody,
        })
      } catch (noteError) {
        console.error("[ghl/contact] note creation failed (contact saved)", noteError)
      }
    }

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

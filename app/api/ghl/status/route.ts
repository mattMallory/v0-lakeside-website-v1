import { NextResponse } from "next/server"

import {
  GhlApiError,
  GhlConfigError,
  getGhlConfig,
  getGhlLocationSummary,
} from "@/lib/ghl-private-integration"

/**
 * Quick check that Vercel env vars point at the expected GHL sub-account.
 * Visit /api/ghl/status after deploy — name/city/state should match your CRM.
 */
export async function GET() {
  if (!getGhlConfig()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error:
          "GoHighLevel is not configured. Set GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID.",
      },
      { status: 503 },
    )
  }

  try {
    const location = await getGhlLocationSummary()

    return NextResponse.json({
      ok: true,
      configured: true,
      location,
    })
  } catch (error) {
    if (error instanceof GhlConfigError) {
      return NextResponse.json({ ok: false, configured: false, error: error.message }, { status: 503 })
    }

    if (error instanceof GhlApiError) {
      console.error("[ghl/status]", error.message)
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error:
            "Could not verify the connected GoHighLevel sub-account. Check that the Private Integration token is valid and has locations.readonly scope.",
        },
        { status: error.status >= 500 ? 502 : 400 },
      )
    }

    console.error("[ghl/status]", error)
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 })
  }
}

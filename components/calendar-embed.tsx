"use client"

import Script from "next/script"
import { useMemo } from "react"

type ParsedEmbed = {
  iframeSrc: string | null
  iframeTitle: string
  iframeHeight: string
  scriptSrc: string | null
}

function parseEmbedCode(embedCode: string): ParsedEmbed {
  const iframeSrcMatch = embedCode.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  const iframeTitleMatch = embedCode.match(/<iframe[^>]*\stitle=["']([^"']+)["']/i)
  const iframeHeightMatch = embedCode.match(/<iframe[^>]*\sheight=["']([^"']+)["']/i)
  const scriptSrcMatch = embedCode.match(/<script[^>]*\ssrc=["']([^"']+)["']/i)

  return {
    iframeSrc: iframeSrcMatch?.[1] ?? null,
    iframeTitle: iframeTitleMatch?.[1] ?? "Schedule calendar",
    iframeHeight: iframeHeightMatch?.[1] ?? "700",
    scriptSrc: scriptSrcMatch?.[1] ?? null,
  }
}

export function CalendarEmbed({ embedCode }: { embedCode: string }) {
  const parsed = useMemo(() => parseEmbedCode(embedCode), [embedCode])

  if (!embedCode.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className="font-brand-display text-lg font-bold text-heading">Calendar embed not configured yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          In Payload Admin, open <span className="font-medium text-heading">Calendar Page</span> and paste your
          Go High Level calendar embed code.
        </p>
      </div>
    )
  }

  if (!parsed.iframeSrc) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center">
        <p className="text-sm text-destructive">
          Could not find an iframe in the embed code. Paste the full GHL calendar embed snippet (including the
          iframe).
        </p>
      </div>
    )
  }

  const heightValue = Number.parseInt(parsed.iframeHeight, 10)
  const minHeight = Number.isFinite(heightValue) ? Math.max(heightValue, 480) : 700

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border">
      <iframe
        src={parsed.iframeSrc}
        title={parsed.iframeTitle}
        className="w-full border-0"
        style={{ minHeight }}
        loading="lazy"
        allow="camera; microphone; fullscreen; payment"
      />
      {parsed.scriptSrc ? (
        <Script src={parsed.scriptSrc} strategy="afterInteractive" />
      ) : (
        <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
      )}
    </div>
  )
}

"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  GHL_CONSULTATION_FIELD_KEYS,
  GHL_CONSULTATION_SOURCE,
  GHL_CONSULTATION_TAGS,
} from "@/lib/ghl-consultation"
import { submitGhlContact } from "@/lib/submit-ghl-contact"
import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-body text-heading outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

function GhlEmbedConsultationForm() {
  return (
    <>
      <div className="min-h-[952px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-raised ring-1 ring-border">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/MyXndz0NrZDQljBcy9Xq"
          id="inline-MyXndz0NrZDQljBcy9Xq"
          title="Schedule a consultation"
          data-layout='{"id":"INLINE"}'
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Form 1"
          data-height="952"
          data-layout-iframe-id="inline-MyXndz0NrZDQljBcy9Xq"
          data-form-id="MyXndz0NrZDQljBcy9Xq"
          className="h-[952px] w-full border-0"
        />
      </div>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  )
}

function NativeConsultationForm() {
  const [mounted, setMounted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [practiceName, setPracticeName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrorMessage(null)

    const trimmedMessage = message.trim()

    const result = await submitGhlContact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      phone,
      companyName: practiceName,
      source: GHL_CONSULTATION_SOURCE,
      tags: [...GHL_CONSULTATION_TAGS],
      note: trimmedMessage || undefined,
      customFields: trimmedMessage
        ? { [GHL_CONSULTATION_FIELD_KEYS.message]: trimmedMessage }
        : undefined,
    })

    if (!result.ok) {
      setStatus("error")
      setErrorMessage(result.error ?? "Something went wrong. Please try again.")
      return
    }

    setStatus("success")
  }

  if (!mounted) {
    return (
      <div
        className="rounded-2xl border border-border bg-card p-6 shadow-raised ring-1 ring-border md:p-8 min-h-[420px]"
        aria-busy="true"
        aria-label="Loading consultation form"
      />
    )
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-raised ring-1 ring-border md:p-10">
        <h2 className="font-brand-display text-2xl font-bold text-heading">Thanks — we&apos;ll be in touch.</h2>
        <p className="mt-3 text-muted-foreground">
          We received your consultation request and will reply within one business day.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-raised ring-1 ring-border md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="consult-first-name" className="mb-1.5 block text-body font-medium text-heading">
            First name
          </label>
          <input
            id="consult-first-name"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="consult-last-name" className="mb-1.5 block text-body font-medium text-heading">
            Last name
          </label>
          <input
            id="consult-last-name"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="consult-email" className="mb-1.5 block text-body font-medium text-heading">
            Email
          </label>
          <input
            id="consult-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="consult-phone" className="mb-1.5 block text-body font-medium text-heading">
            Phone
          </label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="consult-practice" className="mb-1.5 block text-body font-medium text-heading">
            Practice name
          </label>
          <input
            id="consult-practice"
            name="companyName"
            type="text"
            className={fieldClass}
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="consult-message" className="mb-1.5 block text-body font-medium text-heading">
            What would you like help with?
          </label>
          <textarea
            id="consult-message"
            name="message"
            rows={4}
            className={cn(fieldClass, "resize-y min-h-[120px]")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-4 text-body text-destructive" role="alert">{errorMessage}</p>
      ) : null}

      <Button type="submit" className="mt-6 w-full md:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request consultation"}
      </Button>
    </form>
  )
}

/**
 * Consultation capture: native HTML form → Private Integration API, or legacy GHL iframe.
 * Mode is chosen on the server (see consultation/page.tsx).
 */
export function ConsultationForm({ mode }: { mode: "native" | "embed" }) {
  if (mode === "native") {
    return <NativeConsultationForm />
  }

  return <GhlEmbedConsultationForm />
}

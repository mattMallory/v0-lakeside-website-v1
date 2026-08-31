"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[15px] text-heading outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

export type GhlNativeEmailCaptureValues = {
  firstName: string
  email: string
}

type GhlNativeEmailCaptureProps = {
  title?: string
  description?: string
  buttonLabel?: string
  successTitle?: string
  successMessage?: string
  disabled?: boolean
  disabledMessage?: string
  onSubmit: (values: GhlNativeEmailCaptureValues) => Promise<{ ok: boolean; error?: string }>
  className?: string
  tone?: "light" | "dark"
}

export function GhlNativeEmailCapture({
  title,
  description,
  buttonLabel = "Send",
  successTitle = "Thanks — check your inbox.",
  successMessage,
  disabled = false,
  disabledMessage,
  onSubmit,
  className,
  tone = "light",
}: GhlNativeEmailCaptureProps) {
  const [mounted, setMounted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const titleClass =
    tone === "dark" ? "text-sm font-medium text-[#94A3B8]" : "text-sm font-medium text-muted-foreground"
  const descriptionClass =
    tone === "dark" ? "text-xs leading-relaxed text-[#64748B]" : "text-xs leading-relaxed text-muted-foreground"
  const waitingClass =
    tone === "dark" ? "text-xs leading-relaxed text-[#64748B]" : "text-xs leading-relaxed text-muted-foreground"

  if (!mounted) {
    return (
      <div
        className={cn("min-h-[280px] rounded-[11px]", className)}
        aria-busy="true"
        aria-label="Loading email form"
      />
    )
  }

  if (disabled && disabledMessage) {
    return (
      <div className={cn("rounded-[11px] px-2 py-4", className)}>
        <p className={cn("text-center", waitingClass)}>{disabledMessage}</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-[11px] px-2 py-4 text-center", className)}>
        <p className={cn("font-semibold", tone === "dark" ? "text-white" : "text-heading")}>
          {successTitle}
        </p>
        {successMessage ? (
          <p className={cn("mt-2 text-sm", tone === "dark" ? "text-[#94A3B8]" : "text-muted-foreground")}>
            {successMessage}
          </p>
        ) : null}
      </div>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrorMessage(null)

    const result = await onSubmit({
      firstName: firstName.trim(),
      email: email.trim(),
    })

    if (!result.ok) {
      setStatus("error")
      setErrorMessage(result.error ?? "Something went wrong. Please try again.")
      return
    }

    setStatus("success")
  }

  return (
    <form onSubmit={handleSubmit} className={cn("rounded-[11px]", className)}>
      {title ? <div className={cn("mb-3", titleClass)}>{title}</div> : null}
      {description ? <p className={cn("mb-4", descriptionClass)}>{description}</p> : null}

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="ghl-native-first-name" className="sr-only">
            First name
          </label>
          <input
            id="ghl-native-first-name"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First name"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={status === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="ghl-native-email" className="sr-only">
            Email
          </label>
          <input
            id="ghl-native-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            data-lpignore="true"
            data-1p-ignore
            className={fieldClass}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "submitting"}
          />
        </div>
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className={cn("mt-3 w-full", tone === "dark" && "rounded-full")}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : buttonLabel}
      </Button>
    </form>
  )
}

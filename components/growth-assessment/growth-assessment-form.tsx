"use client"

import { useEffect, useMemo, useState } from "react"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  GHL_GROWTH_ASSESSMENT_SOURCE,
  GHL_GROWTH_ASSESSMENT_TAGS,
} from "@/lib/ghl-growth-assessment"
import { submitGhlContact } from "@/lib/submit-ghl-contact"
import { cn } from "@/lib/utils"

type GrowthAssessmentFormProps = {
  ctaLabel: string
  showInvestmentStep: boolean
  investmentOptions: string[]
  processingSteps: string[]
}

type FormFields = {
  website: string
  location: string
  service: string
  goal: string
  value: string
  first: string
  last: string
  email: string
  phone: string
  invest: string
}

const STEP_HINTS = ["Your practice", "What to grow", "Patient value", "Where to send it", "Optional"]
const STORAGE_KEY = "lk-bga-form"

const formCardClass =
  "scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border md:p-8"

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[15px] text-heading outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

const labelClass = "mb-1.5 block text-sm font-medium text-heading"

const investOptionClass =
  "rounded-xl border border-border bg-white px-4 py-3 text-left text-[15px] font-medium text-heading transition-colors hover:border-primary/40"

const emptyFields: FormFields = {
  website: "",
  location: "",
  service: "",
  goal: "",
  value: "",
  first: "",
  last: "",
  email: "",
  phone: "",
  invest: "",
}

function fmtPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10)
  if (digits.length > 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  if (digits.length > 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return digits
}

function fmtMoney(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 7)
  return digits ? `$${Number(digits).toLocaleString()}` : ""
}

function validateStep(step: number, fields: FormFields) {
  const errs: Partial<Record<keyof FormFields, string>> = {}

  if (step === 0) {
    if (!fields.website.trim()) errs.website = "Please enter your practice website."
    else if (!/\./.test(fields.website)) errs.website = "That doesn't look like a web address yet."
    if (!fields.location.trim()) errs.location = "Please enter your primary location."
  }

  if (step === 1) {
    if (!fields.service.trim()) errs.service = "Please enter the service you want to grow."
    if (!fields.goal.trim() || !(parseInt(fields.goal.replace(/\D/g, ""), 10) > 0)) {
      errs.goal = "Please enter a number of new patients per month."
    }
  }

  if (step === 2 && !fields.value.trim()) {
    errs.value = "An estimate is fine — even a rough one."
  }

  if (step === 3) {
    if (!fields.first.trim()) errs.first = "Required."
    if (!fields.last.trim()) errs.last = "Required."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Please enter a valid email address."
    }
    if (fields.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Please enter a 10-digit phone number."
    }
  }

  return errs
}

export function GrowthAssessmentForm({
  ctaLabel,
  showInvestmentStep,
  investmentOptions,
  processingSteps,
}: GrowthAssessmentFormProps) {
  const totalSteps = showInvestmentStep ? 5 : 4
  const lastRequiredStep = 3

  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(0)
  const [fields, setFields] = useState<FormFields>(emptyFields)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as {
        f?: FormFields
        step?: number
      } | null
      if (saved?.f) {
        setFields({ ...emptyFields, ...saved.f })
        setStep(Math.min(saved.step ?? 0, 4))
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!submitted) return

    const timer = window.setInterval(() => {
      setDone((current) => {
        if (current >= processingSteps.length) {
          window.clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, 1100)

    return () => window.clearInterval(timer)
  }, [submitted, processingSteps.length])

  function persist(nextFields: FormFields, nextStep: number) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ f: nextFields, step: nextStep }))
    } catch {
      // ignore
    }
  }

  function updateField(key: keyof FormFields, raw: string) {
    let value = raw
    if (key === "phone") value = fmtPhone(raw)
    if (key === "value") value = fmtMoney(raw)
    if (key === "goal") value = raw.replace(/[^\d]/g, "").slice(0, 4)

    const next = { ...fields, [key]: value }
    setFields(next)
    setErrors((current) => ({ ...current, [key]: "" }))
    persist(next, step)
  }

  function normalizeWebsite() {
    let value = fields.website.trim()
    if (value && !/^https?:\/\//i.test(value)) value = `https://${value}`
    value = value.replace(/\/+$/, "")
    const next = { ...fields, website: value }
    setFields(next)
    persist(next, step)
  }

  async function submitAssessment(override?: Partial<FormFields>) {
    setSubmitError(null)
    const payloadFields = { ...fields, ...override }

    const note = [
      `Website: ${payloadFields.website}`,
      `Location: ${payloadFields.location}`,
      `Primary service: ${payloadFields.service}`,
      `New patients goal: ${payloadFields.goal}/mo`,
      `New patient value: ${payloadFields.value}`,
      payloadFields.invest ? `Investment range: ${payloadFields.invest}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const result = await submitGhlContact({
      firstName: payloadFields.first,
      lastName: payloadFields.last,
      email: payloadFields.email,
      phone: payloadFields.phone,
      source: GHL_GROWTH_ASSESSMENT_SOURCE,
      tags: [...GHL_GROWTH_ASSESSMENT_TAGS],
      note,
    })

    if (!result.ok) {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
      return
    }

    if (override) {
      setFields(payloadFields)
    }

    setSubmitted(true)
    persist(payloadFields, step)
  }

  function handleNext() {
    const errs = validateStep(step, fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const isLastRequired = step === lastRequiredStep
    if (step === 4 || (isLastRequired && !showInvestmentStep)) {
      void submitAssessment()
      return
    }

    const nextStep = step + 1
    setStep(nextStep)
    setErrors({})
    persist(fields, nextStep)
  }

  function handleBack() {
    if (step === 0) return
    const nextStep = step - 1
    setStep(nextStep)
    setErrors({})
    persist(fields, nextStep)
  }

  const onFinalStep = step === 4 || (step === lastRequiredStep && !showInvestmentStep)
  const nextLabel = useMemo(() => {
    if (onFinalStep) return ctaLabel
    if (step === lastRequiredStep && showInvestmentStep) return "Continue"
    return "Next"
  }, [ctaLabel, onFinalStep, showInvestmentStep, step, lastRequiredStep])

  if (submitted) {
    return (
      <div className={cn(formCardClass, "flex min-h-[430px] flex-col")}>
        <p className="font-brand-display text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
          Assessment started
        </p>
        <h3 className="font-brand-display text-balance text-2xl font-bold text-heading">
          Building your growth plan
        </h3>
        <div className="mt-5 flex flex-col gap-3">
          {processingSteps.map((label, index) => {
            const complete = index < done
            const active = index === done && done < processingSteps.length
            return (
              <div
                key={label}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ opacity: index <= done ? 1 : 0.35 }}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white transition-colors",
                    complete ? "bg-primary" : active ? "bg-primary/70" : "bg-[#E5E7EB]",
                  )}
                >
                  {complete ? "✓" : ""}
                </span>
                <span className="text-[15px] text-heading">{label}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-auto rounded-xl border border-border bg-[#EFF6FF] p-4 text-sm leading-relaxed text-muted-foreground">
          {done >= processingSteps.length
            ? `Research is underway. Your personalized growth plan will be sent to ${fields.email || "your email"} — typically within two business days.`
            : `This uses only your website and public market data. We'll also email your plan to ${fields.email || "you"}.`}
        </p>
      </div>
    )
  }

  return (
    <div className={cn(formCardClass, "flex min-h-[430px] flex-col")}>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-brand-display text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
            Step {step + 1} of {totalSteps}
          </p>
          <p className="text-sm text-muted-foreground">{STEP_HINTS[step]}</p>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                index <= step ? "bg-primary" : "bg-[#E5E7EB]",
              )}
            />
          ))}
        </div>
      </div>

      {step === 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <h3 className="font-brand-display text-balance text-[21px] font-bold tracking-[-0.02em] text-heading">
            What practice should we assess?
          </h3>
          <label htmlFor="bga-website" className={cn(labelClass, "mt-5")}>
            Practice website
          </label>
          <input
            id="bga-website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="yourpractice.com"
            value={fields.website}
            onChange={(event) => updateField("website", event.target.value)}
            onBlur={normalizeWebsite}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.website}
          </p>
          <label htmlFor="bga-location" className={labelClass}>
            Primary location
          </label>
          <input
            id="bga-location"
            type="text"
            autoComplete="address-level2"
            placeholder="City, State"
            value={fields.location}
            onChange={(event) => updateField("location", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.location}
          </p>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <h3 className="font-brand-display text-balance text-[21px] font-bold tracking-[-0.02em] text-heading">
            What service do you want to grow?
          </h3>
          <label htmlFor="bga-service" className={cn(labelClass, "mt-5")}>
            Primary service
          </label>
          <input
            id="bga-service"
            type="text"
            placeholder="e.g. Chiropractic care, acupuncture, functional medicine"
            value={fields.service}
            onChange={(event) => updateField("service", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.service}
          </p>
          <label htmlFor="bga-goal" className={labelClass}>
            Desired additional new patients per month
          </label>
          <input
            id="bga-goal"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 15"
            value={fields.goal}
            onChange={(event) => updateField("goal", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.goal}
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <h3 className="font-brand-display text-balance text-[21px] font-bold tracking-[-0.02em] text-heading">
            What is a new patient worth to the practice?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            An estimate is fine — first-visit value or the typical value of a full care plan. This
            anchors your budget scenarios.
          </p>
          <label htmlFor="bga-value" className={cn(labelClass, "mt-5")}>
            Approximate new-patient value
          </label>
          <input
            id="bga-value"
            type="text"
            inputMode="numeric"
            placeholder="$700"
            value={fields.value}
            onChange={(event) => updateField("value", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.value}
          </p>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <h3 className="font-brand-display text-balance text-[21px] font-bold tracking-[-0.02em] text-heading">
            How should we send your growth plan?
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <div>
              <label htmlFor="bga-first" className={labelClass}>
                First name
              </label>
              <input
                id="bga-first"
                type="text"
                autoComplete="given-name"
                value={fields.first}
                onChange={(event) => updateField("first", event.target.value)}
                className={fieldClass}
              />
              <p className="min-h-5 text-sm text-destructive" role="alert">
                {errors.first}
              </p>
            </div>
            <div>
              <label htmlFor="bga-last" className={labelClass}>
                Last name
              </label>
              <input
                id="bga-last"
                type="text"
                autoComplete="family-name"
                value={fields.last}
                onChange={(event) => updateField("last", event.target.value)}
                className={fieldClass}
              />
              <p className="min-h-5 text-sm text-destructive" role="alert">
                {errors.last}
              </p>
            </div>
          </div>
          <label htmlFor="bga-email" className={labelClass}>
            Email
          </label>
          <input
            id="bga-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@yourpractice.com"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.email}
          </p>
          <label htmlFor="bga-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="bga-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 555-1234"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClass}
          />
          <p className="min-h-5 text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        </div>
      ) : null}

      {step === 4 && showInvestmentStep ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <h3 className="font-brand-display text-balance text-[21px] font-bold tracking-[-0.02em] text-heading">
            What level of monthly investment feels realistic?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Optional — it helps us tailor the scenarios. You can skip this.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {investmentOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateField("invest", option)}
                className={cn(
                  investOptionClass,
                  fields.invest === option && "border-primary bg-[#EFF6FF] shadow-[inset_0_0_0_1px_#2563A8]",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {submitError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {step === 4 && showInvestmentStep ? (
            <button
              type="button"
              onClick={() => void submitAssessment({ invest: "" })}
              className="text-sm font-medium text-muted-foreground underline underline-offset-2"
            >
              Skip this question
            </button>
          ) : null}
          <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
            {nextLabel}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {onFinalStep ? "Submitting begins your assessment." : "Your progress is saved on this device."}
      </p>
    </div>
  )
}

export function GrowthAssessmentHowNote({ note }: { note: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border border-[#D9E6F4] bg-[#F4F8FC] px-[18px] py-3.5 text-[14.5px] text-[#374151]">
      <Lock className="h-[18px] w-[18px] shrink-0 text-primary" strokeWidth={2} />
      <span>{note}</span>
    </div>
  )
}

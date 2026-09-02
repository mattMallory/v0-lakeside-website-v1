"use client"

import Link from "next/link"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  buildConsultationCustomFields,
  buildConsultationSummary,
  CONSULTATION_ACQUISITION_TIMELINE,
  CONSULTATION_GROWTH_CHALLENGES,
  CONSULTATION_MARKETING_INVESTMENT,
  CONSULTATION_MONTHLY_NEW_PATIENT_LEADS,
  CONSULTATION_NEW_PATIENT_CAPACITY,
  CONSULTATION_PAID_ADVERTISING,
  CONSULTATION_PRACTICE_TYPES,
  defaultConsultationFormState,
  toggleMultiSelectOption,
  togglePaidAdvertisingSelection,
  US_STATES,
  type ConsultationFormState,
  type ConsultationPaidAdvertising,
} from "@/lib/consultation-form"
import {
  defaultConsultationPageContent,
  type ConsultationPageContent,
} from "@/lib/consultation-page-defaults"
import {
  GHL_CONSULTATION_SOURCE,
  GHL_CONSULTATION_TAGS,
} from "@/lib/ghl-consultation"
import { isValidEmail } from "@/lib/ghl-form"
import {
  CONSULTATION_CONVERSION_FLAG,
  CONSULTATION_THANK_YOU_PATH,
} from "@/lib/google-ads"
import { submitGhlContact } from "@/lib/submit-ghl-contact"
import { cn } from "@/lib/utils"

type ConsultationConsentCopy = Pick<
  ConsultationPageContent,
  | "smsNonMarketingConsentLabel"
  | "smsMarketingConsentLabel"
  | "privacyLinkLabel"
  | "termsLinkLabel"
>

const TOTAL_STEPS = 3

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[15px] text-heading outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

const optionClass =
  "flex w-full cursor-pointer items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left text-[15px] text-heading transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-[#EFF6FF]"

function GhlEmbedConsultationForm() {
  return (
    <>
      <div className="min-h-[952px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border">
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

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-brand-display text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
          Step {step} of {TOTAL_STEPS}
        </p>
        <p className="text-sm text-muted-foreground">
          {step === 1 ? "About you" : step === 2 ? "Your practice" : "Your marketing"}
        </p>
      </div>
      <div className="flex gap-2" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const current = index + 1
          return (
            <span
              key={current}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                current <= step ? "bg-primary" : "bg-[#E5E7EB]",
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

function RadioOptionList({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: readonly string[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-labelledby={`${name}-label`}>
      {options.map((option) => {
        const id = `${name}-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        return (
          <label key={option} htmlFor={id} className={optionClass}>
            <input
              id={id}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>{option}</span>
          </label>
        )
      })}
    </div>
  )
}

function CheckboxOptionList({
  name,
  options,
  values,
  onToggle,
}: {
  name: string
  options: readonly string[]
  values: string[]
  onToggle: (option: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5" role="group" aria-labelledby={`${name}-label`}>
      {options.map((option) => {
        const id = `${name}-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        const checked = values.includes(option)
        return (
          <label key={option} htmlFor={id} className={optionClass}>
            <input
              id={id}
              type="checkbox"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onToggle(option)}
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>{option}</span>
          </label>
        )
      })}
    </div>
  )
}

function NativeConsultationForm({ consent }: { consent: ConsultationConsentCopy }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [state, setState] = useState<ConsultationFormState>(defaultConsultationFormState)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  function scrollFormToTop() {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  function updateField<K extends keyof ConsultationFormState>(key: K, value: ConsultationFormState[K]) {
    setState((current) => ({ ...current, [key]: value }))
  }

  function validateStep(currentStep: number): string | null {
    if (currentStep === 1) {
      if (!state.firstName.trim() || !state.lastName.trim()) return "Please enter your first and last name."
      if (!isValidEmail(state.email)) return "Please enter a valid email address."
      if (!state.phone.trim()) return "Please enter your phone number."
      if (!state.practiceName.trim()) return "Please enter your practice name."
      if (!state.practiceWebsite.trim()) return "Please enter your practice website."
      if (!state.city.trim()) return "Please enter your city."
      if (!state.state) return "Please select your state."
      return null
    }

    if (currentStep === 2) {
      if (!state.practiceType.length) return "Please select at least one practice type."
      if (!state.growthChallenge) return "Please select your biggest growth challenge."
      if (state.growthChallenge === "Other" && !state.growthChallengeOther.trim()) {
        return "Please describe your biggest growth challenge."
      }
      if (!state.monthlyNewPatientLeads) {
        return "Please select how many new patient leads you currently get each month."
      }
      if (!state.newPatientCapacity) return "Please select how many additional new patients you could serve."
      return null
    }

    if (currentStep === 3) {
      if (!state.paidAdvertising.length) return "Please select at least one advertising option."
      if (!state.marketingInvestment) return "Please select your current marketing investment."
      if (!state.acquisitionTimeline) return "Please select when you’d like to improve patient acquisition."
      return null
    }

    return null
  }

  function goNext() {
    const validationError = validateStep(step)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }
    setErrorMessage(null)
    setStep((current) => Math.min(TOTAL_STEPS, current + 1))
    scrollFormToTop()
  }

  function goBack() {
    setErrorMessage(null)
    setStep((current) => Math.max(1, current - 1))
    scrollFormToTop()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateStep(3)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setStatus("submitting")
    setErrorMessage(null)

    const summary = buildConsultationSummary(state)

    const result = await submitGhlContact({
      firstName: state.firstName.trim(),
      lastName: state.lastName.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      companyName: state.practiceName.trim(),
      city: state.city.trim(),
      state: state.state,
      source: GHL_CONSULTATION_SOURCE,
      tags: [...GHL_CONSULTATION_TAGS],
      note: summary,
      customFields: buildConsultationCustomFields(state),
    })

    if (!result.ok) {
      setStatus("error")
      setErrorMessage(result.error ?? "Something went wrong. Please try again.")
      return
    }

    // Flag real submissions so the thank-you page can fire Google Ads conversion once.
    try {
      sessionStorage.setItem(CONSULTATION_CONVERSION_FLAG, "1")
    } catch {
      // sessionStorage unavailable — thank-you page still works; conversion may not fire.
    }

    setStatus("success")
    router.push(CONSULTATION_THANK_YOU_PATH)
  }

  if (!mounted) {
    return (
      <div
        className="min-h-[520px] rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border md:p-8"
        aria-busy="true"
        aria-label="Loading consultation form"
      />
    )
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm ring-1 ring-border md:p-10">
        <h2 className="font-brand-display text-2xl font-bold text-heading">Thanks — we&apos;ll be in touch.</h2>
        <p className="mt-3 text-muted-foreground">Redirecting…</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border md:p-8"
      noValidate
    >
      <StepProgress step={step} />

      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="consult-first-name" className="mb-1.5 block text-sm font-medium text-heading">
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
                value={state.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-last-name" className="mb-1.5 block text-sm font-medium text-heading">
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
                value={state.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-email" className="mb-1.5 block text-sm font-medium text-heading">
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
                value={state.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-phone" className="mb-1.5 block text-sm font-medium text-heading">
                Phone number
              </label>
              <input
                id="consult-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                data-lpignore="true"
                data-1p-ignore
                className={fieldClass}
                value={state.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-practice" className="mb-1.5 block text-sm font-medium text-heading">
                Practice name
              </label>
              <input
                id="consult-practice"
                name="companyName"
                type="text"
                required
                className={fieldClass}
                value={state.practiceName}
                onChange={(e) => updateField("practiceName", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-website" className="mb-1.5 block text-sm font-medium text-heading">
                Practice website
              </label>
              <input
                id="consult-website"
                name="practiceWebsite"
                type="url"
                required
                placeholder="https://"
                autoComplete="url"
                className={fieldClass}
                value={state.practiceWebsite}
                onChange={(e) => updateField("practiceWebsite", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-city" className="mb-1.5 block text-sm font-medium text-heading">
                City
              </label>
              <input
                id="consult-city"
                name="city"
                type="text"
                required
                autoComplete="address-level2"
                className={fieldClass}
                value={state.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="consult-state" className="mb-1.5 block text-sm font-medium text-heading">
                State
              </label>
              <select
                id="consult-state"
                name="state"
                required
                autoComplete="address-level1"
                className={fieldClass}
                value={state.state}
                onChange={(e) => updateField("state", e.target.value)}
              >
                <option value="">Select a state</option>
                {US_STATES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-6">
            {consent.smsNonMarketingConsentLabel ? (
              <label htmlFor="sms-non-marketing-consent" className="flex cursor-pointer items-start gap-3">
                <input
                  id="sms-non-marketing-consent"
                  name="smsNonMarketingConsent"
                  type="checkbox"
                  checked={state.smsNonMarketingConsent}
                  onChange={(e) => updateField("smsNonMarketingConsent", e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {consent.smsNonMarketingConsentLabel}
                </span>
              </label>
            ) : null}

            {consent.smsMarketingConsentLabel ? (
              <label htmlFor="sms-marketing-consent" className="flex cursor-pointer items-start gap-3">
                <input
                  id="sms-marketing-consent"
                  name="smsMarketingConsent"
                  type="checkbox"
                  checked={state.smsMarketingConsent}
                  onChange={(e) => updateField("smsMarketingConsent", e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {consent.smsMarketingConsentLabel}
                </span>
              </label>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-8">
          <div>
            <p id="practice-type-label" className="mb-1.5 text-sm font-medium text-heading">
              What type of practice do you operate?
            </p>
            <p className="mb-3 text-sm text-muted-foreground">Select all that apply.</p>
            <CheckboxOptionList
              name="practice-type"
              options={CONSULTATION_PRACTICE_TYPES}
              values={state.practiceType}
              onToggle={(option) =>
                updateField(
                  "practiceType",
                  toggleMultiSelectOption(state.practiceType, option as ConsultationFormState["practiceType"][number]),
                )
              }
            />
          </div>

          <div>
            <p id="growth-challenge-label" className="mb-3 text-sm font-medium text-heading">
              What is your biggest growth challenge?
            </p>
            <RadioOptionList
              name="growth-challenge"
              options={CONSULTATION_GROWTH_CHALLENGES}
              value={state.growthChallenge}
              onChange={(next) => {
                updateField("growthChallenge", next as ConsultationFormState["growthChallenge"])
                if (next !== "Other") {
                  updateField("growthChallengeOther", "")
                }
              }}
            />
            {state.growthChallenge === "Other" ? (
              <div className="mt-3">
                <label
                  htmlFor="growth-challenge-other"
                  className="mb-1.5 block text-sm font-medium text-heading"
                >
                  Please describe your biggest growth challenge
                </label>
                <textarea
                  id="growth-challenge-other"
                  name="growthChallengeOther"
                  rows={3}
                  required
                  className={cn(fieldClass, "min-h-[96px] resize-y")}
                  value={state.growthChallengeOther}
                  onChange={(e) => updateField("growthChallengeOther", e.target.value)}
                />
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="monthly-new-patient-leads"
              id="monthly-new-patient-leads-label"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              How many new patient leads are you currently getting a month?
            </label>
            <select
              id="monthly-new-patient-leads"
              name="monthlyNewPatientLeads"
              required
              className={fieldClass}
              value={state.monthlyNewPatientLeads}
              onChange={(e) =>
                updateField(
                  "monthlyNewPatientLeads",
                  e.target.value as ConsultationFormState["monthlyNewPatientLeads"],
                )
              }
            >
              <option value="">Select an option</option>
              {CONSULTATION_MONTHLY_NEW_PATIENT_LEADS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="new-patient-capacity"
              id="new-patient-capacity-label"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              How many additional new patients could you serve each month?
            </label>
            <select
              id="new-patient-capacity"
              name="newPatientCapacity"
              required
              className={fieldClass}
              value={state.newPatientCapacity}
              onChange={(e) =>
                updateField(
                  "newPatientCapacity",
                  e.target.value as ConsultationFormState["newPatientCapacity"],
                )
              }
            >
              <option value="">Select an option</option>
              {CONSULTATION_NEW_PATIENT_CAPACITY.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-8">
          <div>
            <p id="paid-advertising-label" className="mb-1.5 text-sm font-medium text-heading">
              Are you currently running paid advertising?
            </p>
            <p className="mb-3 text-sm text-muted-foreground">Select all that apply.</p>
            <CheckboxOptionList
              name="paid-advertising"
              options={CONSULTATION_PAID_ADVERTISING}
              values={state.paidAdvertising}
              onToggle={(option) =>
                updateField(
                  "paidAdvertising",
                  togglePaidAdvertisingSelection(
                    state.paidAdvertising,
                    option as ConsultationPaidAdvertising,
                  ),
                )
              }
            />
          </div>

          <div>
            <p id="marketing-investment-label" className="mb-3 text-sm font-medium text-heading">
              What are you currently investing in marketing each month?
            </p>
            <RadioOptionList
              name="marketing-investment"
              options={CONSULTATION_MARKETING_INVESTMENT}
              value={state.marketingInvestment}
              onChange={(next) =>
                updateField("marketingInvestment", next as ConsultationFormState["marketingInvestment"])
              }
            />
          </div>

          <div>
            <p id="acquisition-timeline-label" className="mb-3 text-sm font-medium text-heading">
              When would you like to improve your patient acquisition?
            </p>
            <RadioOptionList
              name="acquisition-timeline"
              options={CONSULTATION_ACQUISITION_TIMELINE}
              value={state.acquisitionTimeline}
              onChange={(next) =>
                updateField("acquisitionTimeline", next as ConsultationFormState["acquisitionTimeline"])
              }
            />
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="mt-5 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={goBack} disabled={status === "submitting"}>
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < TOTAL_STEPS ? (
          <Button type="button" onClick={goNext} className="w-full sm:w-auto">
            Continue
          </Button>
        ) : (
          <Button type="submit" className="w-full sm:w-auto" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Schedule Growth Consultation"}
          </Button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
          {consent.privacyLinkLabel}
        </Link>
        <span className="mx-2 text-border" aria-hidden>
          |
        </span>
        <Link href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
          {consent.termsLinkLabel}
        </Link>
      </p>
    </form>
  )
}

/**
 * Consultation capture: native HTML form → Private Integration API, or legacy GHL iframe.
 * Mode is chosen on the server (see consultation/page.tsx).
 */
export function ConsultationForm({
  mode,
  consent = defaultConsultationPageContent,
}: {
  mode: "native" | "embed"
  consent?: ConsultationConsentCopy
}) {
  if (mode === "native") {
    return <NativeConsultationForm consent={consent} />
  }

  return <GhlEmbedConsultationForm />
}

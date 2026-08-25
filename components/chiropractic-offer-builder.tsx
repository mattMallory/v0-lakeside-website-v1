"use client"

import { ArrowRight, Check } from "lucide-react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { GhlNativeEmailCapture } from "@/components/ghl-native-email-capture"
import { buildOfferBuilderFieldValues } from "@/lib/offer-builder-ghl"
import { GHL_OFFER_BUILDER_SOURCE, GHL_OFFER_BUILDER_TAGS } from "@/lib/ghl-offer-builder"
import { submitGhlContact } from "@/lib/submit-ghl-contact"
import {
  OFFER_BUILDER_ACTIONS,
  OFFER_BUILDER_AUDIENCES,
  OFFER_BUILDER_CONCERNS,
  OFFER_BUILDER_FIRST_STEPS,
  OFFER_BUILDER_HAPPENS_OPTS,
  OFFER_BUILDER_PRICES,
  OFFER_BUILDER_TAKEAWAYS,
  computeOfferClarity,
  computeOfferPreview,
  defaultOfferBuilderState,
  effectiveConcern,
  lc,
  type OfferBuilderState,
} from "@/lib/offer-builder"
import { attachOfferBuilderFormListeners, offerInputId } from "@/lib/offer-builder-dom"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    __lakesideOfferBuilderSyncState?: (state: OfferBuilderState) => void
    __lakesideOfferBuilderPendingState?: OfferBuilderState
  }
}

function StepCard({
  step,
  title,
  hint,
  children,
}: {
  step: number
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-card border border-border bg-white p-5 md:p-[22px]">
      <div className="mb-1.5 flex items-center gap-3">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-lake-pale font-brand-display text-body font-bold text-primary"
        >
          {step}
        </span>
        <label className="font-brand-display text-[17px] font-bold tracking-[-0.01em] text-heading">
          {title}
        </label>
      </div>
      {hint ? (
        <p className="mb-3.5 ml-10 text-[13px] leading-snug text-muted-foreground-subtle">{hint}</p>
      ) : null}
      <div className="ml-0 md:ml-10">{children}</div>
    </div>
  )
}

type OfferBuilderClarity = ReturnType<typeof computeOfferClarity>

function OfferBuilderClarityPanel({ clarity }: { clarity: OfferBuilderClarity }) {
  return (
    <div
      data-ob="clarity"
      className="offer-builder-clarity rounded-card border border-border bg-white px-5 py-5 md:px-[22px]"
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <span className="font-brand-display text-[11px] font-bold uppercase tracking-eyebrow text-muted-foreground">
          Offer clarity
        </span>
        <span
          data-ob-clarity-badge
          data-ob-ready="false"
          className="offer-builder-clarity-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-brand-display text-xs font-bold bg-muted text-muted-foreground-subtle"
        >
          In progress
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {(
          [
            ["Audience", "audience", clarity.audience],
            ["Experience", "experience", clarity.experience],
            ["Value", "value", clarity.value],
            ["Next step", "nextStep", clarity.nextStep],
          ] as const
        ).map(([label, key, ok]) => (
          <div key={label} className="flex items-center justify-between text-body">
            <span className="font-medium text-secondary-button-foreground">{label}</span>
            <span
              data-ob-clarity-item={key}
              data-ob-clear={ok ? "true" : "false"}
              className={cn(
                "offer-builder-clarity-status inline-flex items-center gap-1 text-[13px] font-bold",
                ok ? "text-[#15803D]" : "text-muted-foreground-subtle",
              )}
            >
              {ok ? (
                <>
                  <Check className="size-3.5" strokeWidth={3} />
                  Clear
                </>
              ) : (
                "Add it"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OfferBuilderEmailPanel({ clarity, state }: { clarity: OfferBuilderClarity; state: OfferBuilderState }) {
  return (
    <div className="offer-builder-email">
      <GhlNativeEmailCapture
        className="rounded-card border border-border bg-white px-4 py-4"
        buttonLabel="Email me this offer"
        successTitle="Offer saved — check your inbox."
        successMessage="We emailed your offer summary with all the details you built above."
        disabled={!clarity.ready}
        disabledMessage="Complete all four offer clarity checks above to unlock the email form. Your answers will be included automatically."
        onSubmit={async (email) =>
          submitGhlContact({
            email,
            source: GHL_OFFER_BUILDER_SOURCE,
            tags: [...GHL_OFFER_BUILDER_TAGS],
            customFields: buildOfferBuilderFieldValues({
              state,
              pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
            }),
          })
        }
      />
    </div>
  )
}

export function ChiropracticOfferBuilder({ embedded = false }: { embedded?: boolean }) {
  const [state, setState] = useState<OfferBuilderState>(defaultOfferBuilderState)
  const [formKey, setFormKey] = useState(0)

  const formRef = useRef<HTMLDivElement>(null)
  const previewPanelRef = useRef<HTMLDivElement>(null)
  const setStateRef = useRef(setState)
  setStateRef.current = setState

  const clarity = useMemo(() => computeOfferClarity(state), [state])
  const preview = useMemo(() => computeOfferPreview(state), [state])
  const concern = effectiveConcern(state)

  useLayoutEffect(() => {
    const applyPendingState = () => {
      const pending = window.__lakesideOfferBuilderPendingState
      if (pending) {
        setStateRef.current(pending)
        delete window.__lakesideOfferBuilderPendingState
      }
    }

    window.__lakesideOfferBuilderSyncState = (next) => {
      setStateRef.current(next)
    }

    applyPendingState()

    return () => {
      delete window.__lakesideOfferBuilderSyncState
    }
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    const frame = window.requestAnimationFrame(() => {
      const root = formRef.current
      if (!root) return
      cleanup = attachOfferBuilderFormListeners(root, (updater) => {
        setStateRef.current(updater)
      })
    })
    return () => {
      window.cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [formKey])

  function reset() {
    setState(defaultOfferBuilderState)
    setFormKey((current) => current + 1)
  }

  return (
    <section
      id="offer-builder"
      className={cn(embedded ? "bg-transparent" : "border-y border-border bg-white")}
    >
      <div className="mx-auto max-w-[1080px] px-6 py-14 md:py-16">
        <div className="mb-8 text-center md:mb-[34px]">
          <p className="font-brand-display text-[11px] font-semibold uppercase tracking-eyebrow text-primary">
            Interactive · Offer builder
          </p>
          <h2 className="font-brand-display mt-3.5 text-balance text-[clamp(1.75rem,4vw,2.625rem)] font-bold leading-display tracking-display text-heading">
            Build a better chiropractic advertising offer
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-pretty text-[17px] leading-normal text-muted-foreground">
            Make six clear choices. Turn a vague promotion into an offer patients can understand — it
            updates live as you go.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center md:mb-[34px]">
          <div className="relative w-full max-w-[360px] rounded-card border-[1.5px] border-dashed border-secondary-button bg-background p-5 md:px-6 md:py-[22px]">
            <span
              className="absolute right-4 top-3.5 rounded-full border border-[#F6D79E] bg-[#FDEBCB] px-2 py-0.5 font-brand-display text-[10px] font-bold uppercase tracking-eyebrow text-[#B45309]"
            >
              Vague
            </span>
            <p className="mb-2 font-brand-display text-[11px] font-semibold uppercase tracking-eyebrow text-muted-foreground-subtle">
              Starting point
            </p>
            <p className="mb-3.5 font-brand-display text-2xl font-bold tracking-display text-muted-foreground">
              Free Consultation
            </p>
            <p className="mb-2 text-xs font-bold uppercase tracking-eyebrow text-[#B45309]">
              Why it feels weak
            </p>
            <div className="flex flex-col gap-1 text-body text-muted-foreground-subtle">
              <span>Who is it for?</span>
              <span>What happens?</span>
              <span>Why should someone respond?</span>
              <span>What happens next?</span>
            </div>
          </div>
          <svg
            width="26"
            height="40"
            viewBox="0 0 26 40"
            fill="none"
            stroke="#2563A8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="my-3"
            aria-hidden
          >
            <path d="M13 2v30" />
            <path d="M5 25l8 9 8-9" />
          </svg>
          <p className="font-brand-display text-[13px] font-bold tracking-eyebrow text-primary">
            Rebuild it below
          </p>
        </div>

        <div className="offer-builder-layout grid items-start gap-7 lg:grid-cols-[1fr_400px]">
          <div
            key={formKey}
            ref={formRef}
            className="offer-builder-form relative z-[1] flex flex-col gap-4"
          >
            <StepCard
              step={1}
              title="Who is this offer for?"
              hint="Choose a recognizable audience — not everyone."
            >
              <select
                id="ob-audience"
                defaultValue=""
                className="offer-builder-select w-full rounded-sq border-[1.5px] border-secondary-button bg-white px-3.5 py-3 text-body text-heading"
              >
                <option value="">Select an audience</option>
                {OFFER_BUILDER_AUDIENCES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </StepCard>

            <StepCard
              step={2}
              title="What concern, situation, or goal does this address?"
              hint="Pick a chip or type your own — keep it specific and respectful."
            >
              <div className="mb-3 flex flex-wrap gap-2">
                {OFFER_BUILDER_CONCERNS.map((option) => {
                  const inputId = offerInputId("concern", option)

                  return (
                    <div key={option} className="offer-builder-chip-option">
                      <input
                        type="radio"
                        id={inputId}
                        name="ob-concern"
                        value={option}
                        className="offer-builder-native-input"
                      />
                      <label
                        htmlFor={inputId}
                        data-ob-field="concern"
                        data-ob-value={option}
                        className="offer-builder-chip-label"
                      >
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
              <input
                id="ob-concern-custom"
                type="text"
                defaultValue=""
                placeholder="Or describe a specific concern…"
                className="offer-builder-concern-custom w-full rounded-sq border-[1.5px] border-secondary-button bg-white px-3.5 py-3 text-body text-heading placeholder:text-muted-foreground-subtle"
              />
            </StepCard>

            <StepCard
              step={3}
              title="What is the first step?"
              hint="Name the appointment — not just “consultation.”"
            >
              <select
                id="ob-first-step"
                defaultValue=""
                className="offer-builder-select w-full rounded-sq border-[1.5px] border-secondary-button bg-white px-3.5 py-3 text-body text-heading"
              >
                <option value="">Select a first step</option>
                {OFFER_BUILDER_FIRST_STEPS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </StepCard>

            <StepCard
              step={4}
              title="What happens during the visit?"
              hint="Select 2–3 things that actually happen — don't overpromise."
            >
              <div className="flex flex-wrap gap-2">
                {OFFER_BUILDER_HAPPENS_OPTS.map((option) => {
                  const inputId = offerInputId("happen", option)

                  return (
                    <div key={option} className="offer-builder-chip-option">
                      <input
                        type="checkbox"
                        id={inputId}
                        name="ob-happen"
                        value={option}
                        className="offer-builder-native-input"
                      />
                      <label
                        htmlFor={inputId}
                        data-ob-field="happen"
                        data-ob-value={option}
                        className="offer-builder-chip-label"
                      >
                        <Check
                          className="offer-builder-chip-check size-3.5 shrink-0"
                          strokeWidth={3}
                          aria-hidden
                        />
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
            </StepCard>

            <StepCard
              step={5}
              title="What will the person gain from this visit?"
              hint="Focus on clarity and fit — not guaranteed outcomes."
            >
              <div className="flex flex-col gap-2">
                {OFFER_BUILDER_TAKEAWAYS.map((option) => {
                  const inputId = offerInputId("takeaway", option)

                  return (
                    <div key={option} className="offer-builder-radio-option w-full">
                      <input
                        type="radio"
                        id={inputId}
                        name="ob-takeaway"
                        value={option}
                        className="offer-builder-native-input"
                      />
                      <label
                        htmlFor={inputId}
                        data-ob-field="takeaway"
                        data-ob-value={option}
                        className="offer-builder-radio-label"
                      >
                        <span className="offer-builder-radio-ring flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-secondary-button bg-white">
                          <span className="offer-builder-radio-dot size-2.5 rounded-full bg-transparent" />
                        </span>
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
            </StepCard>

            <StepCard
              step={6}
              title="What should they do next?"
              hint="One clear action — then optionally add price context."
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {OFFER_BUILDER_ACTIONS.map((option) => {
                  const inputId = offerInputId("action", option)

                  return (
                    <div key={option} className="offer-builder-action-option min-w-0 flex-1 basis-[130px]">
                      <input
                        type="radio"
                        id={inputId}
                        name="ob-action"
                        value={option}
                        className="offer-builder-native-input"
                      />
                      <label
                        htmlFor={inputId}
                        data-ob-field="action"
                        data-ob-value={option}
                        className="offer-builder-action-label"
                      >
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-eyebrow text-muted-foreground-subtle">
                Optional · price or commitment
              </p>
              <div className="flex flex-wrap gap-2">
                {OFFER_BUILDER_PRICES.map((option) => {
                  const inputId = offerInputId("price", option)

                  return (
                    <div key={option} className="offer-builder-chip-option">
                      <input
                        type="checkbox"
                        id={inputId}
                        name="ob-price"
                        value={option}
                        className="offer-builder-native-input"
                      />
                      <label
                        htmlFor={inputId}
                        data-ob-field="price"
                        data-ob-value={option}
                        className="offer-builder-chip-label"
                      >
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
            </StepCard>
          </div>

          <div
            ref={previewPanelRef}
            className="offer-builder-preview z-20 flex flex-col gap-3.5 md:sticky md:top-20 md:h-fit md:self-start"
          >
            <div
              data-ob="offercard"
              className="rounded-[18px] bg-ink px-5 py-6 shadow-raised md:px-7 md:py-[30px]"
            >
              <p className="offer-builder-card-label mb-[18px] font-brand-display text-[11px] font-semibold uppercase tracking-eyebrow">
                Your offer
              </p>
              <p className="offer-builder-card-eyebrow font-brand-display text-xs font-bold uppercase tracking-eyebrow" data-ob-preview-eyebrow>
                {preview.eyebrow}
              </p>
              <p
                data-ob="pvtitle"
                className="offer-builder-preview-title mt-2 font-brand-display text-[22px] font-bold leading-display tracking-[-0.026em] md:text-[26px]"
              >
                {preview.title}
              </p>
              <p
                data-ob="pvbody"
                className="offer-builder-preview-body mt-3.5 text-body leading-relaxed"
              >
                {preview.body}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span
                  data-ob-preview-action
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-body font-semibold text-white"
                >
                  {preview.action}
                  <ArrowRight className="size-4 text-white" strokeWidth={2} />
                </span>
                {preview.priceShown ? (
                  <span
                    data-ob-preview-price
                    className="offer-builder-price-pill inline-flex items-center rounded-full bg-accent-on-dark/14 px-4 py-2.5 font-brand-display text-body font-bold"
                  >
                    {preview.price}
                  </span>
                ) : (
                  <span data-ob-preview-price hidden className="offer-builder-price-pill inline-flex items-center rounded-full bg-accent-on-dark/14 px-4 py-2.5 font-brand-display text-body font-bold" />
                )}
              </div>

              <div
                data-ob="status"
                className="offer-builder-status mt-6 hidden grid-cols-2 gap-2.5 border-t border-white/10 pt-5 md:grid"
              >
                {(
                  [
                    ["Specific audience", clarity.audience],
                    ["Defined experience", clarity.experience],
                    ["Realistic value", clarity.value],
                    ["Clear next step", clarity.nextStep],
                  ] as const
                ).map(([label, ok]) => (
                  <span
                    key={label}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors",
                      ok ? "offer-builder-status-done" : "offer-builder-status-pending",
                    )}
                  >
                    <Check className="size-[15px]" strokeWidth={2.4} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div
              data-lead-capture="offer-builder"
              className="offer-builder-desktop-sidepanel hidden flex-col gap-3.5 md:flex"
            >
              <OfferBuilderClarityPanel clarity={clarity} />

              <OfferBuilderEmailPanel clarity={clarity} state={state} />
            </div>
          </div>

          <div
            data-lead-capture="offer-builder"
            className="offer-builder-mobile-panel space-y-4 md:hidden"
          >
            <OfferBuilderClarityPanel clarity={clarity} />
            <OfferBuilderEmailPanel clarity={clarity} state={state} />
          </div>
        </div>

        <div className="mt-8 rounded-card border border-border bg-background p-5 md:mt-10 md:p-6">
          <p className="mb-3 font-brand-display text-[13px] font-bold uppercase tracking-eyebrow text-muted-foreground-subtle">
            Your offer in one sentence
          </p>
          <p className="text-[17px] leading-relaxed text-heading">
            For{" "}
            <span
              data-ob-sentence="audience"
              data-ob-filled={state.audience ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.audience || "audience"}
            </span>
            {" "}experiencing{" "}
            <span
              data-ob-sentence="concern"
              data-ob-filled={concern ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {concern || "concern or situation"}
            </span>
            , start with a{" "}
            <span
              data-ob-sentence="firstStep"
              data-ob-filled={state.firstStep ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.firstStep || "first-step appointment"}
            </span>
            {" "}where you&apos;ll{" "}
            <span
              data-ob-sentence="happen1"
              data-ob-filled={state.happens[0] ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.happens[0] ? lc(state.happens[0]) : "experience one"}
            </span>
            {" "}and{" "}
            <span
              data-ob-sentence="happen2"
              data-ob-filled={state.happens[1] ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.happens[1] ? lc(state.happens[1]) : "experience two"}
            </span>
            {" "}so you can{" "}
            <span
              data-ob-sentence="takeaway"
              data-ob-filled={state.takeaway ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.takeaway ? lc(state.takeaway) : "realistic takeaway"}
            </span>
            .{" "}
            <span
              data-ob-sentence="action"
              data-ob-filled={state.action ? "true" : "false"}
              className="offer-builder-sentence-span inline rounded-md border px-2 py-0.5 font-semibold"
            >
              {state.action ? state.action.toLowerCase() : "call to action"}
            </span>
            .
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border bg-white px-5 py-2.5 text-body font-semibold text-muted-foreground transition-colors hover:border-[#B8BBC2] hover:text-heading"
          >
            Reset offer
          </button>
        </div>
      </div>
    </section>
  )
}

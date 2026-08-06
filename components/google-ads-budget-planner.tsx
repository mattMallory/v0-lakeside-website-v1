"use client"

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"

import { GhlEmbedFormSlot } from "@/components/ghl-embed-form-slot"
import {
  computeBudgetPlanner,
  defaultBudgetPlannerState,
  followupLeadConversionPresets,
  formatBudgetCurrency,
  formatBudgetRange,
  getBudgetPlannerNextStep,
  type BudgetFollowup,
  type BudgetPlannerState,
} from "@/lib/budget-planner"
import { readBudgetPlannerStateFromDom } from "@/lib/budget-planner-dom"
import { buildBudgetPlannerGhlUrl } from "@/lib/budget-planner-ghl"
import { cn } from "@/lib/utils"

type BudgetPillOptionProps = {
  name: string
  value: string
  label: string
  defaultChecked?: boolean
}

function BudgetPillOption({ name, value, label, defaultChecked = false }: BudgetPillOptionProps) {
  const inputId = `bp-${name}-${value}`

  return (
    <div className="budget-planner-pill-option">
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="budget-planner-native-input"
      />
      <label htmlFor={inputId} className="budget-planner-pill-label">
        {label}
      </label>
    </div>
  )
}

function BudgetPlannerEmailPanel({
  formUrl,
  submitMode,
  ghlEmbedUrl,
  embedRefreshKey,
  embedUpdating,
  onRedirectSave,
}: {
  formUrl?: string
  submitMode: string
  ghlEmbedUrl: string | null
  embedRefreshKey: number
  embedUpdating: boolean
  onRedirectSave: () => void
}) {
  return (
    <div className="budget-planner-email">
      {!formUrl ? (
        <p className="text-sm text-[#F87171]">
          GHL form URL is not configured. Add NEXT_PUBLIC_GHL_BUDGET_PLANNER_FORM_URL to your
          environment.
        </p>
      ) : submitMode === "redirect" ? (
        <button
          type="button"
          onClick={onRedirectSave}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1D4F8A]"
        >
          Save your plan
        </button>
      ) : (
        <GhlEmbedFormSlot
          title="Save your budget plan"
          embedUrl={ghlEmbedUrl}
          embedRefreshKey={embedRefreshKey}
          isUpdating={embedUpdating}
          waitingMessage="Pause on your final numbers and the email form will load here with your plan pre-filled."
          className="bg-white"
          placeholderClassName="bg-white/5"
        />
      )}
    </div>
  )
}

function budgetPlannerStateKey(state: BudgetPlannerState) {
  return `${state.patientValue}|${state.market}|${state.service}|${state.followup}|${state.leadConversion}`
}

function buildPlannerEmbedUrl(
  formUrl: string | undefined,
  submitMode: string,
  state: BudgetPlannerState,
  pageUrl?: string,
) {
  if (!formUrl || submitMode === "redirect") return null

  return buildBudgetPlannerGhlUrl(formUrl, {
    state,
    pageUrl,
  })
}

const CALCULATOR_SETTLE_MS = 1200
const MOBILE_MAX_WIDTH = 767

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
}

export function GoogleAdsBudgetPlanner({ embedded = false }: { embedded?: boolean }) {
  const formUrl = process.env.NEXT_PUBLIC_GHL_BUDGET_PLANNER_FORM_URL
  const submitMode = process.env.NEXT_PUBLIC_BUDGET_PLANNER_SUBMIT_MODE ?? "embed"

  const [ghlEmbedUrl, setGhlEmbedUrl] = useState<string | null>(() =>
    buildPlannerEmbedUrl(formUrl, submitMode, defaultBudgetPlannerState),
  )
  const [prefillSnapshot, setPrefillSnapshot] = useState<string | null>(() =>
    budgetPlannerStateKey(defaultBudgetPlannerState),
  )
  const [embedRefreshKey, setEmbedRefreshKey] = useState(0)
  const [calculatorSettled, setCalculatorSettled] = useState(true)

  const rootRef = useRef<HTMLElement>(null)
  const desktopEmbedRef = useRef<HTMLDivElement>(null)
  const prefillKeyRef = useRef(prefillSnapshot ?? "")
  const settleKeyRef = useRef(budgetPlannerStateKey(defaultBudgetPlannerState))
  const settleTimerRef = useRef<number | null>(null)

  const embedUpdating = !calculatorSettled && prefillSnapshot !== null

  const applyEmbedFromDom = useCallback(
    (options?: { refresh?: boolean }) => {
      if (!formUrl || submitMode === "redirect") return

      const root = rootRef.current
      if (!root) return

      const currentState = readBudgetPlannerStateFromDom(root)
      const currentKey = budgetPlannerStateKey(currentState)
      const nextUrl = buildPlannerEmbedUrl(formUrl, submitMode, currentState, window.location.href)

      if (!nextUrl) return

      if (prefillKeyRef.current === currentKey && !options?.refresh) return

      prefillKeyRef.current = currentKey
      setGhlEmbedUrl(nextUrl)
      setPrefillSnapshot(currentKey)

      if (options?.refresh) {
        setEmbedRefreshKey((current) => current + 1)
      }
    },
    [formUrl, submitMode],
  )

  const queueDesktopSettleRefresh = useCallback(() => {
    if (isMobileViewport()) return

    setCalculatorSettled(false)
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current)
    }

    settleTimerRef.current = window.setTimeout(() => {
      setCalculatorSettled(true)
      applyEmbedFromDom({ refresh: true })
    }, CALCULATOR_SETTLE_MS)
  }, [applyEmbedFromDom])

  useLayoutEffect(() => {
    if (!formUrl || submitMode === "redirect") return

    applyEmbedFromDom({ refresh: true })

    const root = rootRef.current
    if (!root) return

    settleKeyRef.current = budgetPlannerStateKey(readBudgetPlannerStateFromDom(root))

    const onInteraction = () => {
      const currentKey = budgetPlannerStateKey(readBudgetPlannerStateFromDom(root))
      if (currentKey === settleKeyRef.current) return

      settleKeyRef.current = currentKey

      if (isMobileViewport()) {
        applyEmbedFromDom({ refresh: true })
        return
      }

      queueDesktopSettleRefresh()
    }

    root.addEventListener("input", onInteraction, true)
    root.addEventListener("change", onInteraction, true)

    const interval = window.setInterval(() => {
      const currentKey = budgetPlannerStateKey(readBudgetPlannerStateFromDom(root))
      if (currentKey === settleKeyRef.current) return

      settleKeyRef.current = currentKey

      if (isMobileViewport()) {
        applyEmbedFromDom({ refresh: true })
        return
      }

      queueDesktopSettleRefresh()
    }, 400)

    return () => {
      root.removeEventListener("input", onInteraction, true)
      root.removeEventListener("change", onInteraction, true)
      window.clearInterval(interval)
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current)
      }
    }
  }, [applyEmbedFromDom, formUrl, queueDesktopSettleRefresh, submitMode])

  const result = useMemo(() => computeBudgetPlanner(defaultBudgetPlannerState), [])
  const nextStep = useMemo(() => getBudgetPlannerNextStep(defaultBudgetPlannerState), [])
  const budgetLabel = formatBudgetRange(result.budgetLow, result.budgetHigh)
  const landingConversionLabel = `${Math.round(result.landingConversion * 100)}%`

  function handleRedirectSave() {
    if (!formUrl || !rootRef.current) return

    const currentState = readBudgetPlannerStateFromDom(rootRef.current)
    window.location.assign(
      buildBudgetPlannerGhlUrl(formUrl, {
        state: currentState,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    )
  }

  const saveCopy = (
    <>
      <div className="budget-planner-save-label mb-3 text-sm font-medium text-[#94A3B8]">
        Save your budget plan
      </div>
      <div className="budget-planner-save-desc mb-4 text-xs leading-relaxed text-[#64748B]">
        Enter your email below. Your calculator answers are pre-filled automatically.
      </div>
    </>
  )

  return (
    <section
      ref={rootRef}
      id="planner"
      data-bp-form-url={formUrl ?? ""}
      data-bp-submit-mode={submitMode}
      className={cn(embedded ? "bg-transparent" : "border-y border-border bg-white")}
    >
      <div className="mx-auto max-w-[980px] px-6 py-14 md:py-16">
        <div className="mb-3.5 flex items-center gap-2">
          <span className="h-0.5 w-5 rounded bg-primary" />
          <p className="font-brand-display text-xs font-semibold uppercase tracking-[0.1em] text-primary">
            Interactive planner
          </p>
        </div>
        <h2 className="font-brand-display text-balance text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.026em] text-heading">
          Find your starting number
        </h2>
        <p className="mt-3.5 max-w-[600px] text-pretty text-lg leading-relaxed text-muted-foreground">
          Answer four questions about your practice. You&apos;ll get an instant, evidence-based budget
          range and cost targets — then email yourself a personalized plan.
        </p>

        <div className="budget-planner-layout mt-9 flex flex-wrap items-stretch gap-6">
          <div className="budget-planner-form flex min-w-[min(100%,380px)] flex-1 flex-col gap-7">
            <div>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <label htmlFor="bp-patient-value" className="font-brand-display text-[15px] font-bold text-heading">
                  What is a new patient worth?
                </label>
                <span
                  data-bp="patient-value-display"
                  className="font-brand-display text-[22px] font-bold tracking-[-0.02em] text-primary"
                  suppressHydrationWarning
                >
                  {formatBudgetCurrency(defaultBudgetPlannerState.patientValue)}
                </span>
              </div>
              <input
                id="bp-patient-value"
                type="range"
                min={500}
                max={5000}
                step={50}
                defaultValue={defaultBudgetPlannerState.patientValue}
                className="h-1.5 w-full cursor-pointer accent-primary"
              />
              <div className="mt-2 flex justify-between font-brand-display text-xs text-[#9CA3AF]">
                <span>$500</span>
                <span>Collected revenue per patient</span>
                <span>$5,000</span>
              </div>
            </div>

            <div>
              <p className="mb-3 font-brand-display text-[15px] font-bold text-heading">
                How competitive is your local market?
              </p>
              <div className="flex flex-wrap gap-2">
                <BudgetPillOption name="bp-market" value="low" label="Low · small town" />
                <BudgetPillOption
                  name="bp-market"
                  value="moderate"
                  label="Moderate · suburb"
                  defaultChecked
                />
                <BudgetPillOption name="bp-market" value="high" label="High · metro area" />
              </div>
            </div>

            <div>
              <p className="mb-3 font-brand-display text-[15px] font-bold text-heading">
                What are you promoting?
              </p>
              <div className="flex flex-wrap gap-2">
                <BudgetPillOption
                  name="bp-service"
                  value="general"
                  label="General chiropractic care"
                  defaultChecked
                />
                <BudgetPillOption
                  name="bp-service"
                  value="highvalue"
                  label="Higher-value cash-pay program"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 font-brand-display text-[15px] font-bold text-heading">
                How fast is your front-desk follow-up?
              </p>
              <p className="mb-3 text-[13px] leading-relaxed text-[#9CA3AF]">
                How quickly and consistently your team responds to a new lead.
              </p>
              <div className="flex flex-wrap gap-2">
                <BudgetPillOption name="bp-followup" value="strong" label="Strong · minutes" />
                <BudgetPillOption
                  name="bp-followup"
                  value="average"
                  label="Average · same day"
                  defaultChecked
                />
                <BudgetPillOption name="bp-followup" value="weak" label="Weak · sporadic" />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-4">
                <label htmlFor="bp-lead-conversion" className="font-brand-display text-[15px] font-bold text-heading">
                  Of your leads, how many become patients?
                </label>
                <span
                  data-bp="lead-conversion-display"
                  className="font-brand-display text-[22px] font-bold tracking-[-0.02em] text-primary"
                  suppressHydrationWarning
                >
                  {`${defaultBudgetPlannerState.leadConversion}%`}
                </span>
              </div>
              <p className="mb-3 text-[13px] leading-relaxed text-[#9CA3AF]">
                The follow-up presets above set a starting point — drag to match your own numbers.
              </p>
              <input
                id="bp-lead-conversion"
                type="range"
                min={3}
                max={75}
                step={1}
                defaultValue={followupLeadConversionPresets[defaultBudgetPlannerState.followup as BudgetFollowup]}
                className="h-1.5 w-full cursor-pointer accent-primary"
              />
              <div className="mt-2 flex justify-between font-brand-display text-xs text-[#9CA3AF]">
                <span>3%</span>
                <span>Lead → new patient</span>
                <span>75%</span>
              </div>
            </div>
          </div>

          <div className="budget-planner-results flex min-w-[min(100%,320px)] flex-1 flex-col rounded-2xl bg-[#0E1726] p-8">
            <p className="budget-planner-results-eyebrow text-[11px] font-medium uppercase tracking-[0.06em] text-[#64748B]">
              Recommended monthly ad spend
            </p>
            <p
              data-bp="budget-range"
              className="budget-planner-results-budget font-brand-display mt-2 text-[44px] font-bold leading-none tracking-[-0.03em] text-[#7CB0E8]"
              suppressHydrationWarning
            >
              {budgetLabel}
            </p>

            <div className="mt-6 flex gap-3">
              <div className="flex-1 rounded-[11px] border border-white/10 bg-white/[0.04] p-4">
                <p className="budget-planner-metric-label text-[11px] uppercase tracking-[0.05em] text-[#94A3B8]">
                  Cost per lead
                </p>
                <p
                  data-bp="cost-per-lead"
                  className="budget-planner-metric-value font-brand-display mt-1.5 text-[26px] font-semibold tracking-[-0.02em] text-white"
                  suppressHydrationWarning
                >
                  {formatBudgetCurrency(result.costPerLead)}
                </p>
                <p className="budget-planner-metric-desc mt-1.5 text-xs leading-snug text-[#64748B]">
                  Ad spend per person who inquires
                </p>
              </div>
              <div className="flex-1 rounded-[11px] border border-white/10 bg-white/[0.04] p-4">
                <p className="budget-planner-metric-label text-[11px] uppercase tracking-[0.05em] text-[#94A3B8]">
                  Cost per new patient
                </p>
                <p
                  data-bp="cost-per-patient"
                  className="budget-planner-metric-value font-brand-display mt-1.5 text-[26px] font-semibold tracking-[-0.02em] text-white"
                  suppressHydrationWarning
                >
                  {formatBudgetCurrency(result.costPerPatient)}
                </p>
                <p className="budget-planner-metric-desc mt-1.5 text-xs leading-snug text-[#64748B]">
                  Ad spend for each patient who actually starts care
                </p>
              </div>
            </div>

            <p className="budget-planner-body-text mt-5 text-xs leading-relaxed text-[#64748B]">
              Not every lead becomes a patient — some don&apos;t answer, book, or start care. Cost per
              new patient reflects the full funnel, so it&apos;s usually several times your cost per
              lead. Compare it to what a patient is worth.
            </p>

            <div className="mt-5 rounded-[11px] border border-[#7CB0E8]/25 bg-[#7CB0E8]/10 p-4">
              <p className="budget-planner-callout-label text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7CB0E8]">
                Do this first
              </p>
              <p
                data-bp="next-step"
                className="budget-planner-callout-text mt-1.5 text-[15px] leading-relaxed text-[#E2E8F0]"
                suppressHydrationWarning
              >
                {nextStep}
              </p>
            </div>

            <div
              ref={desktopEmbedRef}
              data-lead-capture="budget-planner"
              className="budget-planner-desktop-panel mt-auto hidden pt-6 md:block"
            >
              {saveCopy}
              <BudgetPlannerEmailPanel
                formUrl={formUrl}
                submitMode={submitMode}
                ghlEmbedUrl={ghlEmbedUrl}
                embedRefreshKey={embedRefreshKey}
                embedUpdating={embedUpdating}
                onRedirectSave={handleRedirectSave}
              />
            </div>
          </div>

          <div
            data-lead-capture="budget-planner"
            className="budget-planner-mobile-panel space-y-4 md:hidden"
          >
            {saveCopy}
            <BudgetPlannerEmailPanel
              formUrl={formUrl}
              submitMode={submitMode}
              ghlEmbedUrl={ghlEmbedUrl}
              embedRefreshKey={embedRefreshKey}
              embedUpdating={embedUpdating}
              onRedirectSave={handleRedirectSave}
            />
          </div>
        </div>

        <p className="mt-4 max-w-[640px] text-[13px] leading-relaxed text-[#9CA3AF]">
          Estimates use a{" "}
          <span data-bp="landing-conversion-pct" suppressHydrationWarning>
            {landingConversionLabel}
          </span>{" "}
          landing-page
          conversion assumption and cost-per-click ranges typical of chiropractic search. Your actual
          results depend on offer, tracking, and competition — treat this as a planning starting
          point, not a guarantee.
        </p>
      </div>
    </section>
  )
}

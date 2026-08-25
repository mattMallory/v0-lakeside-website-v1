"use client"

import { Check, MessageSquare, Target, TrendingUp, Zap, type LucideIcon } from "lucide-react"
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react"

import { type AboutProcessItem } from "@/lib/about-defaults"
import { cn } from "@/lib/utils"

const stepIcons: LucideIcon[] = [Check, MessageSquare, Zap, Target, TrendingUp]

const PROCESS_STEP_LABELS = ["Learn", "Launch", "Optimize", "Focus", "Grow"] as const

const REVEAL_DELAY_MS = 120
const DESKTOP_REVEAL_LINE = 0.68
const MOBILE_REVEAL_LINE = 0.88

type AboutProcessDiagramProps = {
  items: AboutProcessItem[]
}

type ProcessTimelineStepProps = {
  item: AboutProcessItem
  index: number
  scrollDirectionRef: RefObject<"up" | "down" | null>
  onVisibilityChange: (index: number, visible: boolean) => void
}

function isStepInView(node: HTMLElement) {
  const rect = node.getBoundingClientRect()
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
  const isMobile = window.matchMedia("(max-width: 1023px)").matches
  const revealLine = viewportHeight * (isMobile ? MOBILE_REVEAL_LINE : DESKTOP_REVEAL_LINE)
  const minVisible = isMobile ? 32 : 56

  return visibleHeight >= minVisible && rect.top <= revealLine && rect.bottom > viewportHeight * 0.1
}

function isStepBelowViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect()
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight
  return rect.top > viewportHeight * 0.82
}

function ProcessTimelineStep({ item, index, scrollDirectionRef, onVisibilityChange }: ProcessTimelineStepProps) {
  const stepRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)
  const revealTimerRef = useRef<number | null>(null)
  const Icon = stepIcons[index] ?? Check
  const label = PROCESS_STEP_LABELS[index] ?? `Step ${index + 1}`

  const setVisible = useCallback(
    (visible: boolean) => {
      if (isVisibleRef.current === visible) return
      isVisibleRef.current = visible
      setIsVisible(visible)
      onVisibilityChange(index, visible)
    },
    [index, onVisibilityChange],
  )

  useLayoutEffect(() => {
    const node = stepRef.current
    if (!node) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const cancelReveal = () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current)
        revealTimerRef.current = null
      }
    }

    const scheduleReveal = () => {
      if (isVisibleRef.current || revealTimerRef.current !== null) return

      revealTimerRef.current = window.setTimeout(() => {
        revealTimerRef.current = null
        if (isStepInView(node)) {
          setVisible(true)
        }
      }, REVEAL_DELAY_MS)
    }

    const update = () => {
      if (isStepInView(node)) {
        scheduleReveal()
        return
      }

      cancelReveal()

      if (scrollDirectionRef.current === "up" && isStepBelowViewport(node)) {
        setVisible(false)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          scheduleReveal()
          return
        }

        update()
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    )

    observer.observe(node)
    update()
    window.requestAnimationFrame(update)

    const onScroll = () => window.requestAnimationFrame(update)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("touchmove", onScroll, { passive: true })
    window.addEventListener("touchend", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    window.addEventListener("orientationchange", onScroll, { passive: true })

    const timers = [80, 240, 600, 1200].map((delay) => window.setTimeout(update, delay))

    return () => {
      observer.disconnect()
      cancelReveal()
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("touchmove", onScroll)
      window.removeEventListener("touchend", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("orientationchange", onScroll)
    }
  }, [scrollDirectionRef, setVisible])

  return (
    <div
      ref={stepRef}
      data-visible={isVisible ? "true" : "false"}
      className="process-step-card rounded-[14px] border border-border bg-white shadow-raised"
    >
      <div className="flex items-center gap-4 px-5 py-[18px] sm:px-6">
        <span
          className={cn(
            "process-step-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-350 ease-out",
            isVisible ? "bg-primary text-white" : "bg-background text-muted-foreground",
          )}
        >
          <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
        </span>

        <div
          className={cn(
            "process-step-copy min-w-0 flex-1 transition-all duration-350 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <p className="font-brand-display text-base font-bold tracking-[-0.01em] text-heading sm:text-[17px]">
            {index + 1} • {label}
          </p>
          <p className="mt-0.5 text-pretty text-body leading-snug text-muted-foreground sm:text-body sm:leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function AboutProcessDiagram({ items }: AboutProcessDiagramProps) {
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set())
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollDirectionRef = useRef<"up" | "down" | null>(null)
  const lastScrollYRef = useRef(0)

  useLayoutEffect(() => {
    lastScrollYRef.current = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY < lastScrollYRef.current) {
        scrollDirectionRef.current = "up"
      } else if (currentY > lastScrollYRef.current) {
        scrollDirectionRef.current = "down"
      }
      lastScrollYRef.current = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("touchmove", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("touchmove", onScroll)
    }
  }, [])

  const handleVisibilityChange = useCallback((index: number, visible: boolean) => {
    setRevealed((current) => {
      const has = current.has(index)
      if (visible === has) return current

      const next = new Set(current)
      if (visible) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }, [])

  const revealedCount = revealed.size
  const stepCount = items.length

  function scrollToStep(index: number) {
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div className="about-process-timeline mx-auto mt-12 flex max-w-4xl flex-wrap items-start gap-6 sm:mt-14">
      <aside className="sticky top-20 hidden w-[236px] shrink-0 self-start rounded-2xl border border-border bg-background p-5 lg:block">
        <p className="font-brand-display mb-2.5 text-[11px] font-semibold uppercase tracking-eyebrow text-muted-foreground-subtle">
          Our process
        </p>
        <div className="mb-0.5 flex items-baseline gap-1.5">
          <span className="font-brand-display text-[40px] font-bold leading-none tracking-display text-primary">
            {revealedCount}
          </span>
          <span className="font-brand-display text-lg font-bold text-muted-foreground-subtle">/ {stepCount}</span>
        </div>
        <p className="mb-[18px] text-[13px] text-muted-foreground">steps complete</p>

        <div className="flex flex-col">
          {items.map((_, index) => {
            const isRevealed = revealed.has(index)
            const label = PROCESS_STEP_LABELS[index] ?? `Step ${index + 1}`

            return (
              <div key={`progress-${label}-${index}`}>
                <button
                  type="button"
                  onClick={() => scrollToStep(index)}
                  className="flex w-full items-center gap-3 rounded-[9px] px-1.5 py-[7px] text-left transition-colors hover:bg-white"
                >
                  <span
                    className={cn(
                      "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body font-semibold transition-colors duration-350",
                      isRevealed
                        ? "bg-primary text-white"
                        : "bg-white text-muted-foreground ring-1 ring-border",
                    )}
                  >
                    {isRevealed ? <Check className="h-4 w-4" strokeWidth={2.4} /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-body leading-snug transition-colors duration-350",
                      isRevealed ? "font-semibold text-heading" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </button>
                {index < items.length - 1 ? (
                  <span
                    className={cn(
                      "ml-5 block h-[9px] w-0.5 rounded-sm transition-colors duration-350",
                      isRevealed && revealed.has(index + 1) ? "bg-primary" : "bg-border",
                    )}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            ref={(node) => {
              stepRefs.current[index] = node
            }}
          >
            <ProcessTimelineStep
              item={item}
              index={index}
              scrollDirectionRef={scrollDirectionRef}
              onVisibilityChange={handleVisibilityChange}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

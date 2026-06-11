"use client"

import { useState } from "react"

type Step = {
  number: string
  title: string
  description: string
}

export function HowItWorksStepCard({ step }: { step: Step }) {
  const [touchActive, setTouchActive] = useState(false)

  function triggerBounce(el: HTMLElement) {
    const numberEl = el.querySelector<HTMLElement>("[data-step-number]")
    if (!numberEl) return
    numberEl.classList.remove("animate-step-bounce")
    void numberEl.getBoundingClientRect()
    numberEl.classList.add("animate-step-bounce")
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLElement>) {
    triggerBounce(event.currentTarget)
  }

  function handleMouseLeave(event: React.MouseEvent<HTMLElement>) {
    event.currentTarget.querySelector<HTMLElement>("[data-step-number]")?.classList.remove("animate-step-bounce")
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    setTouchActive(true)
    triggerBounce(event.currentTarget)
  }

  return (
    <article
      className="group relative rounded-2xl border border-border bg-card p-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <span
        data-step-number
        className={`inline-block origin-bottom text-4xl font-bold transition-colors duration-300 ease-out group-hover:text-primary ${
          touchActive ? "text-primary" : "text-primary/30"
        }`}
      >
        {step.number}
      </span>
      <h3 className="mt-3 font-semibold text-card-foreground">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
    </article>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getIcon } from "@/lib/icons"
import type { WhoWeHelpPractice } from "@/lib/payload"

type WhoWeHelpContent = {
  headline: string
  subheadline: string
  practices: WhoWeHelpPractice[]
}

export function WhoWeHelp({ content }: { content: WhoWeHelpContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="who-we-help" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{content.subheadline}</p>
        </div>

        <div className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.practices.map((practice, index) => {
            const Icon = getIcon(practice.icon)
            const isOpen = openIndex === index
            return (
              <button
                key={practice.name}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex w-full flex-col items-center rounded-2xl border bg-card px-6 py-8 text-center transition-colors",
                  isOpen ? "border-primary" : "border-border hover:border-primary/50",
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-4 flex items-center gap-1.5 font-semibold text-card-foreground">
                  {practice.name}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                </span>
                {isOpen && (
                  <div className="mt-4 w-full animate-in fade-in slide-in-from-top-1 duration-300">
                    {practice.imageUrl && (
                      <div className="relative mx-auto mb-4 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-lg">
                        <Image
                          src={practice.imageUrl}
                          alt={practice.imageAlt || practice.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 20vw, 80vw"
                        />
                      </div>
                    )}
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{practice.detail}</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

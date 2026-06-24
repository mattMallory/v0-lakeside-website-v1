import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SolutionPillar } from "@/lib/payload"

type SolutionSectionContent = {
  eyebrow: string
  headline: string
  description: string
  cta: string
  pillars: SolutionPillar[]
}

export function SolutionSection({ content }: { content: SolutionSectionContent }) {
  return (
    <section className="bg-secondary/60 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{content.description}</p>
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg" className="mt-8 rounded-full px-8">
            {content.cta}
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <ul className="flex flex-col gap-4">
            {content.pillars.map((pillar) => (
              <li key={pillar.text} className="flex items-center gap-4 rounded-xl bg-secondary/70 px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                <span className="font-medium text-card-foreground">{pillar.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

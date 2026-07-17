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
    <section className="bg-lake-pale/80 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{content.description}</p>
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg" className="mt-8">
            {content.cta}
          </Button>
        </div>

        <div className="rounded-[16px] border border-border bg-card p-8 shadow-[0_4px_6px_-1px_rgba(16,23,38,0.07),0_2px_4px_-2px_rgba(16,23,38,0.05)]">
          <ul className="flex flex-col gap-4">
            {content.pillars.map((pillar) => (
              <li key={pillar.text} className="flex items-center gap-4 rounded-[12px] bg-lake-pale px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-lake-pale text-icon ring-1 ring-lake-light">
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

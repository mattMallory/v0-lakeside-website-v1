import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const pillars = [
  "Paid Advertising",
  "Conversion-Focused Landing Pages",
  "Lead Management",
  "Ongoing Optimization",
]

export function SolutionSection() {
  return (
    <section className="bg-secondary/60 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The Lakeside System</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A Complete Patient Acquisition System
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Lakeside combines four proven pillars into one streamlined system designed to generate qualified patient
            inquiries, predictably and on repeat.
          </p>
          <Button render={<Link href="#contact" />} size="lg" className="mt-8 rounded-full px-8">
            Schedule a Consultation
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <ul className="flex flex-col gap-4">
            {pillars.map((pillar) => (
              <li key={pillar} className="flex items-center gap-4 rounded-xl bg-secondary/70 px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                <span className="font-medium text-card-foreground">{pillar}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

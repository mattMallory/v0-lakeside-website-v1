import { Check } from "lucide-react"

const reasons = [
  "Wellness industry insiders who understand your patients",
  "Lead generation specialists, not generalist marketers",
  "Simple, proven systems instead of complexity",
  "Transparent reporting you can actually understand",
  "Focused on outcomes, not marketing jargon",
]

export function WhyChoose() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Clinics Choose Lakeside
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            We know the natural wellness industry, and we build patient acquisition systems around the way real clinics
            grow.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium text-card-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

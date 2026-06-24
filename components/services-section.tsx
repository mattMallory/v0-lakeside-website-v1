import { getIcon } from "@/lib/icons"
import type { ServiceItem } from "@/lib/payload"

type ServicesSectionContent = {
  eyebrow: string
  headline: string
  items: ServiceItem[]
}

export function ServicesSection({ content }: { content: ServicesSectionContent }) {
  return (
    <section id="system" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.headline}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {content.items.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <div
                key={service.title}
                className="flex gap-5 rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

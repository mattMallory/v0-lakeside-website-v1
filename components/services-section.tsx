import { getIcon } from "@/lib/icons"
import type { ServiceItem } from "@/lib/payload"

type ServicesSectionContent = {
  eyebrow: string
  headline: string
  items: ServiceItem[]
}

export function ServicesSection({ content }: { content: ServicesSectionContent }) {
  return (
    <section id="system" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            {content.headline}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {content.items.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <div
                key={service.title}
                className="flex gap-5 rounded-[12px] border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-lake-light hover:shadow-[0_4px_6px_-1px_rgba(16,23,38,0.07),0_2px_4px_-2px_rgba(16,23,38,0.05)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-lake-pale text-icon">
                  <Icon className="h-[22px] w-[22px]" />
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

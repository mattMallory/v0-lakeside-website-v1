import { getIcon } from "@/lib/icons"
import type { ServiceOffering } from "@/lib/services-defaults"

type ServicesSectionContent = {
  eyebrow: string
  headline: string
  items: ServiceOffering[]
}

export function ServicesSection({
  content,
  id = "system",
}: {
  content: ServicesSectionContent
  id?: string
}) {
  return (
    <section id={id} className="bg-white py-20">
      <div className="mx-auto max-w-page px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-heading sm:text-4xl">
            {content.headline}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {content.items.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <div
                key={service.title}
                className="flex gap-5 rounded-lg border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-lake-light hover:shadow-raised"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sq bg-lake-pale text-icon">
                  <Icon className="h-[22px] w-[22px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{service.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

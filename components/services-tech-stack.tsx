import Image from "next/image"

import type { ServicesContent } from "@/lib/services-defaults"
import { ServicesTechLogos } from "@/components/services-tech-logos"

type ServicesTechStackProps = {
  content: ServicesContent["technology"]
}

export function ServicesTechStack({ content }: ServicesTechStackProps) {
  return (
    <section className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center" data-tech-logos-section>
          <ServicesTechLogos logos={content.logos} />
          <p className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-heading sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {content.categories.map((category) => (
            <div
              key={category.title}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-raised"
            >
              <div className="relative aspect-[16/10] w-full bg-lake-pale">
                <Image
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-7">
                <h3 className="font-semibold text-card-foreground">{category.title}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-white px-3.5 py-1.5 text-body font-medium text-heading"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

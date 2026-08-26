import type { LegalPageContent } from "@/lib/legal-defaults"
import { SectionEyebrow } from "@/components/homepage-growth-system/section-eyebrow"

type LegalPageContentProps = {
  content: LegalPageContent
}

export function LegalPageContent({ content }: LegalPageContentProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <SectionEyebrow className="mb-0">
        {content.eyebrow}
      </SectionEyebrow>
      <h1 className="mt-3 text-balance text-3xl font-bold text-heading sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">Last updated: {content.lastUpdated}</p>
      <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{content.intro}</p>

      <div className="mt-10 flex flex-col gap-8">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-brand-display text-xl font-bold tracking-display text-heading">{section.title}</h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  )
}

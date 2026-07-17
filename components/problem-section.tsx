import { getIcon } from "@/lib/icons"
import type { ProblemItem } from "@/lib/payload"

type ProblemSectionContent = {
  headline: string
  subheadline: string
  items: ProblemItem[]
}

export function ProblemSection({ content }: { content: ProblemSectionContent }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
          {content.headline}
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">{content.subheadline}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((problem) => {
          const Icon = getIcon(problem.icon)
          return (
            <div
              key={problem.title}
              className="overflow-hidden rounded-[12px] border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-lake-light hover:shadow-[0_4px_6px_-1px_rgba(16,23,38,0.07),0_2px_4px_-2px_rgba(16,23,38,0.05)]"
            >
              <div className="relative">
                <img
                  src={problem.imageUrl || "/placeholder.svg"}
                  alt={problem.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-lake-pale text-icon shadow-sm ring-1 ring-lake-light">
                  <Icon className="h-[22px] w-[22px]" />
                </div>
              </div>
              <div className="px-5 pb-6 pt-8">
                <h3 className="font-semibold text-card-foreground">{problem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

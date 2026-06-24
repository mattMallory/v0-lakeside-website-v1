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
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
              className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={problem.imageUrl || "/placeholder.svg"}
                  alt={problem.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute -bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary shadow-md ring-1 ring-border">
                  <Icon className="h-6 w-6" />
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

import Link from "next/link"

import { AboutProcessDiagram } from "@/components/about-process-diagram"
import { Button } from "@/components/ui/button"
import type { AboutContent } from "@/lib/about-defaults"

type AboutProcessProps = {
  content: AboutContent["process"]
}

export function AboutProcess({ content }: AboutProcessProps) {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-display text-heading sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
        </div>

        <AboutProcessDiagram items={content.items} />

        <div className="mt-6 text-center">
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg">
            Start Growing Your Business
          </Button>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HowItWorksStepCard } from "@/components/how-it-works-step-card"
import type { HowItWorksStep } from "@/lib/payload"

type HowItWorksContent = {
  headline: string
  subheadline: string
  button: string
  steps: HowItWorksStep[]
}

export function HowItWorks({ content }: { content: HowItWorksContent }) {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {content.headline}
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">{content.subheadline}</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {content.steps.map((step) => (
          <HowItWorksStepCard key={step.number} step={step} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          render={<Link href="#system" />}
          nativeButton={false}
          size="lg"
          variant="outline"
          className="rounded-full px-8 bg-transparent"
        >
          {content.button}
        </Button>
      </div>
    </section>
  )
}

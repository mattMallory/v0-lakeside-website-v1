import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomepageContent } from "@/lib/payload"

type CtaSectionProps = {
  content: Pick<HomepageContent, "ctaHeadline" | "ctaSubheadline" | "ctaButton">
}

export function CtaSection({ content }: CtaSectionProps) {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="animate-float-a pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-b pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-c pointer-events-none absolute left-1/2 top-0 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl">
            {content.ctaHeadline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-background/70">{content.ctaSubheadline}</p>
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg" className="mt-8 rounded-full px-8">
            {content.ctaButton}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroFunnelBackground } from "@/components/hero-funnel-background"
import type { HomepageContent } from "@/lib/payload"

type HeroProps = {
  content: Pick<
    HomepageContent,
    "heroEyebrow" | "heroHeadline" | "heroSubheadline" | "heroPrimaryCta"
  >
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-white min-h-[32rem] md:min-h-[36rem]">
      <HeroFunnelBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-left md:py-28">
        <p className="font-brand-display mb-5 text-sm font-semibold uppercase tracking-[0.1em] text-primary">{content.heroEyebrow}</p>
        <h1 className="font-brand-display max-w-5xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.026em] text-heading sm:text-5xl md:text-6xl">
          {content.heroHeadline}
        </h1>
        <p className="mt-6 max-w-[60%] text-pretty text-lg leading-[1.55] text-muted-foreground md:text-[19px]">
          {content.heroSubheadline}
        </p>
        <div className="mt-9 flex flex-col items-start">
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg">
            {content.heroPrimaryCta}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

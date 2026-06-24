import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchOverlayGraphic } from "@/components/search-overlay-graphic"
import type { WhyChooseCard } from "@/lib/payload"

type WhyChooseContent = {
  headline: string
  description: string
  cta: string
  cards: WhyChooseCard[]
}

export function WhyChoose({ content }: { content: WhyChooseContent }) {
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start lg:py-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
          <Button
            render={<Link href="/consultation" />}
            nativeButton={false}
            size="lg"
            className="mt-8 rounded-full px-8"
          >
            {content.cta}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          {content.cards.map((card) => (
            <article key={card.heading} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <SearchOverlayGraphic
                baseImage={card.baseImage}
                baseAlt={card.baseAlt}
                overlayImage={card.overlayImage}
                overlayAlt={card.overlayAlt}
                overlayWidthClass={card.overlayWidthClass}
                overlayPositionClass={card.overlayPositionClass}
                overlayPositionClassMobile={card.overlayPositionClassMobile}
              />
              <div className="pt-5">
                <h3 className="text-xl font-bold text-card-foreground">{card.heading}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

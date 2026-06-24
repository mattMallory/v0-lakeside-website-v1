import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HomepageContent } from "@/lib/payload"

type HeroProps = {
  content: Pick<
    HomepageContent,
    "heroEyebrow" | "heroHeadline" | "heroSubheadline" | "heroPrimaryCta" | "heroSecondaryCta"
  >
}

const heroBlobs = [
  {
    animation: "hero-water-1",
    duration: "32s",
    delay: "-4s",
    className: "-left-40 top-[-4rem] h-[22rem] w-[22rem] bg-primary/40",
  },
  {
    animation: "hero-water-2",
    duration: "38s",
    delay: "-11s",
    className: "right-[-6rem] top-0 h-[26rem] w-[26rem] bg-accent/60",
  },
  {
    animation: "hero-water-3",
    duration: "28s",
    delay: "-7s",
    className: "left-1/2 top-[-3rem] h-96 w-96 -translate-x-1/2 bg-primary/32",
  },
  {
    animation: "hero-water-4",
    duration: "36s",
    delay: "-18s",
    className: "-left-36 bottom-[-5rem] h-[22rem] w-[22rem] bg-accent/52",
  },
  {
    animation: "hero-water-5",
    duration: "30s",
    delay: "-2s",
    className: "right-0 bottom-[-4rem] h-[26rem] w-[26rem] bg-primary/36",
  },
  {
    animation: "hero-water-6",
    duration: "34s",
    delay: "-14s",
    className: "left-[12%] bottom-[-4rem] h-80 w-80 bg-accent/48",
  },
  {
    animation: "hero-water-7",
    duration: "26s",
    delay: "-9s",
    className: "left-[2%] top-[30%] h-72 w-72 bg-primary/28",
  },
  {
    animation: "hero-water-8",
    duration: "40s",
    delay: "-21s",
    className: "right-[12%] top-[32%] h-80 w-80 bg-accent/44",
  },
  {
    animation: "hero-water-9",
    duration: "24s",
    delay: "-6s",
    className: "right-[32%] top-[-3rem] h-64 w-64 bg-primary/30",
  },
] as const

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[32rem] md:min-h-[36rem]">
      {heroBlobs.map((blob) => (
        <div
          key={blob.animation}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute rounded-full blur-3xl",
            blob.animation,
            blob.className,
          )}
          style={{
            animationDuration: blob.duration,
            animationDelay: blob.delay,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.heroEyebrow}</p>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {content.heroHeadline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {content.heroSubheadline}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/consultation" />} nativeButton={false} size="lg" className="rounded-full px-8">
            {content.heroPrimaryCta}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            render={<Link href="#how-it-works" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-full px-8 bg-transparent"
          >
            {content.heroSecondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}

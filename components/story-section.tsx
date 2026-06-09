import Link from "next/link"
import { Button } from "@/components/ui/button"

export function StorySection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Why Lakeside</p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Clinic Owners Should Heal, Not Market
      </h2>
      <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
        We started Lakeside because too many clinic owners are forced to become marketers when they should be focused on
        helping patients. Our goal is simple: build reliable patient acquisition systems so clinic owners can spend less
        time worrying about where the next patient is coming from.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button render={<Link href="#system" />} nativeButton={false} size="lg" className="rounded-full px-8">
          Learn About Our System
        </Button>
        <Button
          render={<Link href="#contact" />}
          nativeButton={false}
          size="lg"
          variant="outline"
          className="rounded-full px-8 bg-transparent"
        >
          View Case Studies
        </Button>
      </div>
    </section>
  )
}

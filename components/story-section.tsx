import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

type StorySectionContent = {
  eyebrow: string
  headline: string
  description: string
  primaryCta: string
  secondaryCta: string
  imageUrl: string
  imageAlt: string
  notificationTitle: string
  notificationHeading: string
  notificationBody: string
}

export function StorySection({ content }: { content: StorySectionContent }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-primary">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Button render={<Link href="#system" />} nativeButton={false} size="lg">
              {content.primaryCta}
            </Button>
            <Button
              render={<Link href="#contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
            >
              {content.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={content.imageUrl || "/placeholder.svg"}
              alt={content.imageAlt}
              width={2354}
              height={1568}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-0 w-[min(20rem,85%)] animate-in fade-in slide-in-from-bottom-4 duration-700 sm:-left-6 sm:bottom-8">
            <div className="rounded-2xl bg-card p-4 shadow-xl ring-1 ring-border">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Bell className="h-5 w-5 animate-[wiggle_1.2s_ease-in-out_infinite]" />
                </span>
                <p className="text-lg font-bold tracking-tight text-foreground">{content.notificationTitle}</p>
              </div>
              <div className="mt-3 rounded-xl bg-muted/60 p-3">
                <p className="text-sm font-semibold text-foreground">{content.notificationHeading}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{content.notificationBody}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

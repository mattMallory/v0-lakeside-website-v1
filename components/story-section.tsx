import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StorySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Why Lakeside</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Clinic Owners Should Heal, Not Market
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            We started Lakeside because too many clinic owners are forced to become marketers when they should be
            focused on helping patients. Our goal is simple: build reliable patient acquisition systems so clinic owners
            can spend less time worrying about where the next patient is coming from.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
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
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/story/therapy-session-clean.png"
              alt="A clinician treating a patient during a therapy session"
              width={683}
              height={499}
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
                <p className="text-lg font-bold tracking-tight text-foreground">New Message</p>
              </div>
              <div className="mt-3 rounded-xl bg-muted/60 p-3">
                <p className="text-sm font-semibold text-foreground">Consultation Booked</p>
                <p className="mt-0.5 text-sm text-muted-foreground">John S. has scheduled with you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

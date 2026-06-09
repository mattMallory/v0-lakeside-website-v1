import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* roaming warm glow accents */}
      <div
        aria-hidden="true"
        className="animate-float-a pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-b pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-accent/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-c pointer-events-none absolute left-1/2 top-8 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Patient Acquisition For Natural Wellness Clinics
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          More Patient Appointments For Your Clinic
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          We help natural healthcare clinics generate qualified patient inquiries through proven lead generation systems
          so you can focus on patient care.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<Link href="#contact" />} nativeButton={false} size="lg" className="rounded-full px-8">
            Schedule a Consultation
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            render={<Link href="#how-it-works" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-full px-8 bg-transparent"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  )
}

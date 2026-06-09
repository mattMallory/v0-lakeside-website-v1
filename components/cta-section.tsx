import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl">
            Ready To Generate More Patient Appointments?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-background/70">
            Book a free growth consultation and we'll map out a patient acquisition system tailored to your clinic.
          </p>
          <Button render={<Link href="#contact" />} nativeButton={false} size="lg" className="mt-8 rounded-full px-8">
            Schedule Your Growth Consultation
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

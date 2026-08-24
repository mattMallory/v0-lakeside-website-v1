import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ConsultationForm } from "@/components/consultation-form"
import { resolveConsultationFormMode } from "@/lib/ghl-consultation"

export const metadata: Metadata = {
  title: "Schedule a Consultation | Lakeside",
  description:
    "Book a free growth consultation with Lakeside and map out a patient acquisition system tailored to your clinic.",
}

export default function ConsultationPage() {
  const formMode = resolveConsultationFormMode()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28 lg:pt-2">
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              Get Started
            </p>
            <h1 className="mt-3 max-w-[18ch] text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              Let&apos;s Grow Your Practice
            </h1>
            <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              Answer a few quick questions about your practice and goals. We&apos;ll use your answers to prepare for a
              complimentary growth consultation — so we can talk specifically about how to attract more of the right
              patients and build a patient-acquisition system that fits how you work.
            </p>
          </div>

          <div className="min-w-0">
            <ConsultationForm mode={formMode} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

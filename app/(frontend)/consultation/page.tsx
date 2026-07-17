import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ConsultationForm } from "@/components/consultation-form"

export const metadata: Metadata = {
  title: "Schedule a Consultation | Lakeside",
  description:
    "Book a free growth consultation with Lakeside and map out a patient acquisition system tailored to your clinic.",
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-primary">Get Started</p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            Schedule a Consultation
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Tell us about your clinic and we&apos;ll map out a patient acquisition plan built for natural wellness
            practices like yours.
          </p>
        </div>
        <div className="mt-10">
          <ConsultationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

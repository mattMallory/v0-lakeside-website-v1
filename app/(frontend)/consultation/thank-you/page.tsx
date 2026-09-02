import type { Metadata } from "next"
import Link from "next/link"

import { GoogleAdsConsultationConversion } from "@/components/google-ads-consultation-conversion"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Thanks — Consultation Request Received | Lakeside",
  description: "We received your consultation request and will reply within one business day.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ConsultationThankYouPage() {
  return (
    <div className="min-h-screen bg-background">
      <GoogleAdsConsultationConversion />
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center md:py-28">
        <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
          Request received
        </p>
        <h1 className="mt-3 text-balance font-brand-display text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
          Thanks — we&apos;ll be in touch.
        </h1>
        <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          We received your consultation request and will reply within one business day. In the
          meantime, you can explore how we help practices grow.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button render={<Link href="/" />} nativeButton={false} size="lg">
            Back to Home
          </Button>
          <Button
            render={<Link href="/growth-plan" />}
            nativeButton={false}
            variant="outline"
            size="lg"
          >
            Get Your Growth Plan
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

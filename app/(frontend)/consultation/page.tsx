import type { Metadata } from "next"

import { ConsultationForm } from "@/components/consultation-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getConsultationPageContent } from "@/lib/consultation-page"
import { resolveConsultationFormMode } from "@/lib/ghl-consultation"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const content = await getConsultationPageContent()

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
    },
  }
}

export default async function ConsultationPage() {
  const [content, formMode] = await Promise.all([
    getConsultationPageContent(),
    Promise.resolve(resolveConsultationFormMode()),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28 lg:pt-2">
            {content.eyebrow ? (
              <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
                {content.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 max-w-[18ch] text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {content.title}
            </h1>
            {content.description ? (
              <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                {content.description}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <ConsultationForm
              mode={formMode}
              consent={{
                smsNonMarketingConsentLabel: content.smsNonMarketingConsentLabel,
                smsMarketingConsentLabel: content.smsMarketingConsentLabel,
                privacyLinkLabel: content.privacyLinkLabel,
                termsLinkLabel: content.termsLinkLabel,
              }}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

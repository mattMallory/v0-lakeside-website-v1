import type { Metadata } from "next"

import { DemoSystemWaitlist } from "@/components/demo-system-waitlist"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getDemoSystemContent } from "@/lib/demo-system"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const content = await getDemoSystemContent()

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
    },
  }
}

export default async function DemoSystemPage() {
  const content = await getDemoSystemContent()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="text-center">
          {content.eyebrow ? (
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              {content.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-0.03em] text-heading sm:text-5xl">
            {content.title}
          </h1>
          {content.description ? (
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <DemoSystemWaitlist
            formTitle={content.formTitle}
            formDescription={content.formDescription}
            formButtonLabel={content.formButtonLabel}
            successTitle={content.successTitle}
            successMessage={content.successMessage}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

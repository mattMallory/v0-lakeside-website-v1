import type { Metadata } from "next"

import { CalendarEmbed } from "@/components/calendar-embed"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getCalendarPageContent } from "@/lib/calendar"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCalendarPageContent()

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
    },
  }
}

export default async function SchedulePage() {
  const content = await getCalendarPageContent()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow ? (
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              {content.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            {content.title}
          </h1>
          {content.description ? (
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          ) : null}
        </div>

        <div className="mt-10">
          <CalendarEmbed embedCode={content.embedCode} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

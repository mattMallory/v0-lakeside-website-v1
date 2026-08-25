import type { Metadata } from "next"

import { GoogleAdsBudgetPlanner } from "@/components/google-ads-budget-planner"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Chiropractic Google Ads Budget Planner | Lakeside Marketing",
  description:
    "Answer four questions about your practice and get an evidence-based Google Ads budget range, cost targets, and a personalized plan by email.",
}

export default function GoogleAdsBudgetPlannerPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[720px] px-6 py-14 text-center md:py-16">
            <h1 className="font-brand-display text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-display tracking-display text-heading">
              How much should a chiropractic practice spend on{" "}
              <span className="text-primary">Google Ads?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[600px] text-pretty text-lg leading-relaxed text-muted-foreground">
              Use the interactive planner below to find a practical starting budget based on patient
              value, local competition, and your conversion process.
            </p>
          </div>
        </section>

        <GoogleAdsBudgetPlanner />
      </main>
      <SiteFooter />
    </>
  )
}

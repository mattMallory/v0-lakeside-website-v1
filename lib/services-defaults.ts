import type { CaseStudyHighlightContent } from "@/lib/case-study-highlight"
import { defaultCaseStudyHighlightContent } from "@/lib/case-study-highlight"
import type { ServicesPage } from "@/payload-types"

// Derived from the schema rather than declared as `string`, so a seed cannot write an
// icon name the CMS select does not offer — which would then fail to render.
export type ServiceOfferingIcon = NonNullable<
  NonNullable<ServicesPage["offeringsItems"]>[number]["icon"]
>

export type ServiceOffering = {
  icon: ServiceOfferingIcon
  title: string
  description: string
}

export type TechCategory = {
  title: string
  items: string[]
  imageUrl: string
  imageAlt: string
}

export type ServicesContent = {
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  offerings: {
    eyebrow: string
    headline: string
    items: ServiceOffering[]
  }
  technology: {
    eyebrow: string
    headline: string
    description: string
    logos: Array<{ id: string; name: string }>
    categories: TechCategory[]
  }
  about: {
    eyebrow: string
    headline: string
    description: string
    cta: string
    imageUrl: string
    imageAlt: string
  }
  caseStudyHighlight: CaseStudyHighlightContent
  cta: {
    headline: string
    subheadline: string
    button: string
  }
}

export const defaultServicesContent: ServicesContent = {
  hero: {
    eyebrow: "Lakeside Services",
    title: "A Full-Stack Lead Generation System",
    description:
      "We build and operate the complete infrastructure behind predictable growth — paid acquisition, conversion systems, creative, and CRM — so your team can focus on closing, not chasing.",
  },
  offerings: {
    eyebrow: "What We Deliver",
    headline: "Everything Needed To Fill Your Pipeline",
    items: [
      {
        icon: "megaphone",
        title: "Paid Advertising",
        description:
          "High-intent Google and Meta campaigns engineered for qualified leads — with precise audience targeting, conversion tracking, and relentless optimization to lower cost per acquisition.",
      },
      {
        icon: "zap",
        title: "Marketing Automations",
        description:
          "Instant lead routing, multi-touch follow-up, and nurture sequences that respond in seconds — so no inquiry goes cold and every opportunity gets worked systematically.",
      },
      {
        icon: "palette",
        title: "Creative Support",
        description:
          "Performance-driven ad creative, landing page assets, and brand-aligned visuals built to convert — tested, refined, and deployed as part of one cohesive growth engine.",
      },
      {
        icon: "database",
        title: "CRM & Landing Page Integration",
        description:
          "A fully connected pipeline from first click to booked appointment — landing pages, forms, CRM workflows, and reporting unified in one system you can actually trust.",
      },
    ],
  },
  technology: {
    eyebrow: "Technology Stack",
    headline: "Best-in-Class Tools. One Connected System.",
    description:
      "We deploy and manage the platforms top-performing lead gen teams rely on — integrated, monitored, and optimized as a single operating system for your growth.",
    logos: [
      { id: "google", name: "Google" },
      { id: "meta", name: "Meta" },
      { id: "microsoft", name: "Microsoft" },
      { id: "youtube", name: "YouTube" },
      { id: "highlevel", name: "Go High Level" },
      { id: "zapier", name: "Zapier" },
      { id: "make", name: "Make" },
      { id: "calendly", name: "Calendly" },
    ],
    categories: [
      {
        title: "Ad Platforms",
        items: ["Google Ads", "Meta Ads", "YouTube Ads", "Microsoft Ads"],
        imageUrl: "/services/ad-platforms.svg",
        imageAlt: "Paid advertising campaign dashboard across Google, Meta, YouTube, and Microsoft",
      },
      {
        title: "CRM & Automation",
        items: ["Go High Level", "Zapier", "Make", "Calendly"],
        imageUrl: "/services/crm-automation.svg",
        imageAlt: "CRM pipeline and marketing automation workflow",
      },
      {
        title: "Analytics & Tracking",
        items: ["Google Analytics 4", "Google Tag Manager", "Call Tracking", "Conversion APIs"],
        imageUrl: "/services/analytics-tracking.svg",
        imageAlt: "Analytics dashboard with conversion tracking and performance metrics",
      },
    ],
  },
  about: {
    eyebrow: "About Lakeside",
    headline: "Built By Operators Who Understand Lead Gen",
    description:
      "Lakeside was founded to solve one problem: most businesses are forced to stitch together agencies, freelancers, and software that never talk to each other. We built an integrated team and system — strategy, media buying, creative, automation, and CRM — so you get one partner accountable for the full pipeline, not just one piece of it.",
    cta: "Learn About Lakeside",
    imageUrl: "/about/lakeside-meeting-lake-geneva.jpg",
    imageAlt: "The Lakeside team collaborating in Lake Geneva",
  },
  caseStudyHighlight: defaultCaseStudyHighlightContent,
  cta: {
    headline: "Ready to grow with a team you can trust?",
    subheadline:
      "Book a free consultation and let's talk about how Lakeside can help your clinic or organization thrive.",
    button: "Schedule a Consultation",
  },
}

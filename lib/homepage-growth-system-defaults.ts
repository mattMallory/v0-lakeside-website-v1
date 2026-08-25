import type { GrowthSystemContent } from "@/lib/homepage-template"
import { defaultCaseStudyHighlightContent } from "@/lib/case-study-highlight"

/** Empty until uploaded in Payload → Homepage → Backgrounds. */
export const growthSystemBackgrounds = {
  hero: "",
  who: "",
  pillars: "",
  included: "",
} as const

export const defaultGrowthSystemContent: GrowthSystemContent = {
  backgrounds: { ...growthSystemBackgrounds },

  heroEyebrow: "The Natural Practice Growth System",
  heroHeadline: "Stop wasting money on ad spend.",
  heroHeadlineAccent: "Build the system your clinic needs.",
  heroSubheadline:
    "A single ad is not a growth strategy. Lakeside builds the ad management, landing pages, follow-up, and reporting that turn clicks into attended, paying patients — and tells you exactly what your money is doing.",
  heroPrimaryCta: "Get Your Free Growth Audit",
  heroSecondaryCta: "See how it works ↓",
  heroStats: [
    { value: "5", label: "systems built per clinic" },
    { value: "24/7", label: "lead response coverage" },
    { value: "1", label: "dashboard, every dollar tracked" },
  ],

  whoEyebrow: "Who It's For",
  whoHeadline: "Built for owner-operated chiropractic practices",
  whoDescription:
    "Four things make this work. If they're true of your practice, the system pays for itself.",
  whoCriteria: [
    {
      icon: "users",
      title: "Owner-operated",
      description: "You make the call on the offer.",
    },
    {
      icon: "megaphone",
      title: "Already advertising",
      description: "Spending, but can't see what it buys.",
    },
    {
      icon: "activity",
      title: "Same-day front desk",
      description: "Someone answers new inquiries today.",
    },
    {
      icon: "line-chart",
      title: "Measured on visits",
      description: "Attended patients, not clicks.",
    },
  ],
  whoDisqualifier: "Not a fit for clinics chasing the cheapest possible lead.",

  funnelEyebrow: "How It Works",
  funnelHeadline: "The Lakeside New Patient System",
  funnelDescription:
    "Eight connected stages, from first click to attended visit. Every handoff between stages is a potential leak — we build and manage all eight so nothing falls through.",
  funnelLinkLabel: "The New Patient Funnel",
  funnelLinkUrl: "/blog",
  funnelSteps: [
    {
      tag: "Stage 1 · The Ad",
      title: "The right person sees the ad",
      detail:
        "We connect a recognizable concern to one clear introductory offer, so the ad doesn't over-promise or ask someone to become a patient immediately.",
      buttonLabel: "Targeted ads",
    },
    {
      tag: "Stage 2 · The Offer",
      title: "The offer creates a reason to respond",
      detail:
        "We explain who the visit is for, what happens, what they gain, and what to do next — not just a vague \"free consultation.\"",
      buttonLabel: "Offer design",
    },
    {
      tag: "Stage 3 · Landing Page",
      title: "The landing page builds trust",
      detail:
        "One focused message, authentic trust signals, and one primary action — not a busy homepage full of services and links.",
      buttonLabel: "Matching landing page",
    },
    {
      tag: "Stage 4 · Lead Capture",
      title: "The prospect raises their hand",
      detail:
        "A short form that collects only what's needed to continue the conversation, so no one abandons it halfway through.",
      buttonLabel: "Short intake form",
    },
    {
      tag: "Stage 5 · Fast Response",
      title: "The practice responds while interest is fresh",
      detail:
        "An immediate text or email, then prompt personal contact — automation closes the gap, follow-up builds the relationship.",
      buttonLabel: "Automated follow-up",
    },
    {
      tag: "Stage 6 · Scheduling",
      title: "Scheduling becomes easy",
      detail:
        "Clear appointment types, realistic availability, and mobile-friendly booking instead of limited call-in hours.",
      buttonLabel: "Online booking",
    },
    {
      tag: "Stage 7 · Reminders",
      title: "The appointment is protected",
      detail:
        "Appointment details, forms, directions, and reminders sent so the patient never forgets, gets uncertain, or misses intake.",
      buttonLabel: "Reminder texts & emails",
    },
    {
      tag: "Stage 8 · The Visit",
      title: "The conversation happens",
      detail:
        "An in-office experience consistent with the ad, offer, and follow-up the patient already trusted enough to book.",
      buttonLabel: "Visit prep checklist",
    },
  ],

  pillarsEyebrow: "What We Build",
  pillarsHeadline: "Where the growth actually comes from",
  pillarsDescription:
    "Not more ad spend — these five parts of the system, each getting more out of every dollar you're already spending.",
  pillars: [
    {
      icon: "megaphone",
      title: "Better ad management",
      body: "Google & Meta campaigns built and optimized for ready-to-book patients, not cold traffic that never converts.",
    },
    {
      icon: "activity",
      title: "Higher show rates",
      body: "Reminder and confirmation sequences that get booked patients through the door.",
    },
    {
      icon: "sparkles",
      title: "Higher close rates",
      body: "Landing pages and offers built around real patient objections, turning more visits into starts of care.",
    },
    {
      icon: "users",
      title: "More virtual visits",
      body: "A virtual front desk that answers, books, and reschedules around the clock so no inquiry goes cold.",
    },
    {
      icon: "line-chart",
      title: "Stronger return on ad spend",
      body: "Reporting that ties every dollar of ad spend to a booked and attended patient.",
    },
  ],

  includedEyebrow: "What's Included",
  includedHeadline: "Everything the system needs, managed monthly",
  includedDescription:
    "One engagement covers the build and the ongoing management — you don't hire an ad agency, a web developer, and a follow-up tool separately.",
  includedItems: [
    {
      title: "Campaign build & management",
      body: "Google Search and Meta campaigns, keyword and audience work, creative, and ongoing optimization.",
    },
    {
      title: "Offer & landing page",
      body: "An introductory offer designed with you, plus a message-matched landing page built and hosted by us.",
    },
    {
      title: "Follow-up automation",
      body: "Instant text and email response, reminder sequences, and re-engagement for leads who didn't book.",
    },
    {
      title: "Booking & front-desk support",
      body: "Online scheduling wired to your real availability, with scripts and coverage so no inquiry sits.",
    },
    {
      title: "Reporting dashboard",
      body: "One view from spend to attended visit — leads, contact rate, bookings, show rate, and cost per new patient.",
    },
    {
      title: "Monthly strategy call",
      body: "A working review of the numbers with a short list of what we're changing next and why.",
    },
  ],

  caseStudyHighlight: defaultCaseStudyHighlightContent,

  resultsEyebrow: "Results",
  resultsHeadline: "What practices say",
  resultsPlaceholder:
    "PLACEHOLDER — send a real quote, practice name, location, and a photo to replace the featured testimonial below.",
  testimonials: [
    {
      photoUrl:
        "https://madebylakeside.com/wp-content/uploads/2023/11/DSC00468-dan-ourada-DC-lakeside.jpg",
      photoAlt: "Chiropractor working with a patient",
      quote:
        "One real quote from a practice owner — what changed, and the number that proves it.",
      name: "Doctor name, DC",
      practice: "Practice name · City, ST",
    },
  ],

  teamEyebrow: "Who You'll Work With",
  teamHeadline: "You'll work with our team — Pete, Matt, and Alex",
  teamDescription:
    "A small team, not an account manager passing your practice down a chain. The same three people build your system and stay on it.",
  teamImageUrl:
    "https://madebylakeside.com/wp-content/uploads/2023/11/hemmer-matt-pete-lake-geneva-DSC00103.jpg",
  teamImageAlt: "Lakeside team with a client",
  teamMembers: [
    {
      photoUrl:
        "https://madebylakeside.com/wp-content/uploads/2023/11/Pete-Headshot-Club-DSC00323-scaled.jpg",
      photoAlt: "Pete Wisniewski",
      name: "Pete Wisniewski",
      role: "Founder · Strategy & offer design",
      bio: "Pete sets the offer and the growth plan, and runs your monthly strategy call — built to be judged on new patients and ROI, not clicks.",
      linkedinUrl: "https://www.linkedin.com/in/pete-wisniewski",
    },
    {
      photoUrl: "",
      photoAlt: "Matt",
      name: "Matt",
      role: "Role · Area of focus",
      bio: "One line on what Matt owns day to day and what you'll come to him for.",
    },
    {
      photoUrl: "",
      photoAlt: "Alex",
      name: "Alex",
      role: "Role · Area of focus",
      bio: "One line on what Alex owns day to day and what you'll come to him for.",
    },
  ],

  articlesEyebrow: "Go Deeper",
  articlesHeadline: "Read the thinking behind the system",
  articlesLinkLabel: "View all articles →",

  nextEyebrow: "What Happens Next",
  nextHeadline: "Three steps, no pressure",
  nextSteps: [
    {
      title: "You request the audit",
      description:
        "Send a short note with your practice and what you're spending today. We reply the same business day.",
    },
    {
      title: "We review your funnel",
      description:
        "We look at your ads, landing page, response time, and show rate, then walk you through it on a 30-minute call.",
    },
    {
      title: "You get the fix list",
      description:
        "You keep the priorities whether or not we work together. If it's a fit, we scope the build from there.",
    },
  ],

  auditHeadline: "See where your funnel is leaking money.",
  auditDescription:
    "A free growth audit of your ads, landing page, show rate, and close rate — with a plan for what to fix first.",
  auditButtonLabel: "Request My Free Audit",
  auditButtonUrl: "/consultation",
}

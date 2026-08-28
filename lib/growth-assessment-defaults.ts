export type GrowthAssessmentIconCard = {
  icon: string
  title: string
  description: string
}

export type GrowthAssessmentStep = {
  label: string
  title: string
  description: string
}

export type GrowthAssessmentScenarioRow = {
  label: string
  value: string
}

export type GrowthAssessmentScenario = {
  title: string
  description: string
  rows: GrowthAssessmentScenarioRow[]
  featured?: boolean
}

export type GrowthAssessmentFinding = {
  title: string
  description: string
  consequence: string
  action: string
}

export type GrowthAssessmentFaqItem = {
  question: string
  answer: string
}

export type GrowthAssessmentContent = {
  heroEyebrow: string
  heroHeadline: string
  heroDescription: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroNote: string
  heroSamplePractice: string
  heroSampleScore: number
  heroTopOpportunity: string
  heroSuggestedRange: string
  heroPriorityActions: string[]
  problemEyebrow: string
  problemHeadline: string
  problemDescription: string
  problemStages: string[]
  problemHighlightStage: string
  problemFootnote: string
  assessEyebrow: string
  assessHeadline: string
  assessDescription: string
  assessItems: GrowthAssessmentIconCard[]
  howEyebrow: string
  howHeadline: string
  howSteps: GrowthAssessmentStep[]
  howNote: string
  reportEyebrow: string
  reportHeadline: string
  reportDescription: string
  reportChecklist: string[]
  reportSamplePlanLabel: string
  reportSamplePlanUrl: string
  financialEyebrow: string
  financialHeadline: string
  financialDescription: string
  financialDisclaimer: string
  financialScenarios: GrowthAssessmentScenario[]
  whoEyebrow: string
  whoHeadline: string
  whoFitItems: string[]
  whoNotFitItems: string[]
  whoNotFitNote: string
  whyEyebrow: string
  whyHeadline: string
  whyDescription: string
  whyItems: string[]
  findingsEyebrow: string
  findingsHeadline: string
  findingsItems: GrowthAssessmentFinding[]
  faqEyebrow: string
  faqHeadline: string
  faqItems: GrowthAssessmentFaqItem[]
  formEyebrow: string
  formHeadline: string
  formDescription: string
  formBullets: string[]
  formQuote: string
  formCtaLabel: string
  formShowInvestmentStep: boolean
  formInvestmentOptions: string[]
  formProcessingSteps: string[]
  seoTitle: string
  seoDescription: string
}

export const defaultGrowthAssessmentContent: GrowthAssessmentContent = {
  heroEyebrow: "Free Business Growth Assessment",
  heroHeadline: "Find the gaps slowing your practice's growth",
  heroDescription:
    "We look at your market, your website, your competition, your patient economics, your ad readiness, and what happens after someone calls. Then we turn it into a growth plan built for your practice. You give us a few details. We do the digging.",
  heroPrimaryCta: "Get My Free Growth Plan",
  heroSecondaryCta: "See a sample plan ↓",
  heroNote: "About two minutes. No account access required.",
  heroSamplePractice: "Sample Report — Riverbend Chiropractic",
  heroSampleScore: 62,
  heroTopOpportunity: "Website conversion — traffic isn't booking",
  heroSuggestedRange: "$2,500–$4,000 / month",
  heroPriorityActions: [
    "Add a clear booking path to the top of every service page",
    "Set up same-hour response to new inquiries",
    "Install call and form tracking before spending on ads",
  ],
  problemEyebrow: "The Real Problem",
  problemHeadline: "More marketing won't fix a broken system",
  problemDescription:
    "You can double your traffic and still not grow. If the offer is unclear, the website doesn't convert, calls go unanswered, or nobody follows up fast, more advertising just spends faster. Growth runs along a path, and one weak stage caps everything after it.",
  problemStages: [
    "Market demand",
    "Visibility",
    "Website conversion",
    "Lead response",
    "Appointment",
    "New patient",
    "Retention & referrals",
  ],
  problemHighlightStage: "Website conversion",
  problemFootnote:
    "One weak stage caps everything before it. Here that's website conversion. The assessment finds yours.",
  assessEyebrow: "What We Assess",
  assessHeadline: "Eight areas, one complete picture",
  assessDescription:
    "This is a business growth assessment, not a website audit. We score all eight and show you which ones actually matter right now.",
  assessItems: [
    {
      icon: "map-pin",
      title: "Market Opportunity",
      description: "Is there enough local demand for the services you want to grow?",
    },
    {
      icon: "circle-dollar-sign",
      title: "Business Economics",
      description: "What can you afford to spend to bring in a new patient?",
    },
    {
      icon: "eye",
      title: "Visibility",
      description:
        "Can patients find you through search, maps, content, and AI-assisted discovery?",
    },
    {
      icon: "monitor",
      title: "Website Conversion",
      description: "Does your website turn interested visitors into calls, forms, and appointments?",
    },
    {
      icon: "megaphone",
      title: "Advertising Readiness",
      description: "Would ads grow the practice right now, or just spend faster?",
    },
    {
      icon: "message-square",
      title: "Patient Follow-Up",
      description: "What happens after someone calls, submits a form, or misses an appointment?",
    },
    {
      icon: "bar-chart-3",
      title: "Measurement & Tracking",
      description: "Can you connect marketing activity to appointments and revenue?",
    },
    {
      icon: "signpost",
      title: "Growth Roadmap",
      description: "Which improvements should happen first — and what can wait?",
    },
  ],
  howEyebrow: "How It Works",
  howHeadline: "Three steps. Two minutes of your time.",
  howSteps: [
    {
      label: "Step 1",
      title: "Tell us what you want to grow",
      description:
        "Your website, primary service, location, patient value, and growth goal. Just the things we can't find on our own.",
    },
    {
      label: "Step 2",
      title: "We research the practice and market",
      description:
        "We review your website, local competitors, market demand, estimated advertising costs, conversion path, and growth systems.",
    },
    {
      label: "Step 3",
      title: "Get a plan built for your practice",
      description:
        "Clear priorities, real numbers, and a 90-day sequence. It's yours to keep and use however you like.",
    },
  ],
  howNote:
    "No lengthy questionnaire. No access to your Google Ads, CRM, or analytics is required for the initial assessment.",
  reportEyebrow: "What You Receive",
  reportHeadline: "A growth plan you can actually use",
  reportDescription:
    "The report answers three questions: what to fix first, where growth is leaking, and what you can reasonably afford to invest.",
  reportChecklist: [
    "Overall growth score",
    "Eight-pillar scorecard",
    "Top three growth constraints",
    "Local competitive position",
    "Estimated market opportunity",
    "Advertising budget scenarios",
    "Website conversion findings",
    "Follow-up opportunities",
    "Measurement gaps",
    "Recommended 90-day roadmap",
    "Assumptions & limitations",
    "Recommended next step",
  ],
  reportSamplePlanLabel: "Read a full five-page sample plan",
  reportSamplePlanUrl: "#",
  financialEyebrow: "Financial Scenarios",
  financialHeadline: "Your plan includes numbers, not adjectives",
  financialDescription:
    "We model three investment levels against your market and your patient value. Here's the shape of it, with example numbers.",
  financialDisclaimer:
    "Actual results depend on market conditions, competition, patient value, conversion rates, follow-up, capacity, and execution. Estimates are not guarantees. Your plan uses your market's data and your patient value — these figures illustrate the format only.",
  financialScenarios: [
    {
      title: "Conservative",
      description: "Lower investment, cautious assumptions, foundation-first plan.",
      rows: [
        { label: "Monthly investment", value: "$1,500" },
        { label: "Estimated leads", value: "12–18 / mo" },
        { label: "Estimated new patients", value: "5–8 / mo" },
        { label: "Est. initial revenue", value: "$3,500–$5,600" },
      ],
    },
    {
      title: "Expected",
      description:
        "Balanced investment based on market demand and reasonable conversion assumptions.",
      featured: true,
      rows: [
        { label: "Monthly investment", value: "$3,000" },
        { label: "Estimated leads", value: "25–35 / mo" },
        { label: "Estimated new patients", value: "10–15 / mo" },
        { label: "Est. initial revenue", value: "$7,000–$10,500" },
      ],
    },
    {
      title: "Growth",
      description:
        "Higher investment for practices with capacity, follow-up systems, and stronger economics.",
      rows: [
        { label: "Monthly investment", value: "$5,500" },
        { label: "Estimated leads", value: "45–60 / mo" },
        { label: "Estimated new patients", value: "18–26 / mo" },
        { label: "Est. initial revenue", value: "$12,600–$18,200" },
      ],
    },
  ],
  whoEyebrow: "Who This Is For",
  whoHeadline: "Built for practices ready to grow more intentionally",
  whoFitItems: [
    "You want more predictable new-patient growth",
    "You're considering Google Ads",
    "You're spending on marketing but can't clearly measure results",
    "Your practice depends heavily on referrals",
    "Your website gets traffic but few appointments",
    "You want to understand an appropriate marketing budget",
    "You have capacity for additional patients",
    "You want a plan before hiring an agency",
  ],
  whoNotFitItems: [
    "You don't have capacity for new patients right now",
    "You're looking for guaranteed rankings or patient volume",
    "You're not able to track leads and appointments",
    "You want a single tactic without improving the surrounding system",
  ],
  whoNotFitNote:
    "Not there yet? Keep the plan anyway. Plenty of practices use it as the to-do list first.",
  whyEyebrow: "Why Lakeside",
  whyHeadline: "We look at the business behind the marketing",
  whyDescription:
    "We connect market demand, patient economics, your website, advertising, automation, follow-up, and reporting into one growth system you can measure — not a stack of disconnected tactics.",
  whyItems: [
    "Business-first recommendations",
    "Healthcare practice experience",
    "Transparent assumptions",
    "Financially grounded planning",
    "Website, ads, automation & follow-up considered together",
    "No arbitrary advertising budgets",
    "No unsupported growth guarantees",
    "Practical implementation roadmap",
  ],
  findingsEyebrow: "Sample Findings",
  findingsHeadline: "What a finding looks like",
  findingsItems: [
    {
      title: "Strong demand, weak conversion",
      description:
        "Your local market may support growth, but the website doesn't give patients a clear next step.",
      consequence: "Demand you're already paying to attract leaves without booking.",
      action:
        "Fix the conversion path before adding traffic — clearer offer, visible booking, fewer steps.",
    },
    {
      title: "Good leads, slow follow-up",
      description: "Inquiries are coming in, but response times and follow-up are inconsistent.",
      consequence: "Appointments are lost in the hours between interest and reply.",
      action: "Build same-hour response — a person or a system — before increasing lead volume.",
    },
    {
      title: "Advertising before foundation",
      description:
        "Paid campaigns may be premature until tracking, landing pages, and appointment handling are ready.",
      consequence: "Ad spend produces activity you can't measure and leads you can't keep.",
      action: "Sequence the roadmap: foundation first, then paid traffic with full measurement.",
    },
  ],
  faqEyebrow: "Questions",
  faqHeadline: "Common questions",
  faqItems: [
    {
      question: "Is the assessment really free?",
      answer: "Yes. It's free, and there's no contract.",
    },
    {
      question: "How long does it take?",
      answer:
        "The form takes about two minutes. Then we do the research on our end, using what you gave us plus public data.",
    },
    {
      question: "Do you need access to our accounts?",
      answer:
        "Not for the initial assessment. Google Ads, analytics, CRM, and call-tracking access may be requested later if the practice wants a verified implementation plan.",
    },
    {
      question: "Are the projections guaranteed?",
      answer:
        "No. Financial and patient-growth scenarios are estimates based on available information and stated assumptions.",
    },
    {
      question: "What happens after I receive the plan?",
      answer:
        "You can use the plan independently or schedule a call with Lakeside to discuss implementation. There's no obligation either way.",
    },
    {
      question: "Will this work for a new practice?",
      answer:
        "The assessment can still be useful, but projections will be less certain when historical patient, conversion, and revenue data are limited.",
    },
  ],
  formEyebrow: "Start Your Assessment",
  formHeadline: "See what's actually limiting your practice's growth",
  formDescription:
    "Answer a few questions. We'll build the plan around your market, your economics, your website, your competition, and your patient journey.",
  formBullets: ["No obligation", "No account access", "About two minutes to begin"],
  formQuote:
    'And if the honest answer is "don\'t advertise yet," that\'s what your plan will say. No gimmicks.',
  formCtaLabel: "Get My Free Growth Plan",
  formShowInvestmentStep: true,
  formInvestmentOptions: [
    "Under $1,500",
    "$1,500–$3,000",
    "$3,000–$5,000",
    "$5,000–$10,000",
    "More than $10,000",
    "Not sure yet",
  ],
  formProcessingSteps: [
    "Reviewing your practice",
    "Identifying services and locations",
    "Comparing local competitors",
    "Estimating market demand",
    "Evaluating website conversion",
    "Building financial scenarios",
    "Preparing your growth roadmap",
  ],
  seoTitle: "Business Growth Assessment | Lakeside",
  seoDescription:
    "Get a free business growth assessment for your practice. We analyze market demand, website conversion, follow-up, and ad readiness — then deliver a practical growth plan.",
}

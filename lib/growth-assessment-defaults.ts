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

export type GrowthAssessmentDataSource = {
  icon: string
  title: string
  description: string
}

export type GrowthAssessmentUseCase = {
  number: string
  title: string
  description: string
}

export type GrowthAssessmentPractitioner = {
  name: string
  specialty: string
  quote: string
  photoUrl?: string
  initials?: string
  /** Optional link to a related case study or article. */
  caseStudyUrl?: string
  caseStudyLabel?: string
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
  dataEyebrow: string
  dataHeadline: string
  dataDescription: string
  dataCredibilityLine: string
  dataSources: GrowthAssessmentDataSource[]
  dataHumanReviewLabel: string
  dataFlowSteps: string[]
  dataSourcesNote: string
  useCasesHeadline: string
  useCasesDescription: string
  useCases: GrowthAssessmentUseCase[]
  dataBridgeLine: string
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
  practitionersEyebrow: string
  practitionersHeadline: string
  practitionersDescription: string
  practitioners: GrowthAssessmentPractitioner[]
  formEyebrow: string
  formHeadline: string
  formDescription: string
  formBullets: string[]
  formQuote: string
  formCtaLabel: string
  sectionCtaLabel: string
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
  dataEyebrow: "Real Analysis",
  dataHeadline: "Real Data. Real Analysis. Reviewed by a Real Marketer.",
  dataDescription:
    "Your Growth Assessment isn't generated from a few prompts and generic marketing advice.\n\nLakeside combines live search, advertising, geographic, demographic, website and local-market data to build a picture of where your practice stands — and where the strongest opportunities may be.\n\nThen someone from our team actually reviews it.\n\nWe're picking up the cost of the data, technology and professional review because we'd rather show you what we can uncover than tell you how good we are.",
  dataCredibilityLine: "Built from multiple independent data sources — not assumptions.",
  dataSources: [
    {
      icon: "line-chart",
      title: "Search Demand",
      description: "What patients are actually searching for.",
    },
    {
      icon: "circle-dollar-sign",
      title: "Advertising Costs",
      description: "Current CPCs, competition and paid-search opportunity.",
    },
    {
      icon: "map-pin",
      title: "Local Market",
      description: "Population, income and geographic opportunity.",
    },
    {
      icon: "eye",
      title: "Google Presence",
      description: "Local visibility and competitive positioning.",
    },
    {
      icon: "monitor",
      title: "Website Performance",
      description: "Conversion opportunities and potential friction.",
    },
    {
      icon: "bar-chart-3",
      title: "Business Economics",
      description: "Patient value, budget and realistic acquisition targets.",
    },
  ],
  dataHumanReviewLabel: "+ Lakeside Human Review",
  dataFlowSteps: ["Data", "Lakeside Analysis", "Human Review", "Actionable Plan"],
  dataSourcesNote:
    "Sources include Google, Google Maps, advertising data, SEO and search intelligence, demographic information, and Lakeside's proprietary analysis.",
  useCasesHeadline: "See what's actually holding your practice back.",
  useCasesDescription:
    "The assessment isn't designed to give you another score to look at. It's designed to help answer practical growth questions.",
  useCases: [
    {
      number: "01",
      title: "Find Your Best Markets",
      description:
        "See where patient demand exists and whether your current service area is targeting the right communities.",
    },
    {
      number: "02",
      title: "Understand Search Demand",
      description:
        "See what people are searching for around your services — and where demand may be stronger or weaker than expected.",
    },
    {
      number: "03",
      title: "Set a Realistic Ad Budget",
      description:
        "Compare current search costs, patient value and acquisition assumptions before deciding what you should spend.",
    },
    {
      number: "04",
      title: "Find Website Friction",
      description:
        "Identify issues that may be preventing traffic from turning into new-patient inquiries.",
    },
    {
      number: "05",
      title: "Evaluate Your Current Marketing",
      description:
        "Compare what you're doing today against the opportunities visible in your market.",
    },
    {
      number: "06",
      title: "Know What to Fix First",
      description:
        "Turn dozens of marketing data points into a shorter list of priorities that can actually move the practice forward.",
    },
  ],
  dataBridgeLine: "You don't need more marketing data. You need to know what to do with it.",
  howEyebrow: "How It Works",
  howHeadline: "Three steps. Two minutes of your time.",
  howSteps: [
    {
      label: "Step 1",
      title: "Tell us what you want to grow",
      description:
        "Your website, primary service, zip code, patient value, and growth goal. Just the things we can't find on our own.",
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
  practitionersEyebrow: "Built From Real Experience",
  practitionersHeadline: "We don't just study practice growth. We work on it every day.",
  practitionersDescription:
    "Lakeside works alongside chiropractors, acupuncturists, nutrition-focused practices and natural healthcare teams to solve the same problems we're evaluating in your Growth Assessment.\n\nMore qualified patients. Better advertising. Better follow-up. Better visibility into what's actually working.",
  practitioners: [
    {
      name: "Dr. Bill Hemmer",
      specialty: "Chiropractic + Nutrition",
      quote:
        "Lakeside has given us a clear, consistent way to reach more people and turn that attention into real growth for our practice. I would highly recommend them to any clinic looking to grow.",
      initials: "BH",
      caseStudyUrl: "/blog/tuscola-pain-wellness-center-case-study",
      caseStudyLabel: "Read case study",
    },
    {
      name: "Dr. Dan Ourada",
      specialty: "Chiropractic",
      quote:
        "Lakeside understands that growing a practice takes more than simply running ads. They have helped us create a clearer strategy for reaching the right people and turning that interest into real opportunities for growth.",
      initials: "DO",
    },
    {
      name: "Dr. Shannon Roznay",
      specialty: "Chiropractic + NRT",
      quote:
        "The Lakeside team understands natural healthcare and the importance of communicating what makes a practice different. They have helped us strengthen our online presence and connect with more of the people we are here to serve.",
      initials: "SR",
    },
    {
      name: "Gerald Roliz",
      specialty: "CNC",
      quote:
        "Lakeside has helped our team use website development, email marketing, and digital advertising to generate leads and increase online sales.",
      initials: "GR",
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
  sectionCtaLabel: "Get Your Free Growth Plan",
  formShowInvestmentStep: false,
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

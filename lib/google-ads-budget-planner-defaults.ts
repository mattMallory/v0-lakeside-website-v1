import { createLexicalArticleContent } from "@/lib/lexical-helpers"

export const defaultGoogleAdsBudgetPlannerPost = {
  title: "How much should a chiropractic practice spend on Google Ads?",
  slug: "google-ads-budget-planner",
  excerpt:
    "A practical budgeting guide based on local competition, patient value, landing-page conversion, lead follow-up, SEO, and return on investment — with a planner that gives you a real starting number.",
  categorySlug: "digital-marketing",
  tagSlugs: ["google-ads", "analytics", "landing-pages"],
  authorName: "Pete Wisniewski",
  readTime: "12 min read",
  publishedAt: "2026-07-28T10:00:00.000Z",
  featuredImagePath: "/about/hero.jpg",
  featuredImageAlt: "Lakeside Marketing team meeting",
  content: createLexicalArticleContent([
    {
      type: "p",
      text: '"How much should our chiropractic office spend on Google Ads?"',
    },
    {
      type: "p",
      text: "Most practice owners want a simple number. But the right budget depends on more than the size of the office.",
    },
    {
      type: "p",
      text: "A chiropractic practice in a small town faces a different advertising market than a clinic in Naperville, Chicago, or Milwaukee. A general family chiropractic campaign also has different economics than a campaign promoting a higher-value neuropathy, functional nutrition, or chronic pain program.",
    },
    {
      type: "p",
      text: "At Lakeside Marketing, we recommend setting the budget by working backward from three questions:",
    },
    {
      type: "bulletList",
      items: [
        "What is a new patient worth?",
        "How competitive is the local market?",
        "How effectively does the practice turn leads into patients?",
      ],
    },
    {
      type: "callout",
      text: "The goal is not to purchase the most clicks. The goal is to generate qualified patient opportunities at a cost the practice can support.",
    },
    {
      type: "h2",
      text: "A practical Google Ads budget",
    },
    {
      type: "p",
      text: "For many independent chiropractic practices, monthly Google Ads spending generally falls into three planning ranges.",
    },
    {
      type: "cardGrid",
      cards: [
        {
          title: "$750–$1,000",
          description:
            "A focused test — one service, one area, one landing page. Enough to test the offer; data comes in slowly.",
        },
        {
          title: "$1,000–$1,500",
          description:
            "A practical start — a stronger starting range for many suburban offices targeting back pain, sciatica, and general care.",
        },
        {
          title: "$1,500–$3,000+",
          description:
            "Competitive growth — competitive markets or specialized, higher-value services with longer decision cycles.",
        },
      ],
    },
    {
      type: "p",
      text: "Google calculates monthly spending limits using an average of 30.4 days per month, though actual daily spending can fluctuate.",
    },
    { type: "budgetPlanner" },
    {
      type: "h2",
      text: "Local competition changes the cost",
    },
    {
      type: "p",
      text: "Google Ads operates through an auction. Advertisers compete for visibility each time an eligible search occurs. Ad position and cost are influenced by bids, relevance, quality, competition, and other auction factors. Competition can vary significantly within the same region.",
    },
    {
      type: "p",
      text: 'A broad keyword can generate substantial traffic but may include people who are not looking for chiropractic care. A more specific search such as "chiropractor for sciatica near me" may produce fewer clicks, but the person searching is closer to making a decision. Google\'s Auction Insights reporting can show which advertisers appear in the same auctions and how frequently they show above or alongside your practice.',
    },
    {
      type: "h2",
      text: "A realistic example: the general office",
    },
    {
      type: "p",
      text: "Consider a suburban practice offering traditional chiropractic care, spending $1,200/month at an $8 average cost per click. That produces roughly 150 clicks. If 10% become leads, that's 15 inquiries. If 20% of those leads become patients, the practice adds about 3 new patients per month — a cost of roughly $400 per acquired patient before overhead.",
    },
    {
      type: "h2",
      text: "A realistic example: the higher-value program",
    },
    {
      type: "p",
      text: "Now a chiropractic nutrition office promoting a $3,000 care program, spending $2,000/month. It generates 16 leads, 10 qualified, 7 consults booked, 5 attended, and 2 new patients — a cost of $1,000 per patient. At first glance that seems high. But two patients at $3,000 each represent $6,000 in revenue.",
    },
    {
      type: "callout",
      text: "A $60 lead may be too expensive for a low-value adjustment — and very reasonable for a comprehensive cash-pay program. Patient value sets the budget, not a national average.",
    },
    {
      type: "h2",
      text: "Cost per click is not the most important number",
    },
    {
      type: "p",
      text: "Owners fixate on cost per click because it's easy to see. But a cheap click can still be a poor investment. Compare two campaigns: one at $4 per click with a 2% conversion rate versus one at $9 per click with an 8% conversion rate. The more expensive click may produce a lower cost per lead and a better patient.",
    },
    {
      type: "h2",
      text: "The landing page can make or break the budget",
    },
    {
      type: "p",
      text: "Two offices each spend $1,500 and get 150 clicks. One sends traffic to a busy homepage; the other to a dedicated sciatica consultation page. The homepage offers ten services, several menus, a generic contact form, and no clear offer. The dedicated page explains who it's for, what's evaluated, what happens first, credentials, and one clear next step. Same spend — more than twice the opportunities.",
    },
    {
      type: "p",
      text: "Before increasing ad spend, check whether the landing page is focused, credible, mobile-friendly, and easy to act on.",
    },
    {
      type: "h2",
      text: "The offer affects lead quality",
    },
    {
      type: "p",
      text: '"New patients welcome. Schedule today." is clear, but gives a cold prospect little reason to act now. A more defined offer usually works harder:',
    },
    {
      type: "tagPills",
      pills: [
        "Sciatica Consultation",
        "Neuropathy Assessment",
        "Complimentary Discovery Call",
        "New Patient Exam",
        "Functional Nutrition Evaluation",
      ],
    },
    {
      type: "p",
      text: "Discounted introductory visits can generate more leads, but can also attract price-driven prospects. Evaluate lead quality and patient conversion — not just form submissions.",
    },
    {
      type: "h2",
      text: "Front-desk follow-up is part of PPC performance",
    },
    {
      type: "p",
      text: "A clinic may believe its ads are failing when the real issue is lead response. Two offices get the same 20 leads: one responds within minutes and books 6 consultations; the other responds sporadically and books 2. Same leads — the first office simply converted more. This is why Lakeside treats paid ads, landing pages, CRM tracking, and follow-up as one connected patient-acquisition system.",
    },
    {
      type: "h2",
      text: "Google Ads and SEO play different roles",
    },
    {
      type: "p",
      text: 'Google Ads help you appear quickly for high-intent searches; SEO builds long-term visibility for service, educational, and local searches. Use ads to learn that "sciatica chiropractor" generates qualified consultations — then build a dedicated service page, FAQ content, Google Business Profile updates, and local articles around it. Paid search produces immediate data; SEO builds lasting trust.',
    },
    {
      type: "h2",
      text: "How AI is changing chiropractic search",
    },
    {
      type: "p",
      text: 'Patients increasingly use longer, conversational searches — "What kind of chiropractor should I see for sciatica?" or "Is chiropractic care appropriate for neuropathy?" Google\'s AI features can answer some informational questions directly, which may reduce traffic to generic articles that just repeat what\'s available everywhere.',
    },
    {
      type: "p",
      text: "For a practice, stronger content means your actual care process, who each service is for, local details, original photos and videos, credentials, and transparent next steps. AI-assisted search doesn't eliminate local patient intent — a patient still has to choose a real practice, judge its credibility, and book.",
    },
    {
      type: "h2",
      text: "When should a practice spend more?",
    },
    {
      type: "p",
      text: "Increase the budget when the system underneath it is working:",
    },
    {
      type: "bulletList",
      items: [
        "Leads are qualified and traceable to the campaign",
        "Patients are booking consistently from paid traffic",
        "Cost per acquired patient stays well below patient value",
        "Front-desk follow-up is fast and documented",
      ],
    },
    {
      type: "p",
      text: "If you're spending $1,200 and consistently generating profitable patients, moving to $1,500–$2,000 may be reasonable. If you're generating leads but not contacting them, fix follow-up first — don't buy more traffic.",
    },
    {
      type: "h2",
      text: "So, how much should you spend?",
    },
    {
      type: "p",
      text: "For many established chiropractic and natural-health practices, Lakeside recommends planning for $750–$1,000 for a tightly focused test, $1,000–$1,500 as a practical starting range, and $1,500–$3,000+ for competitive markets or specialized services.",
    },
    {
      type: "p",
      text: "Also plan for the system around the ad spend: campaign management, landing-page development, conversion tracking, CRM setup, automated follow-up, and reporting. The correct budget isn't based on what another chiropractor spends. It's based on your market, your patient value, your conversion process, your capacity, and your growth goals.",
    },
    {
      type: "references",
      label: "References",
      items: [
        {
          text: "Google. (2024). How Google Ads bidding works.",
          url: "https://support.google.com/google-ads/answer/2459326",
          linkLabel: "Google Ads bidding",
        },
        {
          text: "Google. (2024). Auction Insights report.",
          url: "https://support.google.com/google-ads/answer/2579752",
          linkLabel: "Auction Insights",
        },
        {
          text: "Google Search Central. (2024). Creating helpful, reliable, people-first content.",
          url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
          linkLabel: "Helpful content guidance",
        },
      ],
    },
    {
      type: "authorBio",
      name: "Pete Wisniewski",
      role: "Founder, Lakeside Marketing",
      bio: "Pete helps chiropractic and natural-health practices build predictable patient-acquisition systems — combining paid search, landing pages, and follow-up into one measurable growth engine.",
      linkedinUrl: "https://www.linkedin.com/in/pete-wisniewski",
    },
    {
      type: "articleCta",
      eyebrow: "Build the system before scaling the spend",
      title: "Google Ads shouldn't be measured by clicks, but by new-patient relationships.",
      description:
        "Our Natural Practice Growth System connects ads, landing pages, follow-up, and reporting into one system measured by ROI. Serving practices across the United States.",
      ctaLabel: "DEMO",
      ctaUrl: "/consultation",
    },
  ]),
}

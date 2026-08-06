import { createLexicalArticleContent } from "@/lib/lexical-helpers"
import { defaultPatientJourneyBlock } from "@/lib/patient-journey-defaults"

export const defaultColdAdvertisingPost = {
  title: "Why cold advertising fails for most chiropractic practices",
  slug: "why-cold-advertising-fails",
  excerpt:
    "And what actually gets new patients to book. Most campaigns don't fail because of the platform — they fail because the offer was never designed for a cold audience.",
  categorySlug: "digital-marketing",
  tagSlugs: ["google-ads", "facebook-ads", "landing-pages", "analytics"],
  authorName: "Pete Wisniewski",
  readTime: "9 min read",
  publishedAt: "2026-07-15T10:00:00.000Z",
  content: createLexicalArticleContent([
    {
      type: "p",
      text: "If you've ever tried Facebook or Google Ads and walked away thinking, “paid advertising doesn't work for chiropractors,” you're not alone. But most campaigns don't fail because of the platform — they fail because the offer isn't designed for a cold audience.",
    },
    {
      type: "p",
      text: "Someone scrolling Facebook isn't actively looking for your practice. They don't know you, they don't trust you, and they aren't ready to commit to care. Cold traffic needs a low-friction first step.",
    },
    {
      type: "p",
      text: "At Lakeside, we help natural-health practices build patient-acquisition systems that earn trust before asking for commitment. The interactive below walks through the six moments that decide whether an ad becomes a patient.",
    },
    { type: "patientJourney", fields: defaultPatientJourneyBlock },
    {
      type: "h2",
      text: "Cold audiences think differently than referrals",
    },
    {
      type: "p",
      text: "A referral arrives with built-in trust. A cold lead arrives skeptical, distracted, and unconvinced. Your marketing has to meet them where they are — not where you wish they were. Before they ever book, cold prospects are quietly asking:",
    },
    {
      type: "bulletList",
      items: [
        "Can I trust this clinic?",
        "Do they understand my problem?",
        "Is this actually different?",
        "Is this worth my time?",
      ],
    },
    {
      type: "p",
      text: "Your ad and landing page need to answer those questions before asking for a commitment.",
    },
    {
      type: "h2",
      text: "The biggest mistake we see",
    },
    {
      type: "p",
      text: "Many practices send paid traffic straight to their homepage, which asks visitors to read about the clinic, learn about every service, navigate several pages, call the office, and fill out a generic contact form. That's simply too much work for someone who has never heard of you.",
    },
    {
      type: "callout",
      text: "Cold traffic needs clarity — not choices.",
    },
    {
      type: "h2",
      text: "Your offer matters more than your ad",
    },
    {
      type: "p",
      text: "Many clinics spend weeks perfecting ad copy while giving little attention to what they're actually offering. The advertisement gets attention; the offer creates action. Instead of “schedule an appointment,” try a first step that feels educational and helpful:",
    },
    {
      type: "tagPills",
      pills: [
        "Free Health Strategy Session",
        "Complimentary Discovery Call",
        "Neuropathy Assessment",
        "Fatigue & Energy Assessment",
        "New Patient Consultation",
      ],
    },
    {
      type: "p",
      text: "These offers reduce perceived risk while giving prospective patients a reason to start a conversation.",
    },
    {
      type: "h2",
      text: "Sell the conversation — not the treatment",
    },
    {
      type: "p",
      text: "One of the biggest mindset shifts is understanding that your ad shouldn't try to sell chiropractic care. It should sell the next conversation. The goal isn't “become a patient today” — it's “let's determine whether we're the right fit.” That small shift often produces significantly higher conversion, because people feel less pressure and more curiosity.",
    },
    {
      type: "h2",
      text: "Every great ad needs a dedicated landing page",
    },
    {
      type: "p",
      text: "Imagine running a newspaper ad that says “call us for a free consultation” — then sending everyone to a phone directory. That's essentially what happens when paid ads point to a busy homepage. A dedicated landing page should have one objective: book the consultation. It focuses on the patient's problem, your unique approach, why they should trust you, a simple form or scheduling option, and clear next steps. Nothing more.",
    },
    {
      type: "h2",
      text: "Speed wins more patients than most clinics realize",
    },
    {
      type: "p",
      text: "Generating a lead is only half the battle. Responding quickly is often the difference between booking the consultation and losing it to another practice — studies consistently show leads contacted quickly are far more likely to engage. That's why modern practices automate instant messages the moment a lead comes in:",
    },
    {
      type: "bulletList",
      items: [
        "A confirmation email and text message",
        "Booking instructions and appointment reminders",
        "Follow-up messages if no appointment is scheduled",
      ],
    },
    {
      type: "p",
      text: "Patients expect fast communication. Practices that deliver it stand out.",
    },
    {
      type: "h2",
      text: "Great campaigns don't stop at the click",
    },
    {
      type: "p",
      text: "Successful patient acquisition isn't just advertising — it's an entire system working together. When each piece supports the others, advertising becomes far more predictable.",
    },
    {
      type: "cardGrid",
      cards: [
        {
          title: "A clear offer",
          description: "One focused reason for someone to respond.",
        },
        {
          title: "Targeted advertising",
          description: "Reaching the right local audience at the right time.",
        },
        {
          title: "A conversion-focused page",
          description: "Designed around one action — not ten.",
        },
        {
          title: "Automated follow-up",
          description: "Helping interested prospects book while still engaged.",
        },
        {
          title: "Lead tracking",
          description: "Knowing which campaigns produce consultations, not just clicks.",
        },
      ],
    },
    {
      type: "h2",
      text: "Creative matters more than fancy design",
    },
    {
      type: "p",
      text: "Many clinics believe they need expensive video production before running ads. In reality, authenticity often performs better. Patients respond to a welcoming practitioner photo, real clinic images, simple educational videos recorded on a phone, genuine testimonials, and honest explanations of your process. Professional production helps — but trust is what truly drives results.",
    },
    {
      type: "h2",
      text: "Is paid advertising right for every practice?",
    },
    {
      type: "p",
      text: "Not always. Paid advertising works best when a practice wants to consistently generate new patient conversations — and has the systems in place to respond, follow up, and track results.",
    },
    {
      type: "callout",
      text: "Advertising amplifies an already solid patient experience. It doesn't replace one.",
    },
    {
      type: "h2",
      text: "Building a patient growth system",
    },
    {
      type: "p",
      text: "At Lakeside, we don't believe successful advertising starts with an ad. It starts with a complete patient-acquisition system. Our Natural Practice Growth System combines strategic offer positioning, Meta and Google advertising, conversion-focused landing pages, CRM setup and lead tracking, automated email and SMS follow-up, consultation booking workflows, and monthly optimization and reporting — because generating a lead is only the beginning. Helping that lead become a lifelong patient is where sustainable growth happens.",
    },
    {
      type: "references",
      items: [
        {
          text: "Burg, B. (2005). Endless Referrals: Network Your Everyday Contacts Into Sales (3rd ed.). McGraw-Hill Education.",
        },
        {
          text: "Harvard Business Review. (2011, March). The Short Life of Online Sales Leads.",
          url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
          linkLabel: "The Short Life of Online Sales Leads",
        },
        {
          text: "InsideSales.com. (2012). The Lead Response Management Study.",
        },
        {
          text: "Unbounce. (2024). Conversion Rate Optimization: Best Practices for Landing Page Design and Friction Reduction.",
        },
      ],
    },
    {
      type: "authorBio",
      name: "Pete Wisniewski",
      role: "Founder, Lakeside Marketing",
      bio: "Pete helps natural-health practices build predictable patient-acquisition systems — combining paid media, landing pages, and follow-up into one growth engine.",
      linkedinUrl: "https://www.linkedin.com/in/pete-wisniewski",
    },
    {
      type: "articleCta",
      eyebrow: "Ready to generate more qualified consultations?",
      title:
        "The best advertising doesn't convince people to become patients — it gives the right people a reason to start the conversation.",
      description:
        "Serving chiropractic, functional medicine, and natural-health practices across Chicagoland, Northern Illinois, and Southeast Wisconsin. We'll review your marketing, evaluate your creative, and see whether a patient-acquisition system fits your practice.",
      ctaLabel: "Schedule a conversation",
      ctaUrl: "/consultation",
    },
  ]),
}

import { createLexicalArticleContent } from "@/lib/lexical-helpers"

export const defaultChiropracticOfferBuilderPost = {
  title: "The best offers for chiropractic advertising",
  slug: "best-chiropractic-advertising-offers",
  excerpt:
    "Why “free consultation” isn't always your strongest offer — and what converts better. The best offers make the next step feel clear, relevant, and worthwhile.",
  categorySlug: "digital-marketing",
  tagSlugs: ["google-ads", "facebook-ads", "landing-pages"],
  authorName: "Pete Wisniewski",
  readTime: "10 min read",
  publishedAt: "2026-08-04T10:00:00.000Z",
  featuredImagePath: "/about/hero.jpg",
  featuredImageAlt: "Lakeside Marketing team meeting",
  content: createLexicalArticleContent([
    {
      type: "p",
      text: "“Free consultation” sounds like an easy offer.",
    },
    {
      type: "p",
      text: "It costs the prospective patient nothing, it gives the practice a way to start a conversation, and it works across Google, Facebook, and Instagram. But there's one problem: most patients don't know what a free consultation actually means. Will they speak with the chiropractor? Receive an examination? Be pressured into a care plan? How long will it take?",
    },
    {
      type: "p",
      text: "When an offer creates more questions than answers, “free” may not be enough to make someone respond. The best chiropractic advertising offers aren't the cheapest — they're the ones that make the next step feel clear, relevant, and worthwhile.",
    },
    {
      type: "callout",
      text: "“Free” describes the price. A strong offer explains the value.",
    },
    { type: "offerBuilder" },
    {
      type: "h2",
      text: "The problem with “free consultation”",
    },
    {
      type: "p",
      text: "A free consultation isn't automatically a bad offer. It becomes weak when it's presented without context. Consider two ads:",
    },
    {
      type: "cardGrid",
      cards: [
        {
          title: "Option one",
          description: "Schedule a Free Consultation",
        },
        {
          title: "Option two",
          description:
            "Not sure why your back keeps tightening up? Start with a 15-minute chiropractic discovery visit.",
        },
      ],
    },
    {
      type: "p",
      text: "The first describes the price. The second describes the person, the problem, the appointment, and the purpose. That matters because someone seeing your ad may not be ready to choose a chiropractor — they may simply be trying to understand what's happening and whether your practice is a reasonable place to start. A strong offer helps them answer that.",
    },
    {
      type: "h2",
      text: "A strong offer answers four questions",
    },
    {
      type: "p",
      text: "Before launching a campaign, make sure the offer answers four basics — the same four the builder above walks through.",
    },
    {
      type: "h3",
      text: "1. Who is it for?",
    },
    {
      type: "p",
      text: "Broad offers are easy to ignore. Connect the offer to a recognizable audience or situation — desk workers with limited mobility, active adults who feel restricted, parents looking for a family practice — while keeping the language respectful. Google classifies personal-health content as sensitive and restricts condition-based personalized targeting, so build around geographic, contextual, and keyword targeting rather than implying you know an individual's condition.",
    },
    {
      type: "h3",
      text: "2. What happens during the visit?",
    },
    {
      type: "p",
      text: "Don't make prospective patients guess. Explain what the first step includes — a brief conversation with the chiropractor, a review of their concerns, an explanation of the practice's approach. Only advertise services the practice actually provides, and don't imply an examination, diagnosis, or treatment unless it's truly included.",
    },
    {
      type: "h3",
      text: "3. What will the person gain?",
    },
    {
      type: "p",
      text: "The benefit of an introductory offer isn't always immediate relief — often the value is clarity. A prospective patient may leave with a better understanding of whether your approach fits, what an evaluation involves, and what the next appointment would include. That's a more credible promise than suggesting a clinical outcome. The FTC evaluates the overall impression of an ad — words, images, testimonials, disclaimers — not one carefully worded sentence.",
    },
    {
      type: "h3",
      text: "4. What happens next?",
    },
    {
      type: "p",
      text: "A strong offer removes uncertainty from the next step. Tell people what happens after they respond: “Choose an available time online. During the visit, we'll discuss your concerns, explain our approach, and determine whether a complete new-patient evaluation makes sense.” Clear expectations reduce friction.",
    },
    {
      type: "h2",
      text: "Five offer structures worth testing",
    },
    {
      type: "cardGrid",
      cards: [
        {
          title: "1 · The problem-specific discovery visit",
          description:
            "e.g. “Back and Mobility Discovery Visit.” Connects the appointment to a recognizable concern without promising a result.",
        },
        {
          title: "2 · The new patient fit call",
          description:
            "A 15-minute call for higher-value or cash-pay services. “Fit” positions it as a two-way conversation, not a sales pitch.",
        },
        {
          title: "3 · The educational assessment",
          description:
            "Desk Worker Mobility Assessment, Golf Mobility Assessment, etc. Be careful with “assessment” — the landing page must explain what is and isn't included.",
        },
        {
          title: "4 · The new patient introductory visit",
          description:
            "e.g. “$49 New Patient Introductory Visit.” A modest price can reduce unqualified leads and signal meaningful professional time. Describe the value plainly — avoid inflated “$500 value” claims.",
        },
        {
          title: "5 · The consultation with a clear deliverable",
          description:
            "“Meet with a chiropractor and leave with a clear next-step plan.” The plan gives the visit a defined purpose without guaranteeing a health outcome.",
        },
      ],
    },
    {
      type: "h2",
      text: "Don't choose an offer on lead cost alone",
    },
    {
      type: "p",
      text: "A low-cost lead isn't always a good lead. Compare two campaigns:",
    },
    {
      type: "cardGrid",
      cards: [
        {
          title: "Campaign A · free consult",
          description:
            "50 leads — cheaper submissions. Many don't answer. Few schedule; several misunderstand.",
        },
        {
          title: "Campaign B · named assessment",
          description:
            "25 problem-specific leads. More understand the appointment. More respond, schedule, and attend.",
        },
      ],
    },
    {
      type: "p",
      text: "Campaign A may produce the cheaper form submission; Campaign B may produce the stronger patient-acquisition system. Track the whole journey — click, lead, contact, scheduled, attended, evaluation, patient started, revenue. The best offer produces the right conversations at a sustainable acquisition cost, not the most leads.",
    },
    {
      type: "h2",
      text: "Test the offer before rebuilding the campaign",
    },
    {
      type: "p",
      text: "When ads underperform, practices often change audience, images, or budget first. Sometimes the real problem is the offer. Test meaningful variations — free consult vs. a named discovery visit, general vs. problem-specific, phone vs. in-office, free vs. modestly priced, appointment request vs. direct online scheduling. Change one major variable at a time so you can tell what actually moved the results.",
    },
    {
      type: "p",
      text: "The strategy is a first step that feels useful enough to take, simple enough to understand, and credible enough to trust.",
    },
    {
      type: "p",
      text: "At Lakeside, we help chiropractic and natural-health practices connect the offer, advertising, landing page, follow-up, scheduling, and lead tracking into one patient-acquisition system — because a strong ad does more than generate attention. It gives the right person a clear reason to start the conversation.",
    },
    {
      type: "references",
      label: "References",
      items: [
        {
          text: "Google. (2024). Personalized advertising and sensitive categories.",
          url: "https://support.google.com/adspolicy/answer/143465",
          linkLabel: "Google Ads sensitive categories",
        },
        {
          text: "Federal Trade Commission. (2024). Advertising FAQ: A guide for small business.",
          url: "https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business",
          linkLabel: "FTC advertising FAQs",
        },
      ],
    },
    {
      type: "authorBio",
      name: "Pete Wisniewski",
      role: "Founder, Lakeside Marketing",
      bio: "Pete helps chiropractic and natural-health practices turn paid search, landing pages, and front-desk follow-up into one measurable patient-acquisition system — built to be judged on new patients and ROI, not clicks.",
      linkedinUrl: "https://www.linkedin.com/in/pete-wisniewski",
    },
    {
      type: "articleCta",
      eyebrow: "Turn your offer into a system",
      title: "Let's turn your offer into a patient-acquisition system.",
      description:
        "We connect the offer, advertising, landing page, follow-up, scheduling, and lead tracking into one measurable system — built for chiropractic and natural-health practices.",
      ctaLabel: "Book a call with Lakeside",
      ctaUrl: "/consultation",
    },
  ]),
}

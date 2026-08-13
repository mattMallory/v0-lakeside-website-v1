import { createLexicalContent } from "@/lib/lexical-helpers"
import type { CaseStudyMetric, CaseStudyPost } from "@/lib/blog-types"

export const CASE_STUDY_TAG_SLUG = "case-study"

export const defaultTuscolaCaseStudyMetrics: CaseStudyMetric[] = [
  {
    eyebrow: "Online Revenue · Ecommerce",
    value: 285,
    prefix: "+",
    suffix: "%",
    decimals: 0,
    description:
      "Online store revenue growth within the first year of launching a national ecommerce strategy for Dr. Hemmer's wellness product line.",
    isHighlighted: true,
    highlightLabel: "Featured Result",
    spanFull: false,
  },
  {
    eyebrow: "National Reach · Shipping",
    value: 48,
    prefix: "",
    suffix: " states",
    decimals: 0,
    description:
      "Expanded from a single central Illinois practice to shipping wellness products across the continental United States.",
    isHighlighted: false,
    highlightLabel: "Featured Result",
    spanFull: false,
  },
  {
    eyebrow: "Paid Media · ROAS",
    value: 4.8,
    prefix: "",
    suffix: "x",
    decimals: 1,
    description:
      "Average return on ad spend across Google and Meta campaigns built to drive qualified ecommerce purchases.",
    isHighlighted: false,
    highlightLabel: "Featured Result",
    spanFull: false,
  },
  {
    eyebrow: "Brand Growth · Ecommerce",
    displayValue: "Local → National",
    description:
      "Tuscola Pain & Wellness Center evolved from a successful regional practice into a nationally recognized wellness brand with a thriving online store.",
    isHighlighted: false,
    highlightLabel: "Featured Result",
    spanFull: true,
  },
]

// Extracted so the seed can use the precise Lexical shape this factory returns. Reading
// it back off defaultTuscolaCaseStudy would widen it to Record<string, unknown> via
// the CaseStudyPost annotation, which the posts schema does not accept.
export const defaultTuscolaCaseStudyContent = createLexicalContent([
    {
      type: "p",
      text: "Tuscola Pain and Wellness Center was a successful local natural healthcare practice in central Illinois owned and run by Dr. Bill Hemmer. The practice had built strong patient trust locally, but Dr. Hemmer wanted to expand revenue beyond the clinic walls by investing in an ecommerce store and promoting the brand to a national audience.",
    },
    {
      type: "h2",
      text: "The challenge",
    },
    {
      type: "p",
      text: "Like many growing practices, Tuscola had strong clinical outcomes but no unified system for brand, creative, paid media, and ecommerce. Each initiative lived in a different silo, making it hard to scale beyond the local market or measure what was actually driving online sales.",
    },
    {
      type: "h2",
      text: "The Lakeside approach",
    },
    {
      type: "p",
      text: "We built an integrated growth engine: brand positioning and creative assets, a conversion-focused ecommerce experience, paid campaigns across Google and Meta, and analytics tied directly to revenue — not vanity metrics.",
    },
    {
      type: "h3",
      text: "Brand and creative foundation",
    },
    {
      type: "p",
      text: "We refined the Tuscola brand for a national audience while preserving the trust built locally. Product photography, ad creative, and landing page assets were designed to work together across every channel.",
    },
    {
      type: "h3",
      text: "Ecommerce and paid acquisition",
    },
    {
      type: "p",
      text: "With the store live, we launched performance campaigns engineered for purchase intent — optimizing audiences, creative, and landing pages until online revenue became a predictable growth channel alongside in-clinic care.",
    },
    {
      type: "h2",
      text: "The results",
    },
    {
      type: "p",
      text: "Tuscola grew from a regional practice into a nationally recognized wellness brand. Online revenue scaled dramatically, products shipped across dozens of states, and paid media delivered strong, measurable returns — all managed as one connected system.",
    },
])

export const defaultTuscolaCaseStudy: CaseStudyPost = {
  id: "default-tuscola",
  title: "Local Healthcare Practice Grows Into a National Brand With Major Online Store Sales",
  slug: "tuscola-pain-wellness-center-case-study",
  excerpt:
    "How Tuscola Pain & Wellness Center expanded from a central Illinois practice into a national wellness brand — with ecommerce, paid media, and creative working as one system.",
  authorName: "Matt Mallory",
  readTime: null,
  publishedAt: "2026-03-20T10:00:00.000Z",
  featuredImageUrl: "/why/ad-campaign-v2.jpg",
  featuredImageAlt: "Digital marketing campaign driving ecommerce growth for a healthcare brand",
  category: {
    id: "case-studies",
    name: "Case Studies",
    slug: "case-studies",
  },
  tags: [
    { id: "case-study", name: "Case Study", slug: CASE_STUDY_TAG_SLUG },
    { id: "branding", name: "Branding", slug: "branding" },
    { id: "google-ads", name: "Google Ads", slug: "google-ads" },
  ],
  content: defaultTuscolaCaseStudyContent,
  clientName: "Tuscola Pain & Wellness Center",
  clientLocation: "Tuscola, Illinois",
  practiceInfo: {
    practiceType: "Chiropractic & Wellness",
    services: "Pain management, wellness products, natural healthcare",
    engagementFocus: "Branding, ecommerce, Google Ads, Meta Ads",
    marketReach: "National (48 states)",
  },
  metrics: defaultTuscolaCaseStudyMetrics,
  isCaseStudy: true,
}

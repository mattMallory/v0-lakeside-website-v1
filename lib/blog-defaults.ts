import { createLexicalContent } from "@/lib/lexical-helpers"

export const defaultBlogCategories = [
  { name: "Patient Acquisition", slug: "patient-acquisition" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Clinic Operations", slug: "clinic-operations" },
  { name: "Industry Insights", slug: "industry-insights" },
  { name: "Case Studies", slug: "case-studies" },
] as const

export const defaultBlogTags = [
  { name: "SEO", slug: "seo" },
  { name: "Google Ads", slug: "google-ads" },
  { name: "Facebook Ads", slug: "facebook-ads" },
  { name: "Landing Pages", slug: "landing-pages" },
  { name: "Retention", slug: "retention" },
  { name: "Referrals", slug: "referrals" },
  { name: "Analytics", slug: "analytics" },
  { name: "Branding", slug: "branding" },
  { name: "Case Study", slug: "case-study" },
] as const

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien proin quam etiam ultrices.",
]

export const defaultBlogPosts = [
  {
    title: "5 Ways to Fill Your Clinic Schedule Without Relying on Referrals",
    slug: "fill-clinic-schedule-without-referrals",
    excerpt:
      "Referrals are great until they slow down. Here are five proven strategies natural wellness clinics use to keep appointments steady.",
    categorySlug: "patient-acquisition",
    tagSlugs: ["referrals", "google-ads", "landing-pages"],
    authorName: "Sarah Mitchell",
    publishedAt: "2026-03-15T10:00:00.000Z",
    featuredImagePath: "/why/patient-room.jpg",
    featuredImageAlt: "Patient consultation in a wellness clinic",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[0] },
      { type: "h2", text: "Build a predictable patient pipeline" },
      { type: "p", text: loremParagraphs[1] },
      { type: "h3", text: "Start with local search intent" },
      { type: "p", text: loremParagraphs[2] },
    ]),
  },
  {
    title: "How to Write Landing Pages That Convert Clinic Visitors Into Bookings",
    slug: "landing-pages-that-convert-clinic-visitors",
    excerpt:
      "Most clinic landing pages talk about services. The best ones speak directly to the patient problem and make booking effortless.",
    categorySlug: "digital-marketing",
    tagSlugs: ["landing-pages", "seo", "analytics"],
    authorName: "James Chen",
    publishedAt: "2026-03-10T14:30:00.000Z",
    featuredImagePath: "/why/ad-campaign-v2.jpg",
    featuredImageAlt: "Digital marketing campaign dashboard",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[1] },
      { type: "h2", text: "Lead with the outcome patients want" },
      { type: "p", text: loremParagraphs[0] },
      { type: "h2", text: "Remove friction from the booking path" },
      { type: "p", text: loremParagraphs[2] },
    ]),
  },
  {
    title: "Google Ads for Acupuncture Clinics: A Practical Starter Guide",
    slug: "google-ads-for-acupuncture-clinics",
    excerpt:
      "Paid search can deliver qualified patient inquiries fast — if you target the right keywords and structure campaigns around appointments.",
    categorySlug: "digital-marketing",
    tagSlugs: ["google-ads", "analytics"],
    authorName: "Sarah Mitchell",
    publishedAt: "2026-03-05T09:00:00.000Z",
    featuredImagePath: "/why/demographics-v2.jpg",
    featuredImageAlt: "Local patient demographics map",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[2] },
      { type: "h2", text: "Focus on high-intent local keywords" },
      { type: "p", text: loremParagraphs[0] },
      { type: "h3", text: "Track cost per booked consultation" },
      { type: "p", text: loremParagraphs[1] },
    ]),
  },
  {
    title: "Why Your Clinic Needs a Follow-Up System (Not Just More Leads)",
    slug: "clinic-follow-up-system",
    excerpt:
      "Generating inquiries is only half the battle. A simple follow-up workflow can recover appointments you are already losing.",
    categorySlug: "clinic-operations",
    tagSlugs: ["retention", "analytics"],
    authorName: "Emily Rodriguez",
    publishedAt: "2026-02-28T11:15:00.000Z",
    featuredImagePath: "/why/booked-calendar.png",
    featuredImageAlt: "Fully booked clinic calendar",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[0] },
      { type: "h2", text: "Speed matters more than perfect copy" },
      { type: "p", text: loremParagraphs[2] },
    ]),
  },
  {
    title: "The State of Natural Healthcare Marketing in 2026",
    slug: "natural-healthcare-marketing-2026",
    excerpt:
      "Patients are researching care options online more than ever. Here is what is changing for acupuncture, chiropractic, and functional medicine practices.",
    categorySlug: "industry-insights",
    tagSlugs: ["seo", "branding", "facebook-ads"],
    authorName: "James Chen",
    publishedAt: "2026-02-20T16:45:00.000Z",
    featuredImagePath: "/why/woman-phone-search.png",
    featuredImageAlt: "Patient searching for healthcare online",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[1] },
      { type: "h2", text: "Trust signals are replacing vanity metrics" },
      { type: "p", text: loremParagraphs[0] },
      { type: "h2", text: "Local visibility still wins" },
      { type: "p", text: loremParagraphs[2] },
    ]),
  },
  {
    title: "Branding Tips for Wellness Clinics That Want to Stand Out Locally",
    slug: "branding-tips-wellness-clinics",
    excerpt:
      "A consistent brand helps patients remember you, trust you, and choose you when they are ready to book.",
    categorySlug: "digital-marketing",
    tagSlugs: ["branding", "seo"],
    authorName: "Emily Rodriguez",
    publishedAt: "2026-02-12T08:30:00.000Z",
    featuredImagePath: "/why/full-bg.jpg",
    featuredImageAlt: "Modern wellness clinic interior",
    content: createLexicalContent([
      { type: "p", text: loremParagraphs[2] },
      { type: "h2", text: "Clarity beats cleverness" },
      { type: "p", text: loremParagraphs[1] },
    ]),
  },
] as const

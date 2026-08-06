export type LegalSection = {
  title: string
  body: string
}

export type LegalPageContent = {
  eyebrow: string
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
  seoTitle: string
  seoDescription: string
}

export type LegalContent = {
  privacy: LegalPageContent
  terms: LegalPageContent
}

const privacySections: LegalSection[] = [
  {
    title: "Information we collect",
    body:
      "We may collect contact details, practice information, and usage data when you request a consultation, subscribe to updates, or interact with our website. This placeholder policy describes the types of information we might collect in the course of providing marketing services to natural wellness clinics.",
  },
  {
    title: "How we use information",
    body:
      "Information may be used to respond to inquiries, deliver services, improve our website, and communicate about projects or resources relevant to your practice. We do not sell personal information to third parties.",
  },
  {
    title: "Cookies and analytics",
    body:
      "Our site may use cookies and similar technologies to understand traffic patterns and improve user experience. You can adjust browser settings to limit cookies, though some features may not function as intended.",
  },
  {
    title: "Data retention",
    body:
      "We retain information only as long as needed to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce agreements.",
  },
  {
    title: "Your choices",
    body:
      "You may request access to, correction of, or deletion of personal information we hold about you by contacting us. We will respond to reasonable requests in accordance with applicable law.",
  },
  {
    title: "Contact",
    body:
      "If you have questions about this privacy policy, please contact Lakeside using the information on our website. This page contains placeholder text and should be replaced with counsel-reviewed language before launch.",
  },
]

const termsSections: LegalSection[] = [
  {
    title: "Agreement to terms",
    body:
      "By accessing or using the Lakeside website and services, you agree to these terms of service. If you do not agree, please do not use our site or services. This document is placeholder text pending final legal review.",
  },
  {
    title: "Services",
    body:
      "Lakeside provides marketing strategy, advertising management, and related services for natural wellness clinics. Specific deliverables, timelines, and fees are defined in separate agreements or statements of work.",
  },
  {
    title: "Use of the website",
    body:
      "You agree to use this website only for lawful purposes and not to interfere with its operation, attempt unauthorized access, or misuse content, forms, or other resources made available through the site.",
  },
  {
    title: "Intellectual property",
    body:
      "Website content, branding, and materials are owned by Lakeside or its licensors unless otherwise noted. You may not copy, distribute, or create derivative works without prior written permission.",
  },
  {
    title: "Disclaimer",
    body:
      "Information on this site is provided for general informational purposes. Marketing results vary by market, offer, and practice. We make no guarantees regarding specific outcomes unless expressly stated in a signed agreement.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the fullest extent permitted by law, Lakeside is not liable for indirect, incidental, or consequential damages arising from use of the website or services. This placeholder section should be replaced with counsel-approved language.",
  },
  {
    title: "Changes",
    body:
      "We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    title: "Contact",
    body:
      "Questions about these terms may be directed to Lakeside through the contact options on our website.",
  },
]

export const defaultLegalContent: LegalContent = {
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    lastUpdated: "August 5, 2026",
    intro:
      "This is placeholder copy for Lakeside's privacy policy. Replace this content with final legal language reviewed by qualified counsel before publishing.",
    sections: privacySections,
    seoTitle: "Privacy Policy | Lakeside",
    seoDescription: "Privacy policy for Lakeside marketing services and website.",
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    lastUpdated: "August 5, 2026",
    intro:
      "This is placeholder copy for Lakeside's terms of service. Replace this content with final legal language reviewed by qualified counsel before publishing.",
    sections: termsSections,
    seoTitle: "Terms of Service | Lakeside",
    seoDescription: "Terms of service for Lakeside marketing services and website.",
  },
}

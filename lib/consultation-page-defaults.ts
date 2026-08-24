export type ConsultationPageContent = {
  eyebrow: string
  title: string
  description: string
  seoTitle: string
  seoDescription: string
  /** Optional SMS consent — transactional / non-marketing. */
  smsNonMarketingConsentLabel: string
  /** Optional SMS consent — marketing / promotional. */
  smsMarketingConsentLabel: string
  privacyLinkLabel: string
  termsLinkLabel: string
}

export const defaultConsultationPageContent: ConsultationPageContent = {
  eyebrow: "Get Started",
  title: "Let's Grow Your Practice",
  description:
    "Answer a few quick questions about your practice and goals. We'll use your answers to prepare for a complimentary growth consultation — so we can talk specifically about how to attract more of the right patients and build a patient-acquisition system that fits how you work.",
  seoTitle: "Schedule a Consultation | Lakeside",
  seoDescription:
    "Book a free growth consultation with Lakeside and map out a patient acquisition system tailored to your clinic.",
  smsNonMarketingConsentLabel:
    "I consent to receive non-marketing text messages from Lakeside regarding my growth consultation and appointment scheduling. Message frequency varies, message & data rates may apply. Reply HELP for assistance, reply STOP to opt out.",
  smsMarketingConsentLabel:
    "I consent to receive marketing text messages from Lakeside regarding practice growth tips, offers, and updates. Message frequency varies, message & data rates may apply. Reply HELP for assistance, reply STOP to opt out.",
  privacyLinkLabel: "Privacy Policy",
  termsLinkLabel: "Terms and Conditions",
}

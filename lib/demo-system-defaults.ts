export type DemoSystemContent = {
  eyebrow: string
  title: string
  description: string
  formTitle: string
  formDescription: string
  formButtonLabel: string
  successTitle: string
  successMessage: string
  seoTitle: string
  seoDescription: string
}

export const defaultDemoSystemContent: DemoSystemContent = {
  eyebrow: "Demo The System",
  title: "Coming soon",
  description:
    "We're putting the finishing touches on an interactive walkthrough of the Natural Practice Growth System. Join the list and we'll email you as soon as it's live.",
  formTitle: "Get early access",
  formDescription: "Leave your email and we'll notify you when the demo opens.",
  formButtonLabel: "Join the list",
  successTitle: "You're on the list.",
  successMessage: "We'll email you when the demo is ready to try.",
  seoTitle: "Demo The System | Lakeside",
  seoDescription:
    "Join the waitlist to demo Lakeside's Natural Practice Growth System when it launches.",
}

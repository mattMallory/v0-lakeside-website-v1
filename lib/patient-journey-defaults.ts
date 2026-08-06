import type { PatientJourneyStep } from "@/lib/patient-journey-types"

export const defaultPatientJourneySteps: PatientJourneyStep[] = [
  {
    label: "Reaching people",
    teaser: "A cold ad reaches someone who's never heard of you.",
    badTitle: "Typical approach",
    badDescription:
      "A generic message blasts a broad audience with no context or relevance.",
    goodTitle: "Targeted Advertising",
    goodDescription:
      "Reach the right local audience with a message tied to a specific problem or need.",
    insight: "Relevance is what makes a stranger stop scrolling.",
  },
  {
    label: "The ask",
    teaser: "What you ask for next decides everything.",
    badTitle: "Typical approach",
    badDescription:
      "“Schedule an appointment” — asking a stranger to commit before any trust exists.",
    goodTitle: "Low-Commitment Offer",
    goodDescription:
      "Invite a helpful first step — an assessment, discovery call, or consultation.",
    insight:
      "Cold traffic says yes to a conversation long before it says yes to a commitment.",
  },
  {
    label: "Where they land",
    teaser: "One click later — where do they end up?",
    badTitle: "Typical approach",
    badDescription: "Ten services, several menus, and competing calls to action.",
    goodTitle: "Focused Landing Page",
    goodDescription: "One problem, one offer, and one clear next action. Nothing to distract.",
    insight: "Clarity converts. Choices stall.",
  },
  {
    label: "The response",
    teaser: "A lead just raised their hand. Now what?",
    badTitle: "Typical approach",
    badDescription:
      "The clinic replies hours or days later — or waits for the person to call.",
    goodTitle: "Instant Follow-Up",
    goodDescription:
      "Instant text, email, booking link and reminders — while interest is still hot.",
    insight: "Speed is the single biggest lever on whether a lead ever books.",
  },
  {
    label: "The outcome",
    teaser: "This is where growth is won or lost.",
    badTitle: "Typical approach",
    badDescription:
      "The distracted prospect drifts off — or calls another practice first.",
    goodTitle: "Guided Booking Path",
    goodDescription: "An easy path into a real conversation with the practice.",
    insight: "The goal was never a click. It was a booked consultation.",
  },
  {
    label: "What you learn",
    teaser: "Could you tell which ad actually produced a patient?",
    badTitle: "Typical approach",
    badDescription:
      "Success is estimated from clicks and impressions — not real outcomes.",
    goodTitle: "Tracking & Optimization",
    goodDescription:
      "Measure consultations and patients, then optimize what actually works.",
    insight: "You can't scale what you can't measure.",
  },
]

export const defaultPatientJourneyBlock = {
  eyebrow: "Interactive · Follow the patient",
  title: "Why chiropractic ads fail",
  description:
    "Six moments decide whether an ad becomes a patient. Click each one to see where the typical approach loses them — and how the system wins them back.",
  steps: defaultPatientJourneySteps,
  completionTitle: "You've just seen the entire system",
  completionDescription:
    "That's how Lakeside turns cold clicks into booked patients — ad, offer, landing page, follow-up, booking, and tracking working as one. Let's map it to your practice.",
  ctaLabel: "Schedule a call with Lakeside",
  ctaUrl: "/consultation",
}

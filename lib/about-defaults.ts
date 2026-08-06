import type { ImagePositionValue } from "@/lib/image-position"
import type { CaseStudyHighlightContent } from "@/lib/case-study-highlight"
import { defaultCaseStudyHighlightContent } from "@/lib/case-study-highlight"

export type AboutProcessItem = {
  title: string
  description: string
}

export type TeamMemberSocialLinks = {
  linkedin?: string
  youtube?: string
  instagram?: string
  x?: string
  facebook?: string
}

export type AboutTeamMember = {
  name: string
  role: string
  bio: string
  imageUrl?: string
  imagePosition?: ImagePositionValue
  initials?: string
  socials?: TeamMemberSocialLinks
}

export type AboutContent = {
  hero: {
    eyebrow: string
    title: string
    description: string
    imageUrl: string
    imageAlt: string
    imagePosition: ImagePositionValue
  }
  visionMission: {
    headline: string
    vision: {
      label: string
      text: string
    }
    mission: {
      label: string
      text: string
    }
  }
  process: {
    eyebrow: string
    title: string
    description: string
    centerTitle: string
    centerSubtitle: string
    items: AboutProcessItem[]
  }
  team: {
    eyebrow: string
    title: string
    description: string
    members: AboutTeamMember[]
  }
  caseStudyHighlight: CaseStudyHighlightContent
  cta: {
    headline: string
    description: string
    button: string
  }
}

export const defaultAboutContent: AboutContent = {
  hero: {
    eyebrow: "About Lakeside",
    title: "Where Growth Comes Naturally",
    description:
      "We are committed to helping natural healthcare and service organizations in the Chicago suburbs achieve their goals with innovative marketing strategies — blending a friendly approach with a serious focus on results.",
    imageUrl: "/about/hero.jpg",
    imageAlt: "The Lakeside Marketing team collaborating",
    imagePosition: "center",
  },
  visionMission: {
    headline: "Marketing strategies built to weather any storm.",
    vision: {
      label: "Our Vision",
      text: "To build a company that delivers effective, lasting marketing strategies — helping businesses grow quickly and steadily no matter the economic conditions.",
    },
    mission: {
      label: "Our Mission",
      text: "To help natural healthcare and service organizations achieve their dreams through innovative marketing — so every client feels cared for, listened to, and confident on their journey to success.",
    },
  },
  process: {
    eyebrow: "Our Process",
    title: "How we work with every client",
    description:
      "Lakeside isn't just a creative studio — we're your trusted partner, delivering strategies that consistently exceed expectations.",
    centerTitle: "Our Process",
    centerSubtitle: "Tap any step to learn how we help your practice grow.",
    items: [
      {
        title: "We Learn Your\nClinic",
        description:
          "We dig into your services, ideal patients, and goals so every campaign reflects your practice.",
      },
      {
        title: "We Launch Your\nLead Generation System",
        description:
          "Ads, landing pages, and follow-up go live as one connected engine built to book appointments.",
      },
      {
        title: "We Optimize For\nMore Appointments",
        description:
          "We monitor performance and refine continuously to drive down cost and drive up qualified inquiries.",
      },
      {
        title: "You Focus On\nPatient Care",
        description:
          "With a reliable flow of new patients, you get back to doing what you do best, helping people heal.",
      },
      {
        title: "You Grow Your\nPractice",
        description:
          "With a steady pipeline in place, you scale what works — more patients, stronger retention, and sustainable practice growth.",
      },
    ],
  },
  team: {
    eyebrow: "Our Team",
    title: "Meet Our Leadership",
    description: "Behind every campaign is a team of experts dedicated to your growth.",
    members: [
      {
        name: "Pete Wisniewski",
        role: "Managing Partner",
        bio: "A second-generation marketing professional shaped by his family-owned restaurant roots, collegiate swimming, and business school in Montana. Pete brings diverse sales growth experience, community leadership, and skills spanning graphic design to photography.",
        imageUrl: "/about/pete-wisniewski.jpg",
        imagePosition: "top",
      },
      {
        name: "Matt Mallory",
        role: "Managing Partner",
        bio: "Raised in a family immersed in music and design, Matt studied Design and Web Development at Arizona State University before building a successful freelance career with SaaS companies worldwide. He transforms complex challenges into clear, manageable steps.",
        imageUrl: "/about/matt-mallory.jpg",
        imagePosition: "top",
      },
      {
        name: "Alex Bacak",
        role: "Digital Marketing Specialist",
        bio: "Alex optimizes paid media campaigns across Meta, Google, and Microsoft Ads, builds Shopify sites and landing pages, and develops ad creative and email marketing that drives engagement. He brings a data-driven approach to every client account.",
        initials: "AB",
      },
    ],
  },
  caseStudyHighlight: defaultCaseStudyHighlightContent,
  cta: {
    headline: "Ready to grow with a team you can trust?",
    description:
      "Book a free consultation and let's talk about how Lakeside can help your clinic or organization thrive.",
    button: "Schedule a Consultation",
  },
}

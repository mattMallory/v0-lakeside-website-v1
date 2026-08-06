import type { GlobalConfig } from "payload"

import { homepageGrowthSystemTabs } from "@/fields/homepageGrowthSystem"
import { defaultGrowthSystemContent } from "@/lib/homepage-growth-system-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

type HomepageData = Record<string, unknown>

function normalizeHomepageData(data: HomepageData): HomepageData {
  const testimonials = data.gsTestimonials
  if (Array.isArray(testimonials)) {
    data.gsTestimonials = testimonials.slice(0, 1).map((item) => {
      const testimonial = item as Record<string, unknown>
      return {
        ...testimonial,
        photoAlt:
          testimonial.photoAlt ||
          testimonial.name ||
          defaultGrowthSystemContent.testimonials[0]?.photoAlt ||
          "Testimonial photo",
      }
    })
  }

  const teamMembers = data.gsTeamMembers
  if (Array.isArray(teamMembers)) {
    data.gsTeamMembers = teamMembers.map((item) => {
      const member = item as Record<string, unknown>
      return {
        ...member,
        photoAlt: member.photoAlt || member.name || "Team member",
      }
    })
  }

  return data
}

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data) normalizeHomepageData(data as HomepageData)
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data) normalizeHomepageData(data as HomepageData)
        return data
      },
    ],
    afterChange: [
      async () => {
        await revalidateSite()
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: homepageGrowthSystemTabs,
    },
  ],
}

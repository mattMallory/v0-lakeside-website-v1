import type { Field } from "payload"

import { defaultCaseStudyHighlightContent } from "@/lib/case-study-highlight"

export const caseStudyHighlightFields: Field[] = [
  {
    name: "caseStudyEyebrow",
    type: "text",
    label: "Eyebrow",
    defaultValue: defaultCaseStudyHighlightContent.eyebrow,
  },
  {
    name: "caseStudyHeadline",
    type: "text",
    label: "Headline",
    defaultValue: defaultCaseStudyHighlightContent.headline,
  },
  {
    name: "caseStudyFeaturedPost",
    type: "relationship",
    relationTo: "posts",
    label: "Featured Case Study",
    admin: {
      description: "Choose a published case study post to show in this section.",
    },
    filterOptions: {
      postType: {
        equals: "case-study",
      },
    },
  },
]

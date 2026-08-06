import type { Payload } from "payload"

import { defaultCaseStudyHighlightContent } from "@/lib/case-study-highlight"
import { defaultTuscolaCaseStudy } from "@/lib/case-study-defaults"

export async function findDefaultCaseStudyPostId(payload: Payload): Promise<number | null> {
  const bySlug = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: defaultTuscolaCaseStudy.slug,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (bySlug.docs[0]?.id) {
    return bySlug.docs[0].id as number
  }

  const byType = await payload.find({
    collection: "posts",
    where: {
      postType: {
        equals: "case-study",
      },
    },
    limit: 1,
    depth: 0,
  })

  return byType.docs[0]?.id ? (byType.docs[0].id as number) : null
}

export async function seedCaseStudyHighlightGlobal(
  payload: Payload,
  slug: "homepage" | "about" | "services-page",
) {
  const global = await payload.findGlobal({
    slug,
    depth: 0,
  })

  const needsBackfill =
    !global.caseStudyEyebrow ||
    !global.caseStudyHeadline ||
    !global.caseStudyFeaturedPost

  if (!needsBackfill) return

  const featuredPostId =
    typeof global.caseStudyFeaturedPost === "number"
      ? global.caseStudyFeaturedPost
      : await findDefaultCaseStudyPostId(payload)

  await payload.updateGlobal({
    slug,
    data: {
      caseStudyEyebrow: global.caseStudyEyebrow || defaultCaseStudyHighlightContent.eyebrow,
      caseStudyHeadline: global.caseStudyHeadline || defaultCaseStudyHighlightContent.headline,
      ...(featuredPostId ? { caseStudyFeaturedPost: featuredPostId } : {}),
    },
  })
}

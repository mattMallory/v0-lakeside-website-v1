import fs from "fs"
import path from "path"
import type { Payload } from "payload"

import {
  defaultBlogCategories,
  defaultBlogPosts,
  defaultBlogTags,
} from "@/lib/blog-defaults"
import { defaultChiropracticOfferBuilderPost } from "@/lib/chiropractic-offer-builder-defaults"
import { defaultColdAdvertisingPost } from "@/lib/cold-advertising-defaults"
import { defaultGoogleAdsBudgetPlannerPost } from "@/lib/google-ads-budget-planner-defaults"
import { defaultTuscolaCaseStudy, defaultTuscolaCaseStudyMetrics } from "@/lib/case-study-defaults"

async function ensureMediaFromPublicFile(
  payload: Payload,
  filePath: string,
  alt: string,
): Promise<number | null> {
  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""))

  if (!fs.existsSync(absolutePath)) {
    return null
  }

  const filename = path.basename(absolutePath)
  const existing = await payload.find({
    collection: "media",
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]?.id) {
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt,
    },
    filePath: absolutePath,
  })

  return created.id as number
}

async function ensureTagBySlug(payload: Payload, name: string, slug: string) {
  const existing = await payload.find({
    collection: "tags",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]?.id) {
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: "tags",
    data: { name, slug },
  })

  return created.id as number
}

async function ensureCategoryBySlug(payload: Payload, name: string, slug: string) {
  const existing = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]?.id) {
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: "categories",
    data: { name, slug },
  })

  return created.id as number
}

export async function seedCaseStudyIfMissing(payload: Payload) {
  try {
    const caseStudyTagId = await ensureTagBySlug(payload, "Case Study", "case-study")
    const caseStudiesCategoryId = await ensureCategoryBySlug(payload, "Case Studies", "case-studies")

    const existing = await payload.find({
      collection: "posts",
      limit: 100,
      depth: 0,
    })

    const existingPost = existing.docs.find(
      (doc) =>
        doc.slug === defaultTuscolaCaseStudy.slug || doc.title === defaultTuscolaCaseStudy.title,
    )

    if (existingPost?.id) {
      const metrics = (existingPost as { caseStudyMetrics?: unknown[] }).caseStudyMetrics ?? []
      const existingCategoryId =
        typeof existingPost.category === "number" ? existingPost.category : existingPost.category?.id
      const needsBackfill =
        existingPost.postType !== "case-study" ||
        metrics.length === 0 ||
        !existingPost.clientName ||
        !existingPost.clientPracticeType ||
        existingCategoryId !== caseStudiesCategoryId

      if (needsBackfill) {
        await payload.update({
          collection: "posts",
          id: existingPost.id,
          data: {
            postType: "case-study",
            category: caseStudiesCategoryId,
            clientName: existingPost.clientName || defaultTuscolaCaseStudy.clientName,
            clientLocation: existingPost.clientLocation || defaultTuscolaCaseStudy.clientLocation,
            clientPracticeType:
              existingPost.clientPracticeType || defaultTuscolaCaseStudy.practiceInfo.practiceType,
            clientServices:
              existingPost.clientServices || defaultTuscolaCaseStudy.practiceInfo.services,
            clientEngagementFocus:
              existingPost.clientEngagementFocus ||
              defaultTuscolaCaseStudy.practiceInfo.engagementFocus,
            clientMarketReach:
              existingPost.clientMarketReach || defaultTuscolaCaseStudy.practiceInfo.marketReach,
            caseStudyMetrics: metrics.length > 0 ? metrics : defaultTuscolaCaseStudyMetrics,
            tags: Array.from(
              new Set([
                ...(((existingPost.tags as number[] | undefined) ?? []).filter(
                  (tag): tag is number => typeof tag === "number",
                )),
                caseStudyTagId,
              ]),
            ),
          },
        })
      }

      return
    }

    const categoryId = caseStudiesCategoryId

    const tagIds = await Promise.all(
      defaultTuscolaCaseStudy.tags.map((tag) => ensureTagBySlug(payload, tag.name, tag.slug)),
    )

    const featuredImageId = defaultTuscolaCaseStudy.featuredImageUrl
      ? await ensureMediaFromPublicFile(
          payload,
          defaultTuscolaCaseStudy.featuredImageUrl,
          defaultTuscolaCaseStudy.featuredImageAlt || defaultTuscolaCaseStudy.title,
        )
      : null

    await payload.create({
      collection: "posts",
      data: {
        title: defaultTuscolaCaseStudy.title,
        slug: defaultTuscolaCaseStudy.slug,
        excerpt: defaultTuscolaCaseStudy.excerpt,
        content: defaultTuscolaCaseStudy.content,
        authorName: defaultTuscolaCaseStudy.authorName,
        publishedAt: defaultTuscolaCaseStudy.publishedAt,
        status: "published",
        postType: "case-study",
        category: categoryId,
        tags: tagIds,
        clientName: defaultTuscolaCaseStudy.clientName,
        clientLocation: defaultTuscolaCaseStudy.clientLocation,
        clientPracticeType: defaultTuscolaCaseStudy.practiceInfo.practiceType,
        clientServices: defaultTuscolaCaseStudy.practiceInfo.services,
        clientEngagementFocus: defaultTuscolaCaseStudy.practiceInfo.engagementFocus,
        clientMarketReach: defaultTuscolaCaseStudy.practiceInfo.marketReach,
        caseStudyMetrics: defaultTuscolaCaseStudyMetrics,
        ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
      },
    })
  } catch (error) {
    console.error("[seed] Failed to seed case study post:", error)
  }
}

export async function seedChiropracticOfferBuilderPostIfMissing(payload: Payload) {
  try {
    const existing = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: defaultChiropracticOfferBuilderPost.slug,
        },
      },
      limit: 1,
      depth: 0,
    })

    const categoryId = await ensureCategoryBySlug(
      payload,
      "Digital Marketing",
      defaultChiropracticOfferBuilderPost.categorySlug,
    )

    const tagIds = await Promise.all(
      defaultChiropracticOfferBuilderPost.tagSlugs.map((slug) => {
        const tag = defaultBlogTags.find((item) => item.slug === slug)
        return ensureTagBySlug(payload, tag?.name || slug, slug)
      }),
    )

    const featuredImageId = await ensureMediaFromPublicFile(
      payload,
      defaultChiropracticOfferBuilderPost.featuredImagePath,
      defaultChiropracticOfferBuilderPost.featuredImageAlt,
    )

    const postData = {
      title: defaultChiropracticOfferBuilderPost.title,
      slug: defaultChiropracticOfferBuilderPost.slug,
      excerpt: defaultChiropracticOfferBuilderPost.excerpt,
      content: defaultChiropracticOfferBuilderPost.content,
      authorName: defaultChiropracticOfferBuilderPost.authorName,
      readTime: defaultChiropracticOfferBuilderPost.readTime,
      publishedAt: defaultChiropracticOfferBuilderPost.publishedAt,
      status: "published" as const,
      category: categoryId,
      tags: tagIds,
      ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
    }

    if (existing.docs[0]?.id) {
      await payload.update({
        collection: "posts",
        id: existing.docs[0].id,
        data: postData,
      })
      return
    }

    await payload.create({
      collection: "posts",
      data: postData,
    })
  } catch (error) {
    console.error("[seed] Failed to seed chiropractic offer builder post:", error)
  }
}

export async function seedGoogleAdsBudgetPlannerPostIfMissing(payload: Payload) {
  try {
    const existing = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: defaultGoogleAdsBudgetPlannerPost.slug,
        },
      },
      limit: 1,
      depth: 0,
    })

    const categoryId = await ensureCategoryBySlug(
      payload,
      "Digital Marketing",
      defaultGoogleAdsBudgetPlannerPost.categorySlug,
    )

    const tagIds = await Promise.all(
      defaultGoogleAdsBudgetPlannerPost.tagSlugs.map((slug) => {
        const tag = defaultBlogTags.find((item) => item.slug === slug)
        return ensureTagBySlug(payload, tag?.name || slug, slug)
      }),
    )

    const featuredImageId = await ensureMediaFromPublicFile(
      payload,
      defaultGoogleAdsBudgetPlannerPost.featuredImagePath,
      defaultGoogleAdsBudgetPlannerPost.featuredImageAlt,
    )

    const postData = {
      title: defaultGoogleAdsBudgetPlannerPost.title,
      slug: defaultGoogleAdsBudgetPlannerPost.slug,
      excerpt: defaultGoogleAdsBudgetPlannerPost.excerpt,
      content: defaultGoogleAdsBudgetPlannerPost.content,
      authorName: defaultGoogleAdsBudgetPlannerPost.authorName,
      readTime: defaultGoogleAdsBudgetPlannerPost.readTime,
      publishedAt: defaultGoogleAdsBudgetPlannerPost.publishedAt,
      status: "published" as const,
      category: categoryId,
      tags: tagIds,
      ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
    }

    if (existing.docs[0]?.id) {
      await payload.update({
        collection: "posts",
        id: existing.docs[0].id,
        data: postData,
      })
      return
    }

    await payload.create({
      collection: "posts",
      data: postData,
    })
  } catch (error) {
    console.error("[seed] Failed to seed Google Ads budget planner post:", error)
  }
}

export async function seedColdAdvertisingPostIfMissing(payload: Payload) {
  try {
    const existing = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: defaultColdAdvertisingPost.slug,
        },
      },
      limit: 1,
      depth: 0,
    })

    const categoryId = await ensureCategoryBySlug(
      payload,
      "Digital Marketing",
      defaultColdAdvertisingPost.categorySlug,
    )

    const tagIds = await Promise.all(
      defaultColdAdvertisingPost.tagSlugs.map((slug) => {
        const tag = defaultBlogTags.find((item) => item.slug === slug)
        return ensureTagBySlug(payload, tag?.name || slug, slug)
      }),
    )

    if (existing.docs[0]?.id) {
      await payload.update({
        collection: "posts",
        id: existing.docs[0].id,
        data: {
          content: defaultColdAdvertisingPost.content,
          readTime: defaultColdAdvertisingPost.readTime,
        },
      })
      return
    }

    await payload.create({
      collection: "posts",
      data: {
        title: defaultColdAdvertisingPost.title,
        slug: defaultColdAdvertisingPost.slug,
        excerpt: defaultColdAdvertisingPost.excerpt,
        content: defaultColdAdvertisingPost.content,
        authorName: defaultColdAdvertisingPost.authorName,
        readTime: defaultColdAdvertisingPost.readTime,
        publishedAt: defaultColdAdvertisingPost.publishedAt,
        status: "published",
        category: categoryId,
        tags: tagIds,
      },
    })
  } catch (error) {
    console.error("[seed] Failed to seed cold advertising post:", error)
  }
}

export async function seedBlogIfEmpty(payload: Payload) {
  try {
    const existingPosts = await payload.find({
      collection: "posts",
      limit: 1,
      depth: 0,
    })

    if (existingPosts.totalDocs > 0) {
      await seedCaseStudyIfMissing(payload)
      await seedColdAdvertisingPostIfMissing(payload)
      await seedGoogleAdsBudgetPlannerPostIfMissing(payload)
      await seedChiropracticOfferBuilderPostIfMissing(payload)
      return
    }

    const categoryIdBySlug = new Map<string, number>()
    for (const category of defaultBlogCategories) {
      const created = await payload.create({
        collection: "categories",
        data: category,
      })
      categoryIdBySlug.set(category.slug, created.id as number)
    }

    const tagIdBySlug = new Map<string, number>()
    for (const tag of defaultBlogTags) {
      const created = await payload.create({
        collection: "tags",
        data: tag,
      })
      tagIdBySlug.set(tag.slug, created.id as number)
    }

    for (const post of defaultBlogPosts) {
      const featuredImageId = await ensureMediaFromPublicFile(
        payload,
        post.featuredImagePath,
        post.featuredImageAlt,
      )

      await payload.create({
        collection: "posts",
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          authorName: post.authorName,
          publishedAt: post.publishedAt,
          status: "published",
          category: categoryIdBySlug.get(post.categorySlug),
          tags: post.tagSlugs
            .map((slug) => tagIdBySlug.get(slug))
            .filter((id): id is number => typeof id === "number"),
          ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
        },
      })
    }

    await seedCaseStudyIfMissing(payload)
    await seedColdAdvertisingPostIfMissing(payload)
    await seedGoogleAdsBudgetPlannerPostIfMissing(payload)
    await seedChiropracticOfferBuilderPostIfMissing(payload)
  } catch (error) {
    console.error("[seed] Failed to seed blog content:", error)
  }
}

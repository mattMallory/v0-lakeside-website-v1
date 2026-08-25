import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { BlogCard } from "@/components/blog-card"
import { BlogRichText } from "@/components/blog-rich-text"
import { CaseStudyPostPage } from "@/components/case-study-post-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { formatBlogDate, getCaseStudyBySlug, getPostBySlug, getPublishedPosts } from "@/lib/blog"
import { defaultTuscolaCaseStudy } from "@/lib/case-study-defaults"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  const slugs = new Set(posts.map((post) => post.slug))
  slugs.add(defaultTuscolaCaseStudy.slug)
  return Array.from(slugs).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Article Not Found | Lakeside Blog",
    }
  }

  return {
    title: `${post.title} | Lakeside Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.featuredImageUrl
        ? {
            images: [
              {
                url: post.featuredImageUrl,
                alt: post.featuredImageAlt || post.title,
              },
            ],
          }
        : {}),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .filter((item) =>
      item.category?.slug === post.category?.slug ||
      item.tags.some((tag) => post.tags.some((t) => t.slug === tag.slug)),
    )
    .slice(0, 2)

  if (post.isCaseStudy) {
    const caseStudy = await getCaseStudyBySlug(slug)
    if (caseStudy) {
      return <CaseStudyPostPage post={caseStudy} relatedPosts={relatedPosts} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article>
        <header className="border-b border-border bg-white">
          <div className="mx-auto max-w-[720px] px-6 py-12 md:py-16">
            {post.category ? (
              <p className="font-brand-display flex items-center gap-2 text-sm font-semibold uppercase tracking-eyebrow text-primary">
                <span className="h-0.5 w-5 rounded-full bg-primary" />
                {post.category.name}
              </p>
            ) : null}

            <h1 className="mt-5 text-balance text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold leading-display text-heading">
              {post.title}
            </h1>

            <p className="mt-5 text-pretty text-xl leading-body text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-body text-muted-foreground-subtle">
              <span className="font-semibold text-secondary-button-foreground">By {post.authorName}</span>
              <span>·</span>
              <span>Lakeside Marketing</span>
              {post.readTime ? (
                <>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </>
              ) : null}
              <span>·</span>
              <span>{formatBlogDate(post.publishedAt)}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[720px] px-6 py-12 md:py-16">
          <BlogRichText content={post.content} />

          {post.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-lake-pale px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-body font-medium text-primary transition-colors hover:text-button-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-border bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-primary">
                Keep Reading
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-display text-heading">Related Articles</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </div>
  )
}

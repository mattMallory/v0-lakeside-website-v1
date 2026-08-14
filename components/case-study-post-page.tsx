import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { BlogCard } from "@/components/blog-card"
import { BlogRichText } from "@/components/blog-rich-text"
import { CaseStudyMetricsGrid } from "@/components/case-study-metrics-grid"
import { CaseStudyPracticeSidebar } from "@/components/case-study-practice-sidebar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { formatBlogDate, type BlogPostSummary, type CaseStudyPost } from "@/lib/blog"

type CaseStudyPostPageProps = {
  post: CaseStudyPost
  relatedPosts: BlogPostSummary[]
}

export function CaseStudyPostPage({ post, relatedPosts }: CaseStudyPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article>
        <header className="border-b border-border bg-white">
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              Case Study
            </p>

            <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-0.03em] text-heading sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-body text-muted-foreground">
              {post.clientName?.trim() ? (
                <>
                  <span className="font-medium text-heading">{post.clientName.trim()}</span>
                  <span className="text-border">·</span>
                </>
              ) : null}
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span className="text-border">·</span>
              <span>by {post.authorName}</span>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          </div>

          {post.featuredImageUrl ? (
            <div className="mx-auto max-w-5xl px-6 pb-12">
              <div className="relative aspect-[16/8] overflow-hidden rounded-[16px] bg-lake-pale">
                <Image
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>
          ) : null}
        </header>

        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <div className="mb-12">
            <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              Key Results
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-heading sm:text-3xl">
              Measurable outcomes from the engagement
            </h2>
            <CaseStudyMetricsGrid metrics={post.metrics} className="mt-8" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="min-w-0">
              <BlogRichText content={post.content} />

              {post.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="rounded-full bg-lake-pale px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-lake-light"
                    >
                      {tag.name}
                    </Link>
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

            <aside className="lg:sticky lg:top-24">
              <CaseStudyPracticeSidebar post={post} />
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-border bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 text-center">
              <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
                Keep Reading
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-heading">Related Articles</h2>
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

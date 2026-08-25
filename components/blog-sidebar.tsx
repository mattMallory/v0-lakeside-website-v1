"use client"

import Link from "next/link"
import Image from "next/image"

import { formatBlogDate, type BlogCategory, type BlogPostSummary, type BlogTag } from "@/lib/blog-types"
import { cn } from "@/lib/utils"

type BlogSidebarProps = {
  categories: BlogCategory[]
  tags: BlogTag[]
  latestPosts: BlogPostSummary[]
  activeCategorySlug?: string | null
  activeTagSlug?: string | null
  onCategorySelect: (slug: string | null) => void
  onTagSelect: (slug: string | null) => void
}

export function BlogSidebar({
  categories,
  tags,
  latestPosts,
  activeCategorySlug,
  activeTagSlug,
  onCategorySelect,
  onTagSelect,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-heading">
          All Categories
        </h2>
        <ul className="mt-4 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onCategorySelect(null)}
              className={cn(
                "font-brand-display flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-body transition-colors",
                !activeCategorySlug
                  ? "bg-lake-pale font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-heading",
              )}
            >
              <span>All Posts</span>
              {!activeCategorySlug ? <span aria-hidden>→</span> : null}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onCategorySelect(category.slug)}
                className={cn(
                  "font-brand-display flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-body transition-colors",
                  activeCategorySlug === category.slug
                    ? "bg-lake-pale font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-heading",
                )}
              >
                <span>{category.name}</span>
                {activeCategorySlug === category.slug ? <span aria-hidden>→</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-heading">
          Latest Posts
        </h2>
        <ul className="mt-4 space-y-4">
          {latestPosts.slice(0, 4).map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-lake-pale">
                  {post.featuredImageUrl ? (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-lake-pale to-lake-light" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-body font-semibold text-heading transition-colors group-hover:text-primary">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBlogDate(post.publishedAt)} · {post.authorName}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-brand-display text-sm font-semibold uppercase tracking-eyebrow text-heading">
          Topics
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = activeTagSlug === tag.slug
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagSelect(isActive ? null : tag.slug)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-lake-pale text-primary hover:bg-lake-light",
                )}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

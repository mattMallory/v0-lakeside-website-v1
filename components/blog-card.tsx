import Link from "next/link"
import Image from "next/image"

import { formatBlogDate, type BlogPostSummary } from "@/lib/blog-types"

type BlogCardProps = {
  post: BlogPostSummary
  layout?: "grid" | "list"
}

export function BlogCard({ post, layout = "grid" }: BlogCardProps) {
  const image = (
    <div
      className={
        layout === "grid"
          ? "relative aspect-[16/10] overflow-hidden rounded-lg bg-lake-pale"
          : "relative h-28 w-36 shrink-0 overflow-hidden rounded-sq bg-lake-pale sm:h-32 sm:w-44"
      }
    >
      {post.featuredImageUrl ? (
        <Image
          src={post.featuredImageUrl}
          alt={post.featuredImageAlt || post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={layout === "grid" ? "(max-width: 768px) 100vw, 50vw" : "176px"}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-lake-pale via-lake-light to-primary/20" />
      )}
    </div>
  )

  const body = (
    <div className={layout === "list" ? "min-w-0 flex-1" : "mt-5"}>
      {post.isCaseStudy || post.category ? (
        <p className="font-brand-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          {post.isCaseStudy ? "Case Study" : post.category?.name}
        </p>
      ) : null}
      <h2 className="mt-2 text-balance text-xl font-bold tracking-display text-heading transition-colors group-hover:text-primary md:text-2xl">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-2 text-body leading-relaxed text-muted-foreground md:text-body">
        {post.excerpt}
      </p>
      <p className="mt-4 text-body text-muted-foreground">
        <span>{formatBlogDate(post.publishedAt)}</span>
        <span className="mx-2 text-border">·</span>
        <span>by {post.authorName}</span>
      </p>
    </div>
  )

  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug}`}
        className={
          layout === "grid" ? "block rounded-card p-1" : "flex gap-5 rounded-card p-2"
        }
      >
        {image}
        {body}
      </Link>
    </article>
  )
}

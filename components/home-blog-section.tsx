import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import type { BlogPostSummary } from "@/lib/blog-types"

type HomeBlogSectionProps = {
  posts: BlogPostSummary[]
}

export function HomeBlogSection({ posts }: HomeBlogSectionProps) {
  if (posts.length === 0) return null

  return (
    <section id="blog" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
            Lakeside Blog
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.026em] text-heading sm:text-4xl">
            Latest From The Blog
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            render={<Link href="/blog" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

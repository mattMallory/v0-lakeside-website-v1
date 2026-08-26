"use client"

import { useMemo, useState } from "react"
import { ChevronDown, LayoutGrid, List, Search } from "lucide-react"

import { BlogCard } from "@/components/blog-card"
import { BlogSidebar } from "@/components/blog-sidebar"
import type { BlogCategory, BlogPostSummary, BlogTag } from "@/lib/blog-types"
import { cn } from "@/lib/utils"

const POSTS_PER_PAGE = 4

type SortOption = "newest" | "oldest" | "title"

type BlogRollProps = {
  posts: BlogPostSummary[]
  categories: BlogCategory[]
  tags: BlogTag[]
}

export function BlogRoll({ posts, categories, tags }: BlogRollProps) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOption>("newest")
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [activeTagSlug, setActiveTagSlug] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    let next = posts.filter((post) => {
      const matchesQuery =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.authorName.toLowerCase().includes(normalizedQuery)

      const matchesCategory =
        !activeCategorySlug || post.category?.slug === activeCategorySlug

      const matchesTag =
        !activeTagSlug || post.tags.some((tag) => tag.slug === activeTagSlug)

      return matchesQuery && matchesCategory && matchesTag
    })

    next = [...next].sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title)
      }

      const aTime = new Date(a.publishedAt).getTime()
      const bTime = new Date(b.publishedAt).getTime()

      if (sort === "newest") {
        return bTime - aTime
      }

      return aTime - bTime
    })

    return next
  }, [posts, query, sort, activeCategorySlug, activeTagSlug])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  function resetPage() {
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-page px-6 pb-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-sq border border-border bg-card p-1">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setLayout("grid")}
                  className={cn(
                    "rounded-sm p-2 transition-colors",
                    layout === "grid" ? "bg-lake-pale text-primary" : "text-muted-foreground hover:text-heading",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setLayout("list")}
                  className={cn(
                    "rounded-sm p-2 transition-colors",
                    layout === "list" ? "bg-lake-pale text-primary" : "text-muted-foreground hover:text-heading",
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <p className="font-brand-display text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                Showing {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="font-brand-display flex items-center gap-2 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                Sort by
                <span className="relative">
                  <select
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as SortOption)
                      resetPage()
                    }}
                    className="appearance-none rounded-sq border border-border bg-card py-2 pl-3 pr-9 text-body normal-case tracking-normal text-heading"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                </span>
              </label>

              <label className="relative block min-w-[220px]">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    resetPage()
                  }}
                  placeholder="Search articles..."
                  className="w-full rounded-full border border-border bg-card py-2.5 pr-4 pl-10 text-body text-heading outline-none transition-colors focus:border-primary"
                />
              </label>
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <div
              className={cn(
                "mt-8",
                layout === "grid" ? "grid gap-8 md:grid-cols-2" : "flex flex-col gap-6",
              )}
            >
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} layout={layout} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-lg font-semibold text-heading">No articles found</p>
              <p className="mt-2 text-body text-muted-foreground">
                Try adjusting your search, category, or tag filters.
              </p>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const isActive = pageNumber === currentPage

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={cn(
                      "font-brand-display min-w-10 rounded-sq px-3 py-2 text-body font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "border border-border bg-card text-muted-foreground hover:text-heading",
                    )}
                  >
                    {String(pageNumber).padStart(2, "0")}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <BlogSidebar
          categories={categories}
          tags={tags}
          latestPosts={posts}
          activeCategorySlug={activeCategorySlug}
          activeTagSlug={activeTagSlug}
          onCategorySelect={(slug) => {
            setActiveCategorySlug(slug)
            setPage(1)
          }}
          onTagSelect={(slug) => {
            setActiveTagSlug(slug)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}

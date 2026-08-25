import Link from "next/link"

import { getBlogTags, getPublishedPosts } from "@/lib/blog"
import { getBrandingContent } from "@/lib/branding"
import { getNavigationContent } from "@/lib/navigation"

const RECENT_POST_LIMIT = 3
const TOPIC_LIMIT = 5

function getPopularTags(tags: Awaited<ReturnType<typeof getBlogTags>>, posts: Awaited<ReturnType<typeof getPublishedPosts>>) {
  const tagCounts = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag.slug, (tagCounts.get(tag.slug) ?? 0) + 1)
    }
  }

  return [...tags]
    .sort((a, b) => {
      const countDiff = (tagCounts.get(b.slug) ?? 0) - (tagCounts.get(a.slug) ?? 0)
      if (countDiff !== 0) return countDiff
      return a.name.localeCompare(b.name)
    })
    .slice(0, TOPIC_LIMIT)
}

export async function SiteFooter() {
  const [branding, navigation, tags, posts] = await Promise.all([
    getBrandingContent(),
    getNavigationContent(),
    getBlogTags(),
    getPublishedPosts(100),
  ])

  const topics = getPopularTags(tags, posts)
  const recentPosts = posts.slice(0, RECENT_POST_LIMIT)

  return (
    <footer className="border-t border-[#1E293B] bg-ink text-slate-400">
      <div className="mx-auto max-w-page px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[45%_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <img
                src={branding.logoUrl}
                alt={branding.logoAlt}
                // Height comes from Branding; resolveLogoHeight clamps it to 16-96px.
                style={{ height: `${branding.logoHeight}px` }}
                className="w-auto max-w-[9.5rem] object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Patient acquisition systems for natural wellness clinics. More appointments, less marketing guesswork.
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/85">Pages</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navigation.footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white/85">Most Popular Topics</h3>
            {topics.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {topics.map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/blog?tag=${tag.slug}`}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Topics coming soon.</p>
            )}
          </div>

          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-white/85">Recent Articles</h3>
            {recentPosts.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm leading-snug text-slate-400 transition-colors hover:text-white"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">New articles coming soon.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            {"© "}
            {new Date().getFullYear()} Lakeside. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

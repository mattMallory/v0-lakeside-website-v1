import { ChiropracticOfferBuilder } from "@/components/chiropractic-offer-builder"

/**
 * Viewport-test fixture for the chiropractic offer builder.
 *
 * The offer builder ships only as a Lexical block inside a blog post, so the sole
 * way to reach it is `/blog/[slug]`. The local SQLite database has no `posts`
 * table, so no post renders locally and the component is otherwise unreachable
 * for automated testing.
 *
 * This file is compiled into the route tree only when E2E_FIXTURES=1 (see the
 * `pageExtensions` block in next.config.ts), so it does not exist in a
 * production build.
 *
 * The wrapper markup is copied verbatim from the `offerBuilder` converter in
 * components/blog-rich-text.tsx so the CSS cascade matches the real embed.
 */
export default function OfferBuilderFixturePage() {
  return (
    <div className="blog-rich-text-breakout blog-offer-builder-breakout not-prose">
      <ChiropracticOfferBuilder embedded />
    </div>
  )
}

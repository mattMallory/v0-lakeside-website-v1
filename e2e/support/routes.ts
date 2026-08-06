/**
 * The routes the viewport suite sweeps.
 *
 * Add a route here and it is automatically covered by every assertion in
 * breakpoints.spec.ts at every width in the matrix. That is the extension point —
 * new pages need a line here, not a new spec file.
 */
/**
 * The offer builder ships only as a blog block, so it is reached through a
 * fixture page that exists only while E2E_FIXTURES=1. Note the folder is not
 * underscore-prefixed: App Router treats `_folder` as private and excludes it
 * from routing entirely.
 */
export const OFFER_BUILDER_FIXTURE = "/e2e-fixtures/offer-builder"

export type Route = {
  path: string
  name: string
  /** Set when the route only exists while E2E_FIXTURES=1. */
  fixture?: boolean
  /** Why a route is absent from the sweep, when it is. */
  skip?: string
}

export const ROUTES: Route[] = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/services", name: "services" },
  { path: "/blog", name: "blog index" },
  { path: "/consultation", name: "consultation" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
  { path: "/tools/google-ads-budget-planner", name: "budget planner" },
  { path: OFFER_BUILDER_FIXTURE, name: "offer builder", fixture: true },
]

/**
 * Routes that cannot be exercised in this environment, recorded rather than
 * silently omitted.
 */
export const UNCOVERED_ROUTES: Route[] = [
  {
    path: "/blog/[slug]",
    name: "blog post",
    skip:
      "The local SQLite database has no `posts` table, so no post renders. Only " +
      "the hard-coded Tuscola case-study slug has a fallback, and it renders the " +
      "case-study layout rather than the standard article layout. Covering this " +
      "needs the local schema repair that is scheduled separately.",
  },
]

export const ACTIVE_ROUTES = ROUTES.filter((route) => !route.skip)

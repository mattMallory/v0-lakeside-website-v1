# Viewport test suite

The first automated tests in this repository. They guard the breakpoint canon
documented in `docs/breakpoints.md`.

```bash
pnpm test:e2e                      # whole suite — builds, serves, sweeps
pnpm test:e2e offer-builder        # one spec
pnpm test:e2e --headed             # watch it
pnpm test:e2e:report               # open the last HTML report
```

`pnpm exec playwright install chromium` is needed once on a fresh machine.

The suite runs the production build, not `next dev`, so what is measured is what
ships. A full run is roughly two minutes including the build — inside a
per-pull-request budget, which is the point. It is Chromium-only on purpose: these
are layout-breakpoint defects, so widths carry the signal and extra engines would
multiply cost without adding any.

## Layout

| Path | Role |
|---|---|
| `support/breakpoints.ts` | The canonical scale and the viewport matrix. |
| `support/routes.ts` | Route registry. **Add a route here and every assertion covers it.** |
| `support/assertions.ts` | The three checks, as reusable functions. |
| `support/known-debt.ts` | Pre-existing defects the suite detects but does not fail on. |
| `breakpoints.spec.ts` | The sweep: every route × every width × all three assertions. |
| `offer-builder-dead-zone.spec.ts` | Regression test for the 768–820px defect. |
| `harness-self-check.spec.ts` | Tests for the tests. |
| `tools/layout-snapshot.spec.ts` | Records rendered geometry (opt-in). |
| `tools/diff-layout.mjs` | Diffs two snapshots. |

## The three assertions

1. **Lead capture stays reachable.** Elements are grouped by `data-lead-capture`.
   A responsive pair deliberately hides one member, so the invariant is that
   *exactly one* member of each group is visible — not that none is hidden. Both
   members resolving to `display: none` is the defect this suite exists for.

2. **No horizontal overflow.** `document.documentElement.scrollWidth` is
   deliberately **not** used: the root layout sets `overflow-x-clip` on `html` and
   `body`, so a clipped box reports its clamped size and scrollWidth equals the
   viewport width even when content genuinely overflows. The assertion walks
   element rects instead. `harness-self-check.spec.ts` proves both halves of that
   — that scrollWidth misses a 200vw element, and that this assertion catches it.

3. **44px minimum touch target.** Inline controls are exempt, per WCAG 2.5.8:
   a link inside a sentence cannot meet 44px without breaking line height.
   Visually-hidden native inputs are skipped too — `sr-only` radios and
   `.offer-builder-native-input` are accessibility proxies, and the styled
   `<label>` that is the real target gets measured on its own.

## Known debt

`support/known-debt.ts` records pre-existing defects so the suite can be green
about the breakpoint canon without pretending the rest is fine. Every entry was
measured by this suite, and names the audit finding it belongs to, or `NEW`.

It is a ledger, not a tolerance: entries are specific selectors, never wildcards
and never a raised threshold, and `harness-self-check.spec.ts` proves each
assertion still fires. **Fixing a control means deleting its entry.**

## The offer-builder fixture

The offer builder ships only as a Lexical block inside a blog post, so the only way
to reach it is `/blog/[slug]`. The local SQLite database has no `posts` table, so
no post renders locally and the component is otherwise untestable.

`app/(frontend)/e2e-fixtures/offer-builder/page.e2e.tsx` renders it directly, using
wrapper markup copied from the `offerBuilder` converter in
`components/blog-rich-text.tsx` so the CSS cascade matches the real embed.

It becomes a route **only** when `E2E_FIXTURES=1`, via the `pageExtensions` block in
`next.config.ts` — so it is absent from a production build rather than merely
unreachable. Verify with `pnpm build`: the route table has no `/e2e-fixtures` entry.

Note the folder is not underscore-prefixed. App Router treats `_folder` as private
and excludes it from routing entirely, which silently produces a 404.

## Proving a change did not move anything

`docs/breakpoints.md` claims the canon change altered rendering only inside the
dead zone. That claim was produced this way, not by reading CSS:

```bash
LAYOUT_SNAPSHOT=1 SNAPSHOT_OUT=.layout/before.json pnpm test:e2e layout-snapshot
# make the change
LAYOUT_SNAPSHOT=1 SNAPSHOT_OUT=.layout/after.json  pnpm test:e2e layout-snapshot
node e2e/tools/diff-layout.mjs .layout/before.json .layout/after.json
```

Run it twice against unchanged code first. Some pages — `/consultation` at 375px is
the known one — vary by a few pixels between runs because of embedded iframe
height, and you need to know that before reading a diff.

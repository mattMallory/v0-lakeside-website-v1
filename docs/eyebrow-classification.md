# Eyebrow classification

All 46 hand-written uppercase labels, classified. This exists because "one element implemented
28 ways" turned out to be partly an illusion: a third of these are not eyebrows at all, they
just share styling with one.

Pete's specification: **14px, semibold, 0.1em, no leading dash.**

Letter-spacing is not a signal of intent here — **all 46 already use `tracking-eyebrow`**, unified
in the Group C batch. Only size and weight still vary.

---

## A — Already exactly Pete's specification (11 sites)

`text-sm` is 14px, and these carry semibold, 0.1em and no dash. **They already render the approved
eyebrow.** Nothing about them looks wrong; only the duplication remains.

| Site | Element |
|---|---|
| `app/(frontend)/blog/[slug]/page.tsx:155` | `<p>` above `<h2>` |
| `app/(frontend)/consultation/page.tsx:21` | `<p>` above `<h1>` |
| `components/about-process.tsx:16` | `<p>` above `<h2>` |
| `components/case-study-highlight.tsx:47` | `<p>` above `<h2>` |
| `components/case-study-post-page.tsx:26` | `<p>` above `<h1>` |
| `components/case-study-post-page.tsx:67` | `<p>` above `<h2>` |
| `components/case-study-post-page.tsx:116` | `<p>` above `<h2>` |
| `components/home-about-section.tsx:60` | `<p>` above `<h2>` |
| `components/legal-page-content.tsx:10` | `<p>` above `<h1>` |
| `components/services-section.tsx:21` | `<p>` above `<h2>` |
| `components/services-tech-stack.tsx:16` | `<p>` above `<h2>` |

## B — Structural eyebrows that need a change (7 sites)

Same position and role, but the size or colour differs from the specification.

| Site | Current size | Weight | Differs by |
|---|---|---|---|
| `app/(frontend)/blog/[slug]/page.tsx:93` | `text-sm` | `font-semibold` | `flex` `items-center` `gap-2` |
| `components/blog-article-cta.tsx:23` | `text-xs` | `font-semibold` | `blog-article-cta-eyebrow` `mb-4` `text-xs` |
| `components/blog-card.tsx:37` | `text-xs` | `font-semibold` | `text-xs` |
| `components/chiropractic-offer-builder.tsx:207` | `text-micro` | `font-semibold` | `text-micro` |
| `components/google-ads-budget-planner.tsx:107` | `text-xs` | `font-semibold` | `text-xs` |
| `components/patient-journey-interactive.tsx:93` | `text-micro` | `font-semibold` | `mb-3.5` `text-micro` `text-muted-foreground-subtle` |
| `components/patient-journey-interactive.tsx:289` | `text-micro` | `font-semibold` | `text-micro` |

## C — Not eyebrows (10 sites)

**Leave these alone.** They share the uppercase styling but are different elements doing different
jobs. Applying an eyebrow specification here would change things nobody asked about — and it would
look like a faithful migration in the diff.

| Site | What it actually is |
|---|---|
| `components/blog-roll.tsx:107` | status line — "Showing N results" |
| `components/blog-roll.tsx:113` | <label> — wraps the sort <select> |
| `components/blog-sidebar.tsx:31` | <h2> — it IS the heading ("All Categories") |
| `components/blog-sidebar.tsx:71` | <h2> — it IS the heading ("Latest Posts") |
| `components/blog-sidebar.tsx:106` | <h2> — it IS the heading ("Topics") |
| `components/case-study-metrics-grid.tsx:20` | badge — absolute-positioned "Featured Result" pill |
| `components/case-study-practice-sidebar.tsx:54` | <dt> — definition term inside a <dl> |
| `components/chiropractic-offer-builder.tsx:75` | badge — step counter |
| `components/chiropractic-offer-builder.tsx:222` | badge — corner clarity marker |
| `components/homepage-growth-system.tsx:359` | pill — category tag on a blog card |

## D — Needs an aesthetic call (18 sites)

Small uppercase labels that introduce **no heading**. They label a stat, a form field, or a block
of copy. Whether they are eyebrows is a judgement about intent, not markup, so it is not mine to
make.

**Recommendation:** treat them as a separate class — a *field label* — with its own specification,
rather than forcing them into the eyebrow. Several are 11px next to numeric readouts, where 14px
would compete with the value it labels.

| Site | Element | Size | Weight |
|---|---|---|---|
| `components/about-process-diagram.tsx:231` | `<p>` | `text-micro` | `font-semibold` |
| `components/blog-references.tsx:55` | `<p>` | `text-xs` | `font-semibold` |
| `components/case-study-metrics-grid.tsx:25` | `<p>` | `text-micro` | `font-semibold` |
| `components/chiropractic-offer-builder.tsx:226` | `<p>` | `text-micro` | `font-semibold` |
| `components/chiropractic-offer-builder.tsx:232` | `<p>` | `text-xs` | `font-bold` |
| `components/chiropractic-offer-builder.tsx:443` | `<p>` | `text-xs` | `font-bold` |
| `components/chiropractic-offer-builder.tsx:482` | `<p>` | `text-micro` | `font-semibold` |
| `components/chiropractic-offer-builder.tsx:485` | `<p>` | `text-xs` | `font-bold` |
| `components/chiropractic-offer-builder.tsx:567` | `<p>` | `text-caption` | `font-bold` |
| `components/google-ads-budget-planner.tsx:238` | `<p>` | `text-micro` | `font-medium` |
| `components/google-ads-budget-planner.tsx:251` | `<p>` | `text-micro` | `—` |
| `components/google-ads-budget-planner.tsx:266` | `<p>` | `text-micro` | `—` |
| `components/google-ads-budget-planner.tsx:289` | `<p>` | `text-micro` | `font-semibold` |
| `components/homepage-growth-system/growth-system-funnel.tsx:41` | `<span>` | `text-micro` | `font-bold` |
| `components/patient-journey-interactive.tsx:111` | `<p>` | `text-micro` | `font-semibold` |
| `components/patient-journey-interactive.tsx:228` | `<p>` | `text-micro` | `font-semibold` |
| `components/patient-journey-interactive.tsx:236` | `<p>` | `text-micro` | `font-semibold` |
| `components/patient-journey-interactive.tsx:261` | `<p>` | `text-micro` | `font-semibold` |

---

## Why tier A was not consolidated into the shared component

The obvious next step is to replace those 11 hand-written eyebrows with `<SectionEyebrow>` and
delete the duplication. **It was tried, measured, and not shipped.**

Replacing them moved **756 elements across 84 route/width combinations** — whole sections shifting
by ~11px on six routes. Two candidate causes were tested and neither was it:

- **Line-height.** `text-sm` carries a paired line-height of 1.25rem; the component's
  `text-eyebrow` has none and inherits. Pinning `leading-5` (exactly 1.25rem) at the call sites
  changed nothing: still 756.
- **The vestigial flex.** The component is `inline-flex items-center`, which existed only to sit
  the leading dash beside the text. The dash was removed, so the flex does nothing. Removing it
  made things *worse* — 872 — and, isolated on its own, it moves **374 elements** across the 15
  existing component usages.

So the two implementations differ in box model, not styling: a block `<p>` and an inline-flex
`<div>` do not occupy the same space even with identical type.

**That leaves a real decision, and it is not a technical one.** These 11 already render the
approved eyebrow exactly. Consolidating them buys 11 fewer copies of the same markup and costs a
small vertical shift on six routes. Worth it or not is a call for the owners.

**A cheaper option worth considering:** make the component render a block element and drop the
flex — it is dead weight now — and accept the 374-element shift on the existing usages *once*,
after which hand-written eyebrows can be folded in for free. That trades one deliberate change
for permanent convergence, rather than paying a shift every time a site is migrated.

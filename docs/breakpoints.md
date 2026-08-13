# Breakpoint canon

The single breakpoint vocabulary for this site, derived from where layouts
genuinely change rather than from the values that happened to be in the code.

The machine-readable form is `e2e/support/breakpoints.ts`; the theme tokens are at
the top of the `@theme inline` block in `app/globals.css`. This document is the
justification. Keep all three in step.

---

## The canon

**The Tailwind v4 default scale, unmodified.**

| Name | Min width | Use |
|---|---|---|
| `sm` | 640px | rarely used here |
| `md` | **768px** | single column → side-by-side content; mobile panel → desktop panel |
| `lg` | **1024px** | stacked → multi-column page grid |
| `xl` | 1280px | rarely used here |
| `2xl` | 1536px | unused |

Two rules follow from having one vocabulary:

1. **A hand-written media query must use a canon value**, or one less than it for
   a `max-width`. `min-width: 768px` and `max-width: 767px` are the only forms
   allowed around `md`. There is no gap and no overlap between them.
2. **A `matchMedia` string must match the boundary of the element it governs.**
   If a panel is `md:hidden`, the script that decides whether that panel is on
   screen must ask for `(max-width: 767px)` and nothing else.

The five `--breakpoint-*` tokens are declared explicitly in the `@theme` block of
`app/globals.css`, at exactly Tailwind's default values and in the same units
(`40rem` / `48rem` / `64rem` / `80rem` / `96rem`). They are written out so every
layer can see the same five numbers rather than inheriting them invisibly — not
to change them. **No token overrides a default**, and none should: these values
are already what every `sm:`/`md:`/`lg:` utility in the codebase compiles to, so
altering one would silently move several hundred existing class usages.

---

## Why 820/821 was not preserved

The pre-existing code carried four vocabularies that disagreed:

| Vocabulary | Values | Where |
|---|---|---|
| Tailwind utilities | 640 / **768** / 1024 | `sm:` `md:` `lg:` |
| Hand-written CSS | 767, 768, **820, 821**, 1023 | `app/globals.css` |
| JS `matchMedia` | 767, **820**, 1023 | components and injected scripts |
| JS constant | 767 | `google-ads-budget-planner.tsx` (`MOBILE_MAX_WIDTH`) |

767, 768, 1023 and 1024 are all already canon: they are `md` and `lg` and their
`max-width` complements. **820 and 821 belonged to nothing.** They were not a
considered decision — they are where one component stopped fitting on one device.

Keeping 820 would have meant enshrining a measurement of one card's intrinsic
width as a site-wide layout boundary. It was removed from the offer builder
instead, and everything there now keys on `md` and `lg`.

The 53px band between `md` (768) and the hand-written 820 is exactly where the
offer builder's lead-capture form was invisible. See `MOB-01` in
`docs/audit-report.md` and `e2e/offer-builder-dead-zone.spec.ts`.

---

## Every non-standard value, accounted for

Required: each non-canon breakpoint is either folded in or recorded as a named
exception. This is the complete list as of this change.

| Value | Where it was | Outcome |
|---|---|---|
| `max-width: 1023px` | `globals.css` ×4 (lines 110, 685, 698, 1363) | **Folded in** — this is `max-lg`, already canon. |
| `max-width: 767px` | `globals.css` ×2 (lines 1410, 1492) | **Folded in** — this is `max-md`, already canon. |
| `min-width: 768px` | `globals.css` ×2 (lines 921, 1004) | **Folded in** — this is `md`. |
| `min-width: 821px` | `globals.css`, offer-builder sticky preview | **Removed.** Replaced by `md:sticky md:top-20 md:h-fit md:self-start` on the element, which is where the same intent was already half-expressed as `lg:`. |
| `max-width: 820px` | `globals.css`, offer-builder layout block | **Moved to `max-width: 767px`.** The two `display: none !important` rules inside it were deleted: they duplicated the `hidden md:grid` / `hidden md:flex` utilities on the same elements, and the 53px where the two disagreed is what hid the form. |
| `max-width: 820px` (JS) | `chiropractic-offer-builder.tsx`, embed init | **Moved to `max-width: 767px`** so it tracks the `md:hidden` panel it exists to serve. |
| `max-width: 1023px` (JS) | `about-process-diagram.tsx` | **Folded in** — `max-lg`. |
| `max-width: 767px` (JS) | `tech-logos-reveal-inline.ts`, `metric-count-up-inline.ts` | **Folded in** — `max-md`. |
| `MOBILE_MAX_WIDTH = 767` | `google-ads-budget-planner.tsx` | **Folded in** — `max-md`. |
| `max-width: 820px` | `globals.css`, **budget-planner** layout block | **Resolved.** The `--breakpoint-planner` token is deleted. The media query still reads `max-width: 820px`; moving it to `767px` is an approved visual change and is made separately. |

Image `sizes` attributes also contain widths (768, 1024). They are resource-selection
hints for the browser, not layout boundaries, and already use canon values.

---

## The former exception: `planner` (821px) — resolved

**There are no exceptions. The canon above is the whole vocabulary.**

The budget planner used to wrap its row at 820/821px rather than at `md`, because
that is where a 380px form column and a 320px results column stop fitting side by
side. It was recorded as a named exception because every way of removing it changed
what the planner rendered between 768 and 820px, and that was a design decision
rather than a cleanup.

**The decision was taken on 2026-08-13: the layout boundary moves to `md` (768px).**
The two columns will sit side by side from 768px up. Measured beforehand at 820px:
the results card moves from full width at x=56 to a 304px column at x=460.

That is an intentional visual change, so it is made separately from the token work.
As of this document:

- `--breakpoint-planner` is **deleted** — it declared 821px while the rule
  implementing it hardcoded `max-width: 820px` and never read the token, and no
  `planner:` variant was ever used. It was documentation wearing the shape of a
  mechanism.
- The `max-width: 820px` media query in `app/globals.css` is **still there**, and
  moves to `767px` when the approved layout change is made.

---

## Test matrix

`e2e/support/breakpoints.ts` sweeps every route at:

**Boundaries** — 767, 768, 820, 821, 1023, 1024. The exact pixels where the four
vocabularies disagreed. 820 and 821 stay in the matrix even though no rule keys on
them any more, because that is where a regression would reappear.

**Devices** — 320, 375, 390, 430, 768, 810, 834, 1024, 1280, 1440.

768 is both: it is Tailwind's `md` boundary and iPad Mini portrait, which is why the
dead zone landed on a real, common device.

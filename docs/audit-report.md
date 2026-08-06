# Lakeside Website — Codebase Audit

**Status: DRAFT.** Findings are re-verified but remediation has not happened. Each finding carries a stable identifier (`DS-01`, `MOB-02`, …) and a `Resolution:` line reserved for the outcome once the work is done.

**Audience:** Matt and Pete.

---

## How to read this report

### What verification means here

This audit was performed by reading source. Nothing was executed. That is not a shortcut — it is the only honest option available, and it bounds what this report is allowed to claim.

The repository has no working safety net:

- No test suite, no test runner, no test files.
- `eslint` is not an installed dependency, so `"lint": "eslint ."` (`package.json:11`) fails as written.
- Type checking is disabled — `next.config.ts` sets `typescript.ignoreBuildErrors: true`.

So this report **never** claims the build passes, types check, lint is clean, or tests pass. None of those has been established.

Every finding was checked by opening the cited file and confirming the claim against what is actually there. Where a line number had drifted, the anchor was corrected. Where the evidence contradicted the claim, the claim was corrected and the discrepancy recorded — several were.

### Verification legend

| Mark | Meaning |
|---|---|
| **Confirmed** | Re-verified by reading the cited file; claim and anchor both hold. |
| **Corrected** | True in substance; anchor, count, or mechanism adjusted. Corrections are stated inline. |
| **Contested** | Evidence contradicts the claim as stated. Reported with the contradiction. |
| **Unverified** | Could not be settled without running the code. Labelled, not asserted. |

### Severity

| Level | Meaning |
|---|---|
| **S1** | Active user-facing or data-integrity harm today. |
| **S2** | Latent defect; harm on a plausible near-term trigger. |
| **S3** | Structural drag on velocity and correctness; no direct user harm. |

---

## The central finding

### Pete produces a design system. Matt receives pixels.

This is a diagnosis, not a defect. Everything in the six sections below is downstream of it.

Claude Design's output is structured. It has components, tokens, variants, and viewports — a vocabulary. **Nothing carries that structure across into the repository.** What survives the handoff is the rendered appearance. Components are therefore re-implemented from visual reference, and a re-implementation has nothing to be *correct against* — only something to *look like*.

Follow the causal chain. Each link is anchored to a file.

**Link 1 — The vocabulary is defined, then not used.**

`app/globals.css:51-60` defines ten radius tokens. Five of them are purpose-named — they encode design intent:

```css
--radius-pill: 999px;      /* globals.css:58 */
--radius-sq: 0.625rem;     /* globals.css:59 */
--radius-card: 0.75rem;    /* globals.css:60 */
```

Those three, plus `--radius-3xl` and `--radius-4xl`, are used **zero times** repo-wide. Meanwhile `rounded-full` is written 37 times, `rounded-[10px]` — which is exactly `--radius-sq` — is written 19 times, and 51 card surfaces choose a radius by hand while `--radius-card` sits unreferenced.

The other five tokens (`sm`/`md`/`lg`/`xl`/`2xl`) *are* used, 56 times combined — but those are Tailwind's built-in utility names. They would work with no `@theme` block at all; lines 51-55 only retune their values. **Every token representing authored design vocabulary has zero adoption.** The design system exists in the stylesheet and nowhere else.

**Link 2 — Without vocabulary, each file invents its own.**

Independently re-derived counts (method stated in the Design System section):

| Measure | Count |
|---|---|
| Arbitrary Tailwind bracket values | **730** across 54 files |
| Arbitrary hex colour classes | **161** |
| Raw hex strings in TSX | **185** |
| Arbitrary font sizes | **101** across 15 distinct values |
| Arbitrary letter-spacing values | **118** across 12 distinct values |
| Hardcoded border radii | **67** across 10 distinct values |
| Inline `style={{}}` props | **27** |

The single sharpest artifact in the codebase is `components/case-study-highlight.tsx:45-48`. The shared component and its hand-rolled duplicate sit **two lines apart, in the same ternary**:

```tsx
{isDark ? (
  <SectionEyebrow variant="dark">{eyebrow}</SectionEyebrow>
) : (
  <p className="font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary">
```

Those two branches do not render the same thing. `SectionEyebrow` is `text-[11px]` with `tracking-[0.14em]` and a leading dash; the inline `<p>` is `text-sm` with `tracking-[0.1em]` and no dash. The same eyebrow changes size and letter-spacing depending on which colour variant is active. That is not a decision anyone made — it is what happens when the same element is built twice from a picture.

**Link 3 — Re-implementations fail on real devices, and the fix is added *beside* the original, never instead of it.**

This is the part the code says out loud. Three comments, verbatim:

> `app/globals.css:1362`
> ```css
> /* Growth funnel — mobile CSS-only tabs (no JS, works on iOS Safari) */
> ```

> `components/homepage-growth-system/growth-system-funnel.tsx:103`
> ```tsx
> {/* Mobile: CSS-only radio + label tabs (no JS — reliable on iOS Safari) */}
> ```

> `app/globals.css:1502`
> ```css
> /* Case study metrics: CSS scroll-driven reveal when JS count-up is unavailable (iOS Safari). */
> ```

Each documents the same manoeuvre: a JS implementation was written, it proved unreliable on iOS Safari, and a second CSS-only implementation was added *alongside* it. The word in the third comment is "unavailable" — the JS path is still there. Both ship.

**Link 4 — The result is two-to-three implementations per interactive feature, keyed to four non-aligned breakpoint vocabularies.**

| Vocabulary | Values | Where |
|---|---|---|
| Tailwind defaults | 640 / **768** / 1024 | `sm` / `md` / `lg` |
| Hand-written CSS | **767, 768, 820, 821, 1023** | `app/globals.css` |
| JS `matchMedia` | **767, 820, 1023** | `chiropractic-offer-builder.tsx:265`, `about-process-diagram.tsx:32`, `tech-logos-reveal-inline.ts:23`, `metric-count-up-inline.ts:29` |
| JS constant | **767** | `google-ads-budget-planner.tsx:111` (`MOBILE_MAX_WIDTH`) |

Tailwind's `md` fires at 768. The hand-written CSS fires at 820. Those two boundaries are 52 pixels apart, and **MOB-01 below is exactly the gap between them** — a real, revenue-affecting defect that exists solely because two of these four vocabularies disagree.

Coordination between the duplicate implementations is by timer, not by data flow: 19 `setTimeout`/`setInterval` calls across 9 files, including the three inline vanilla-JS tool scripts.

**Why this matters commercially.** Failures of this shape surface only at specific viewport widths on real touch hardware. They are invisible in desktop review, invisible in a component-level look, and invisible to a build that does not type-check. They are found by a chiropractor on an iPad who does not see a form and does not report it. That is the class of bug this architecture produces — found late, found repeatedly, and found by the customer.

**What this is not.** No individual file here is badly written. The problem is not craft; it is the absence of a shared artifact between design and code. The remediation target is a vocabulary that both ends can be correct against — not a redesign.

---

## 1. Design system

**DS-01 — Authored design tokens have zero adoption** · S3 · **Corrected**

`app/globals.css:51-60` defines 10 radius tokens. Five have **zero** uses repo-wide: `--radius-3xl`, `--radius-4xl`, `--radius-pill` (`:58`), `--radius-sq` (`:59`), `--radius-card` (`:60`). Verified by grepping `rounded-3xl|rounded-4xl|rounded-pill|rounded-sq|rounded-card` across `*.tsx|*.ts|*.css` — 0 hits each.

*Correction:* the pre-audit claim was "10 radius tokens defined and used zero times." That is false as stated — 5 of 10 have zero uses; the other 5 total 56 uses. The corrected version is arguably worse: **the zero-use five are precisely the purpose-named, hand-authored ones.** The five that are used are Tailwind's built-in names, which work without the token block at all.

Each zero-use token has a hardcoded doppelgänger in heavy use: `--radius-sq` (10px) vs `rounded-[10px]` ×19; `--radius-pill` vs `rounded-full` ×37; `--radius-card` (12px) vs 51 hand-styled card surfaces.

`Resolution:` _pending_

---

**DS-02 — 730 arbitrary values stand in for a token scale** · S3 · **Confirmed**

Counts re-derived independently over `app/` and `components/` `*.tsx`:

| Measure | Command basis | Count | Pre-audit claim |
|---|---|---|---|
| Arbitrary bracket values | `-\[…\]` in class position | **730** across **54 files** | ~730 across 45 files |
| Arbitrary hex colour classes | `-\[#…\]` | **161** | 161 |
| Raw hex strings in TSX | `#[0-9A-Fa-f]{6}` | **185** | 185 |
| Arbitrary font sizes | `text-\[…(px\|rem\|em)\]` | **101** / **15** distinct | 100 / 14 distinct |
| Arbitrary letter-spacing | `tracking-\[…\]` | **118** / **12** distinct | 118 / 12 distinct |
| Hardcoded radii | `rounded(-x)?-\[…\]` | **67** / **10** distinct | 67 / 10 distinct |
| Inline `style={{}}` | `style=\{\{` | **27** | 27 |

Six of seven measures reproduce exactly. Two minor corrections: the bracket values span **54** files, not 45 (the 730 total matches exactly); arbitrary font sizes are **101 across 15** distinct values, not 100 across 14. The pre-audit measurements were sound.

The radius values form a near-continuous ramp — 7, 8, 9, 10, 11, 12, 14, 16, 18, 20px. There is no scale, only per-file choices. `rounded-[11px]` and `rounded-[9px]` differ from neighbours by 1px: visually indistinguishable, structurally divergent.

`Resolution:` _pending_

---

**DS-03 — One eyebrow element, 24+ divergent implementations** · S3 · **Confirmed**

`SectionEyebrow` (`components/homepage-growth-system/section-eyebrow.tsx:9`) exists and is imported in 9 files. It does not win. Grepping `uppercase` across `app/` and `components/` returns **52 occurrences in 30 files**; normalising each by (font-family, size, weight, tracking, colour) yields **29 distinct variants** — 24 after excluding 6 non-eyebrow uses.

One hand-rolled class string is copy-pasted verbatim **14 times**:

```
font-brand-display text-sm font-semibold uppercase tracking-[0.1em] text-primary
```

Divergence across the 52: **6** distinct letter-spacings (`0.1em`, `0.08em`, `0.05em`, `0.14em`, `0.06em`, `0.12em`), **5** font sizes, **3** font weights, **11** explicit colours.

The colour `#7cb0e8` is declared as a literal **five separate times** in `app/globals.css` — lines **810, 818, 850, 871, 891** — under five differently-named eyebrow classes, while the same value already exists as `--chart-3` at `app/globals.css:96`.

Sharpest citation remains `components/case-study-highlight.tsx:45` and `:47` (see central finding).

`Resolution:` _pending_

---

**DS-04 — No card component; 31 variants of one surface** · S3 · **Confirmed**

`components/ui/` contains exactly one file (`button.tsx`). There is no `Card`. Filtering `rounded` hits to containers with a background plus a border/shadow/ring yields **51 card-like containers in 31 distinct variants**.

Two largest clusters are the same concept — a bordered white panel — spelled differently:

- `rounded-2xl border border-border bg-white` ×6 (`about-team.tsx:10`, `about-vision-mission.tsx:24`, `blog-author-bio.tsx:47`, `homepage-growth-system.tsx:68`, `:263`, `:385`)
- `rounded-[14px] border border-border bg-white` ×6 (`blog-references.tsx:53`, `case-study-practice-sidebar.tsx:45`, `chiropractic-offer-builder.tsx:46`, `:73`, `:139`, `patient-journey-interactive.tsx:183`)

`rounded-2xl` resolves to 21.6px; `rounded-[14px]` to 14px. Same element, 7.6px apart.

Elevation uses **four mutually incompatible mechanisms** on the same element type. Three near-identical cards:

- `how-it-works-step-card.tsx:41` — border, no elevation
- `why-choose.tsx:34` — `shadow-sm ring-1 ring-border`, no border
- `consultation-form.tsx:6` — border **and** ring **and** shadow

`bg-white` and `bg-card` both resolve to `#FFFFFF` (`app/globals.css:68`, mapped to the utility at `:47`) and are used interchangeably.

`Resolution:` _pending_

---

## 2. Mobile interactivity

**MOB-01 — Lead capture is invisible on iPad Mini portrait** · S1 · **Confirmed** (one anchor corrected)

> **Business impact first.** On any viewport from **768px to 820px wide** — which includes **iPad Mini in portrait, exactly 768px** — the chiropractic offer builder renders with **no clarity panel and no Go High Level lead-capture form**. A prospect completes the offer builder and is shown nothing to submit. The lead is not captured, no error appears, and nothing is logged. This is silent revenue loss on a common device, and it would not appear in any desktop review.

Mechanism — three rules that are individually reasonable and collectively fatal:

1. `components/chiropractic-offer-builder.tsx:682` — desktop panel is `hidden flex-col gap-3.5 md:flex`. Tailwind `md:` = `min-width: 768px`, so it becomes visible at **≥768px**.
2. `app/globals.css:1244-1246` — inside `@media (max-width: 820px)` (block opens at `:1215`):
   ```css
   .offer-builder-status,
   .offer-builder-desktop-sidepanel {
     display: none !important;
   }
   ```
   This force-hides the desktop panel at **≤820px**, `!important`, unconditionally.
3. `components/chiropractic-offer-builder.tsx:697` — mobile panel is `md:hidden`, so it is hidden at **≥768px**.

Intersection: `768px ≤ width ≤ 820px` hides **both**. Both panels contain `OfferBuilderEmailPanel`, so both copies of the lead form vanish.

*Anchor correction:* the mobile panel is at **line 697**, not 695 (695 is a closing `</div>`). The desktop anchor 682 and the CSS anchors 1215/1244 are correct as cited.

This is the 768-vs-820 breakpoint disagreement from the central finding, made concrete.

`Resolution:` _pending_

---

**MOB-02 — Budget planner sliders have a 6px touch target** · S1 · **Confirmed**

> **Business impact first.** The two primary inputs of the Google Ads budget planner — the lead-gen tool — are 6 pixels tall. On a touch device they are extremely difficult to grab. Users who cannot operate the tool do not reach the email capture at the end of it.

`components/google-ads-budget-planner.tsx:302` and `:388` — both `<input type="range">` carry `className="h-1.5 w-full cursor-pointer accent-primary"`. `h-1.5` = **6px**. On WebKit the hit region is the element box; the native thumb overflows visually without extending the target. Against the 44×44px guideline this is 6px on the vertical axis.

`app/globals.css:973-975` sets `touch-action: manipulation` on these inputs — that addresses double-tap delay, not target size.

`Resolution:` _pending_

---

**MOB-03 — iOS Safari zooms the page on five form controls** · S2 · **Confirmed**

> **Business impact first.** Tapping the search box on `/blog`, or three of the offer builder's inputs, causes iOS Safari to zoom the viewport. The user must pinch back out to continue. On the offer builder this fires mid-form, on the highest-friction step — a measurable drop-off point on the lead path.

iOS Safari auto-zooms when a focused text-entry control computes below 16px. Confirmed prerequisites:

- **No viewport configuration exists anywhere** — no `export const viewport`, no viewport `<meta>` in `app/(frontend)/layout.tsx` or `app/(payload)/layout.tsx`. Grepping `viewport|maximum-scale|user-scalable` across `app/`, `components/`, `lib/`, `blocks/` returns only unrelated local variables in `about-process-diagram.tsx`.
  - *Good:* nothing disables pinch-zoom, so there is no WCAG 1.4.4 zoom-lock defect.
  - *Bad:* auto-zoom-on-focus is fully live.
- `app/globals.css` has no base `input, select, textarea` font-size rule, so each control's own class governs.

| File:line | Control | Size |
|---|---|---|
| `components/blog-roll.tsx:145` | article search `<input type="search">` | `text-sm` → **14px** |
| `components/blog-roll.tsx:122` | sort `<select>` | `text-sm` → **14px** |
| `components/chiropractic-offer-builder.tsx:411` | Step 1 audience `<select>` | `text-[15px]` → **15px** |
| `components/chiropractic-offer-builder.tsx:455` | Step 2 free-text `<input>` | `text-[15px]` → **15px** |
| `components/chiropractic-offer-builder.tsx:467` | Step 3 `<select>` | `text-[15px]` → **15px** |

Excluded deliberately: radio/checkbox inputs do not trigger zoom and are visually hidden here anyway; `type="range"` does not trigger zoom.

**Unverified adjacent exposure:** the Go High Level email forms render in a cross-origin `<iframe>` (`components/ghl-embed-form-slot.tsx:41`). Their input font sizes are not in this repository and could not be read. Plausible additional exposure on both tool CTAs; not claimed as a finding.

`Resolution:` _pending_

---

**MOB-04 — Touch targets below 44px on mobile-visible controls** · S2 · **Confirmed**

Sizes computed from class strings against Tailwind v4 defaults (verified unmodified — no `--text-*` overrides in `@theme inline`).

| File:line | Element | Size |
|---|---|---|
| `components/blog-sidebar.tsx:118` | tag filter pills | **28px** tall |
| `components/blog-roll.tsx:89`, `:100` | grid/list view toggles | **32×32px** |
| `components/blog-roll.tsx:183` | pagination buttons | **40×36px** |
| `components/blog-sidebar.tsx:40`, `:56` | category filters | **36px** tall (full-width) |
| `app/globals.css:1114-1125` | offer-builder chip labels (3 of 6 steps) | **39px** |
| `components/site-header.tsx:161` | `.site-mobile-nav-link` — primary mobile nav | **40px** |
| `components/chiropractic-offer-builder.tsx:780` | "Reset offer" | **42px** |
| `app/globals.css:947-964` | budget-planner pill labels | **43px** |

**Cleared — do not treat as defects.** These were checked specifically and pass: the mobile nav hamburger and close controls (`site-header.tsx:112`, `:139`) are `h-11 w-11` = **exactly 44×44px**; the mobile CTA is `min-h-[46px]`; the growth-funnel mobile tabs (`growth-system-funnel.tsx:127`) compute to **48px**.

**Latent, not live:** `components/ui/button.tsx:30-35` defines `xs` (32px), `icon` (40px), `icon-xs` (24px), `icon-sm` (32px) variants. Repo-wide there is exactly **one** call site using any small variant — `components/site-header.tsx:104`, inside a `hidden md:block` wrapper, so desktop-only. The `icon*` and `xs` variants are currently unused. Design-system defects, not live mobile defects.

`Resolution:` _pending_

---

**MOB-05 — Duplicate implementations coordinated by timers** · S3 · **Confirmed**

The structural finding from the central narrative, recorded for tracking: four breakpoint vocabularies (table above), two-to-three implementations per interactive feature, and **19** `setTimeout`/`setInterval` calls across 9 files (`components/about-process-diagram.tsx`, `chiropractic-offer-builder.tsx`, `google-ads-budget-planner.tsx`, `lib/budget-planner-layout-script.ts`, `metric-count-up-inline.ts`, `offer-builder-dom.ts`, `offer-builder-inline.ts`, `offer-builder-layout-script.ts`, `tech-logos-reveal-inline.ts`) standing in for data flow.

`Resolution:` _pending_

---

## 3. CMS and data integrity

**CMS-01 — Case studies display another client's data by default** · S1 · **Confirmed** (mechanism corrected)

> **Business impact first.** A case study post published without every client field filled in does not render blank fields — it renders **Tuscola's** name, location, practice type, services, engagement focus, market reach, **and performance metrics**. A new client's case study can display a different, real, named client's results as if they were their own. This is a factual-accuracy and client-confidentiality exposure before it is a code defect.

`lib/blog.ts:176-195`, `toCaseStudyPost`:

```ts
clientName: post.clientName || defaultTuscolaCaseStudy.clientName,          // :181
clientLocation: post.clientLocation || defaultTuscolaCaseStudy.clientLocation, // :182
// practiceInfo fields ?? defaultTuscolaCaseStudy.practiceInfo.*            // :185-190
metrics: post.metrics && post.metrics.length > 0 ? post.metrics : defaultTuscolaCaseStudyMetrics, // :192
```

Line 192 is the serious one: a case study with no metrics entered displays Tuscola's actual result numbers.

Three further paths return Tuscola wholesale: `lib/blog.ts:295` (no Payload client), `:315` (no case study found), `:318` (query threw). A database error on the featured-case-study query renders Tuscola's case study rather than failing visibly.

*Mechanism correction:* this was recorded pre-audit as a type-safety finding at `lib/blog.ts:39-59` with "the same exposure" as `Record<string, unknown>`. **That is wrong.** `lib/blog.ts:39-59` defines `PostDoc` as a fully typed interface with explicit named fields — the opposite of an untyped record. The only `Record<string, unknown>` there is `content` (`:47`), which is the Lexical rich-text blob and legitimately unstructured. The real mechanism is **per-field fallback to a hardcoded real client's data**, which is a worse problem than the one originally described and is not fixed by enabling type checking.

Note the interaction with CMS-05: on local SQLite the `client_name`/`client_location` columns do not exist, so these fields are always absent locally and every case study always shows Tuscola.

`Resolution:` _pending_

---

**CMS-02 — Seeding overwrites editor content on every cold start** · S1 · **Confirmed**

> **Business impact first.** Edits Matt or Pete make to four specific blog posts in the admin panel are silently reverted to hardcoded defaults. Not on save — later, whenever a serverless lambda cold-starts. The editor sees their change save successfully, then finds it gone with no error and no audit trail. Any editing effort on these posts is unreliable.

`lib/payload-config-base.ts:67` calls `seedBlogIfEmpty` inside `onInit`, which Payload runs on every cold start.

`lib/seed-blog.ts:390-404` — when posts already exist, it does not return early. It calls four `*IfMissing` seeders:

```ts
if (existingPosts.totalDocs > 0) {
  await seedCaseStudyIfMissing(payload)                      // :399
  await seedColdAdvertisingPostIfMissing(payload)            // :400
  await seedGoogleAdsBudgetPlannerPostIfMissing(payload)     // :401
  await seedChiropracticOfferBuilderPostIfMissing(payload)   // :402
  return
}
```

Despite the `IfMissing` naming, **all four** call `payload.update()` when the post already exists. Verified in each: `seedCaseStudyIfMissing` (`:101`, update at `:129`), `seedChiropracticOfferBuilderPostIfMissing` (`:204`, update at `:251`), `seedGoogleAdsBudgetPlannerPostIfMissing` (`:268`, update at `:315`), `seedColdAdvertisingPostIfMissing` (`:332`, update at `:359`).

The update payload is the full `postData` object including `content` (`lib/seed-blog.ts:236-248`, applied at `:251-255`). The name says "if missing"; the behaviour is "overwrite unconditionally."

`Resolution:` _pending_

---

**CMS-03 — Branding font pickers do nothing** · S2 · **Confirmed**

> **Business impact first.** The admin panel presents two required font dropdowns, each offering 21 fonts, each labelled with what it controls. Neither has any effect. Selecting a heading font and saving produces no visual change anywhere on the site. The CMS is advertising control it does not have.

`globals/Branding.ts:223-232` and `:234-243` define `headingFont` and `bodyFont` as `required: true` selects over `googleFontOptions` (**21** entries, `lib/google-fonts.ts:1-24`). The admin description at `:230` reads:

> `"Applied to all headings (h1–h6)."`

`lib/branding.ts:181-183` emits:

```ts
--font-heading: ${headingFontFamily};
--font-sans: ${bodyFontFamily};
--font-logo: ${logoFontFamily};
```

Those three are module-level constants imported at `lib/branding.ts:5-7` — not derived from the branding document. The mapper does resolve the CMS values at `:138-139` into the content object; nothing then consumes them. The generator's own comment at `:148` states the intent:

```ts
// Brand Guide v20 type roles — always use self-hosted Satoshi + next/font Manrope.
```

So the behaviour is deliberate. The defect is that the admin UI was left presenting required controls for a decision that has been hardcoded.

**This needs a decision from you, not a unilateral fix.** Removing two admin fields changes what a site owner can control. Either the fields should be wired up, or they should be removed — that is a product call.

`Resolution:` _pending_

---

**CMS-04 — Rebrand applies only partially** · S2 · **Confirmed**

> **Business impact first.** Changing brand colours in the CMS updates most of the site but leaves specific surfaces on the old palette — card and popover backgrounds, button hover and active states, muted backgrounds, and three blue accents. A rebrand through the admin panel produces a visually inconsistent site, and the remaining colours can only be changed in code.

`lib/branding.ts:147-185` emits 33 CSS custom properties. Eight are hardcoded literals rather than CMS values:

| Line | Token | Hardcoded value |
|---|---|---|
| `:154` | `--card` | `#FFFFFF` |
| `:156` | `--popover` | `#FFFFFF` |
| `:163` | `--button-hover` | `#1D4F8A` |
| `:164` | `--button-active` | `#163D6E` |
| `:169` | `--muted` | `#F3F4F6` |
| `:176` | `--ink` | `#0E1726` |
| `:177` | `--lake-pale` | `#EFF6FF` |
| `:178` | `--lake-light` | `#DBEAFE` |

All eight confirmed at the cited lines. `--button-hover` and `--button-active` are the notable ones: the button colour is CMS-controlled (`:161`) but its interaction states are not, so a rebrand yields a button that changes colour on hover to a shade unrelated to the new brand.

`Resolution:` _pending_

---

**CMS-05 — Local SQLite lacks columns that Postgres migrations created** · S2 · **Confirmed**

> **Business impact first.** This is a developer-environment defect, not a production one, but it blocks work: the local admin panel returns 500 errors on affected fields, so case-study content cannot be edited or tested locally.

Schema changes need two edits in this repo — a Postgres migration and hand-written SQLite DDL. `lib/ensure-case-study-highlight-globals-sqlite.ts:8`:

```ts
const globalTables = ["about", "services_page"] as const
```

`homepage` is absent. The columns ensured (`:10-14`) are `case_study_eyebrow`, `case_study_headline`, `case_study_featured_post_id`.

This is not a cosmetic gap — it is the direct cause of CMS-06, because `homepage` is precisely the argument passed first at `lib/payload-config-base.ts:68`.

`Resolution:` _pending_

---

**CMS-06 — An unguarded seed aborts the seed chain** · S2 · **Corrected**

`seedCaseStudyHighlightGlobal` (`lib/seed-case-study-highlight.ts:36-65`) is the only seed function with **no internal try/catch** — confirmed by reading the full function. It calls `payload.findGlobal` (`:40`) and `payload.updateGlobal` (`:57`) unguarded. On a local database missing the `homepage` case-study columns (CMS-05), `findGlobal` throws.

`lib/payload-config-base.ts:56-74` wraps the whole chain in one try/catch that logs and swallows (`:71-73`). So the throw is invisible: boot appears healthy, seeding is partial.

*Correction — the blast radius was overstated.* The pre-audit claim said this seed "is called first" and that "the remaining seeds never run." It is **not** called first. Reading `lib/payload-config-base.ts:61-70`, the order is:

```
:61 seedBrandingIfEmpty        :65 seedLegalIfEmpty
:62 seedHomepageIfEmpty        :66 seedNavigationIfEmpty
:63 seedAboutIfEmpty           :67 seedBlogIfEmpty
:64 seedServicesIfEmpty        :68 seedCaseStudyHighlightGlobal(payload, "homepage")
                               :69 seedCaseStudyHighlightGlobal(payload, "about")
                               :70 seedCaseStudyHighlightGlobal(payload, "services-page")
```

It runs **eighth of ten**. A throw at `:68` therefore skips only `:69` and `:70` — the `about` and `services-page` case-study highlights. Every other global is already seeded by that point. Real finding, materially smaller blast radius than recorded.

`Resolution:` _pending_

---

**CMS-07 — Testimonials silently truncated to one on save** · S3 · **Confirmed** (anchor corrected)

> **Business impact first.** An editor adding three testimonials to the homepage sees two of them deleted on save, with no warning, no admin-side row limit, and no message explaining why.

`globals/Homepage.ts:12`, inside `normalizeHomepageData`:

```ts
data.gsTestimonials = testimonials.slice(0, 1).map((item) => {
```

Wired as a `beforeValidate` hook at `globals/Homepage.ts:46-48` and `:54`, so it runs on every save. The field is `gsTestimonials`.

*Anchor correction:* the `slice(0, 1)` is at **line 12**, not 13.

`Resolution:` _pending_

---

**CMS-08 — On-demand revalidation omits two routes** · S3 · **Contested / partly Unverified**

The pre-audit claim was that `/blog/[slug]` and `/tools/google-ads-budget-planner` are never revalidated, so post edits stay stale. **The evidence does not support that conclusion, and I could not fully settle it without running the code.**

What is confirmed by reading `lib/revalidate-site.ts:4-11`: the explicit path list is `/` (layout), `/consultation`, `/about`, `/services`, `/blog`, `/blog` (page), `/privacy`, `/terms`. Neither `/blog/[slug]` nor `/tools/google-ads-budget-planner` is named. That part of the claim is accurate.

Three things contradict the stated impact:

1. **Line 4 is `revalidatePath("/", "layout")`** — Next.js's documented idiom for revalidating everything beneath the root layout. Both routes live under `app/(frontend)/`, i.e. beneath that layout, so they are very likely already covered.
2. **`/blog/[slug]` carries `export const revalidate = 60`** (`app/(frontend)/blog/[slug]/page.tsx:20`), so worst case is the site's designed 60-second ISR window — not indefinite staleness.
3. **`/tools/google-ads-budget-planner/page.tsx` imports no CMS data at all** — only `GoogleAdsBudgetPlanner`, `SiteHeader`, `SiteFooter`. Its only CMS-driven content is the header/footer supplied by the layout, which does carry `revalidate = 60` (`app/(frontend)/layout.tsx:63`).

**Why this stays Unverified:** the app has **two root layouts** (`app/(frontend)/layout.tsx` and `app/(payload)/layout.tsx`). Whether `revalidatePath("/", "layout")` resolves across route groups as expected in Next.js 16.2.6 is behaviour I cannot confirm without executing the app. I am not willing to assert either "this is broken" or "this is fine."

**Recommended treatment:** verify at runtime by editing a post and timing when `/blog/<slug>` reflects it. If the 60-second window is acceptable, there is no defect here at all. Adding the two paths explicitly is cheap insurance either way, but the recorded impact ("invisible for up to 60s") describes the designed ISR behaviour rather than a bug.

`Resolution:` _pending_

---

## 4. Code health

**CH-01 — The homepage mapper is untyped, defeating type checking where it matters most** · S2 · **Confirmed**

`lib/homepage-growth-system.ts:10`:

```ts
type HomepageDoc = Record<string, unknown>
```

The entire homepage CMS document is typed as an untyped record, and the file performs **46** `as` casts against it — count re-derived, matching the pre-audit figure exactly.

The consequence is specific and worth stating precisely: **renaming a CMS field still compiles.** The cast succeeds, the lookup yields `undefined`, `withFallback` (`:12`) substitutes the hardcoded default, and the site renders plausible-looking content that is no longer connected to the CMS. No error at build time, no error at runtime, no visible symptom.

This is why enabling `typescript.ignoreBuildErrors: false` would catch less than it appears to. The largest CMS surface in the codebase is opted out of type checking by its own type declaration. Any decision to turn type checking on should account for that.

`Resolution:` _pending_

---

**CH-02 — Mapper helpers duplicated 17 times across 8 files, already drifted** · S3 · **Corrected**

Four helpers are re-declared per file rather than shared. Actual count: **17 definitions across 8 files** (`lib/navigation.ts`, `homepage-growth-system.ts`, `about.ts`, `branding.ts`, `services.ts`, `case-study-highlight.ts`, `legal.ts`, `blog.ts`).

*Correction:* the pre-audit figure of 26 is too high; the file count of 8 is correct.

| Helper | Definitions |
|---|---|
| `withFallback` | 7 |
| `resolveMediaUrl` | 5 |
| `mergeArray` | 3 |
| `resolveMediaAlt` | 2 |

They have already drifted, which is the actual finding:

**`resolveMediaUrl`** — returns `string \| undefined` in `lib/about.ts:35`, `lib/services.ts:42`, `lib/homepage-growth-system.ts:23`; returns `string \| null` in `lib/blog.ts:61`, `lib/branding.ts:74`.

**`resolveMediaAlt`** — same split: `string \| null` in `lib/blog.ts:66`, `string \| undefined` in `lib/services.ts:47`. *This second drift was not in the pre-audit record and is newly identified here.*

Two sentinel values for "no image" now coexist across the mapper layer. Any consumer using `??` versus `||`, or a truthiness check, behaves differently depending on which file the value came from.

`Resolution:` _pending_

---

**CH-03 — 13 unreferenced files (691 lines) including an abandoned homepage** · S3 · **Corrected**

> Dead code is not a runtime risk. It is a correctness risk for *this* team specifically: AI agents reading the repository for context cannot distinguish an abandoned v0-era component from a live one, and will pattern-match against code that ships to nobody.

**Confirmed unreferenced — 13 files, 691 lines total** (verified by `wc -l`):

| File | Lines |
|---|---|
| `components/team-member-socials.tsx` | 98 |
| `components/who-we-help.tsx` | 79 |
| `components/story-section.tsx` | 74 |
| `components/why-choose.tsx` | 54 |
| `components/problem-section.tsx` | 48 |
| `components/home-blog-section.tsx` | 48 |
| `components/solution-section.tsx` | 44 |
| `components/how-it-works.tsx` | 41 |
| `components/hero.tsx` | 36 |
| `components/blog-breadcrumbs.tsx` | 34 |
| `lib/offer-builder-inline.ts` | 121 |
| `lib/site-navigation.ts` | 10 |
| `lib/homepage-defaults.ts` | 4 |

**Two corrections:**

1. **`lib/offer-builder-dom.ts` is NOT dead.** It was on the pre-audit list. It is imported at `components/chiropractic-offer-builder.tsx:24`:
   ```ts
   import { attachOfferBuilderFormListeners, offerInputId } from "@/lib/offer-builder-dom"
   ```
   That consumer is reachable: `components/blog-rich-text.tsx:12` → `app/(frontend)/blog/[slug]/page.tsx:7` and `components/case-study-post-page.tsx:6`. **This file must not be deleted.** (3 of its 6 exports are unused, but the file is live.)
2. **The line total is 691, not ~1,000** — a ~45% overstatement in the pre-audit record.

The count of 13 was right; the membership was wrong by one substitution.

**Abandoned homepage — substantiated.** `app/(frontend)/page.tsx` imports only `SiteHeader`, `HomepageGrowthSystem`, `SiteFooter`. The eight orphaned section components compose a complete alternate homepage that nothing renders. *Caveat: "v0-era" is inferred from content, not provable from git dates — history in this worktree is shallow and most of these files' last-touch commit is the same 2026-08-05 commit.*

**String-path references checked.** The `fields/imagePosition.ts:34` pattern (components referenced by string, invisible to import search) was searched for explicitly. Repo-wide there are exactly two such hits, both for `ImagePositionField` (`fields/imagePosition.ts:34` and its generated counterpart `app/(payload)/admin/importMap.js:66`). **No file in the dead set is string-path referenced.** `ImagePositionField` is live and must not be removed.

`Resolution:` _pending_

---

**CH-04 — 81 exported symbols are never imported** · S3 · **Corrected**

**81 of 279 exports (29%)** in `lib/` and `components/` are never imported. The pre-audit figure of 39 is a substantial undercount.

*Method, for reproducibility:* collect declared export names across 129 `lib/`+`components/` files (line-anchored `export …` declarations plus `export { … }` blocks, resolving `X as Y`); parse every import/re-export across `app/`, `blocks/`, `collections/`, `components/`, `fields/`, `globals/`, `lib/`, `scripts/` and the four root configs, normalising `@/` and relative specifiers; a symbol is dead iff no module key resolving to its file binds that name or namespace-imports it.

Two traps materially change the number, which is why simpler methods disagree:

- A whole-word identifier grep yields 73 and wrongly marks `components/hero.tsx:14 Hero` live — "Hero" appears as a CMS **label string** in `fields/homepageGrowthSystem.ts`, `globals/About.ts`, `globals/Services.ts`.
- A single-line import regex yields 119, wrongly killing `lib/image-position.ts`, `lib/budget-planner.ts`, `lib/offer-builder.ts` — this codebase formats imports across multiple lines (e.g. `fields/imagePosition.ts:3-6`).

Largest clusters: `lib/lexical-helpers.ts` (10), `lib/homepage-template.ts` (8 exported types), `lib/offer-builder*.ts` (11 across four files), `lib/seed-blog.ts` (4 — note `seedCaseStudyIfMissing` is called internally at `:399`/`:450`, so it is a dead *export*, not dead code).

**Worth separate attention:** all 3 exports of `lib/db-url.ts` are dead, because `scripts/vercel-build.mjs:12,35` and `scripts/migrate-production.mjs:8` **redefine `isPostgresUrl`/`getPostgresMigrationUrl` locally** instead of importing them. That is duplicated Postgres-detection logic on the deploy path — the same class of drift as CH-02, in the build pipeline.

*Caveat that must survive into any remediation:* "dead export" means no other module imports the name. Several are used within their own file, so the correct action is dropping the `export` keyword, not deleting the code.

`Resolution:` _pending_

---

## 5. Security

**SEC-01 — `PAYLOAD_SECRET` defaults to the empty string** · S1 · **Confirmed**

> **Business impact first.** If `PAYLOAD_SECRET` is ever unset in a deployed environment, the site signs admin session tokens with the empty string — a value anyone can guess. Admin sessions become forgeable, which means full CMS access. The build does not stop; it warns and deploys.

`lib/payload-config-base.ts:49`:

```ts
secret: process.env.PAYLOAD_SECRET || "",
```

The `|| ""` converts a missing-configuration error into a silently weak secret. Payload would refuse to start on `undefined`; the empty string is accepted.

The deploy pipeline does not gate on it. `scripts/vercel-build.mjs:92-105`:

```js
if (env.PAYLOAD_SECRET && postgresUrl) {
  run("Running database migrations", …)                                        // :94
} else {
  console.warn("[build] Skipping migrations — missing PAYLOAD_SECRET or …")     // :96
  if (!env.PAYLOAD_SECRET?.trim()) console.warn("[build]   Missing: PAYLOAD_SECRET")  // :98
  …
}
run("Running Next.js build", "node ./node_modules/next/dist/bin/next build --webpack")  // :105
```

There is **no `process.exit`** anywhere in the file — verified. The build warns, proceeds to `:105`, and exits zero. See BD-03 for the deploy-pipeline consequence.

Anchors `:98` and `:105` both confirmed as cited.

`Resolution:` _pending_

---

**SEC-02 — Flat authorization model** · **ACCEPTED RISK — reported for awareness, no action recommended**

`collections/Users.ts` is 10 lines in full:

```ts
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  fields: [],
}
```

There is no `access` block and no role field. Payload's default is therefore in effect: **any authenticated user can create, edit, and delete other users, including new admins.** There are no privilege tiers — every account is fully privileged.

**Blast radius, stated plainly:** one compromised account is equivalent to total CMS compromise. There is no read-only tier, no way to grant a contractor limited access, and no audit distinction between accounts. Combined with SEC-01, an unset `PAYLOAD_SECRET` and a forged session would grant full administrative control.

**This is a defensible choice and we are not recommending you change it.** For a two-owner marketing site where both owners are administrators, role-based access control adds real complexity for little benefit. Introducing roles is a product decision about how you intend to grow the team — not something an audit resolves unilaterally. These are the facts and the consequence; the decision is yours.

`Resolution:` _n/a — accepted risk_

---

## 6. Build and deploy

**BD-01 — Two undeclared dependencies resolving transitively by accident** · S1 · **Confirmed** (counts corrected)

> **Business impact first.** This is the highest-probability near-term breakage in the repository. Both packages currently resolve because something else happens to install them. Any dependency bump, lockfile regeneration, or `pnpm install` on a clean machine can remove them — at which point local development stops booting. Nothing warns first.

Neither `tsx` nor `@libsql/client` appears anywhere in `package.json` — verified.

**`@libsql/client` — 9 consumers**, including **all 7** `lib/ensure-*-sqlite.ts` modules, which are exactly the local-dev boot path:

```
lib/ensure-about-global-sqlite.ts          lib/ensure-navigation-global-sqlite.ts
lib/ensure-case-study-highlight-globals-sqlite.ts   lib/ensure-posts-case-study-sqlite.ts
lib/ensure-homepage-growth-system-sqlite.ts lib/ensure-services-global-sqlite.ts
lib/ensure-legal-global-sqlite.ts
```

Plus `next.config.ts:16-17` (which lists `@libsql/client` and `libsql` in `serverExternalPackages`) and `scripts/migrate-why-choose-cards-sqlite.mjs`.

**`tsx` — 12 scripts** import `tsImport` from `tsx/esm/api`: `diagnose-production`, `migrate-navigation-global-sqlite`, `migrate-homepage-growth-system-sqlite`, `migrate-services-global-sqlite`, `reset-local-admin`, `migrate-testimonial-photo-sqlite`, `reset-production-admin`, `seed-blog`, `seed-blog-production`, `seed-about`, `setup-navigation-global`, `setup-services-global`.

*Corrections:* **12** scripts use `tsx`, not 10. `@libsql/client` has **9** consumers, not 7 — the "all 7 `lib/ensure-*-sqlite.ts` modules" part of the claim is exactly right, and there are two additional consumers beyond them.

`Resolution:` _pending_

---

**BD-02 — Dual lockfiles, no package-manager constraint** · S2 · **Confirmed**

> **Business impact first.** Two people running `install` in the same repository can get different dependency trees. A build that works on one machine can fail on another with no code difference, and the failure appears unrelated to any recent change.

Both lockfiles are committed and tracked:

- `package-lock.json` (425 KB) — last touched in commit `b09d3de`
- `pnpm-lock.yaml` (278 KB) — last touched in a **different** commit, `cab7c6c`

They are maintained on divergent commits, so they have drifted.

`package.json` has **no `packageManager` field** and **no `engines` constraint** — verified by reading the file in full. Nothing declares that pnpm is the intended tool or pins a Node version. npm reads `package-lock.json`; pnpm reads `pnpm-lock.yaml`; each silently prefers its own. `CLAUDE.md` documents pnpm as correct and `package-lock.json` as stale, but that is documentation, not enforcement — and it is a local file, invisible to CI and to v0.app.

`Resolution:` _pending_

---

**BD-03 — A misconfigured deploy goes green and 500s at runtime** · S1 · **Confirmed**

> **Business impact first.** If `PAYLOAD_SECRET` or the Postgres URL is missing from the Vercel environment, the deployment **succeeds**. Vercel shows green. The site then either 500s at runtime or serves against an unmigrated schema. The failure signal is a warning buried in build logs that nobody reads when the deploy is green. Per `CLAUDE.md`, this is already the usual cause of a deploy that builds but 500s — so this is an observed failure mode, not a hypothetical one.

`scripts/vercel-build.mjs:92-105`, quoted in SEC-01. The control flow:

1. `:92` — migrations run **only** if both `PAYLOAD_SECRET` and a Postgres URL are present.
2. `:96-101` — otherwise `console.warn` three times. Warnings only.
3. `:105` — `next build` runs unconditionally, on the same path.
4. No `process.exit` anywhere in the file. Exit code 0.

The environment diagnostic table (`logEnvDiagnostics()`, called at `:90`) improves visibility but changes nothing about the outcome.

**Compounding factor:** `.env` variables must be set on **both** Vercel Production **and** Preview, because PR builds use Preview env. A Preview environment missing them produces a green PR build that 500s — the exact signal a reviewer would trust.

The design intent is reasonable (don't block a build on a missing optional service). The mismatch is that these are not optional: without them the deployed site does not work.

`Resolution:` _pending_

---

## Noted as future risk — not recommended for action

Recorded because omitting them would be dishonest, not because we are proposing work:

- **`--webpack` is required; turbopack breaks `sharp` and Payload here.** Documented in git history. `package.json` pins `--webpack` in `dev`, `build`, and the Vercel build. This is a real constraint that will eventually need revisiting as turbopack becomes the default. Not now.
- **Twelve Payload packages pinned lockstep at 3.85.1**, reinforced by both `overrides` and `pnpm.overrides` in `package.json`. This is correct practice for Payload, and it means upgrades are all-or-nothing. A separate project when it happens.

## Explicitly out of scope

Not recommended, and not to be read as oversights: visual redesign; new features or content changes; changing the v0.app workflow (v0 retains direct push access to `main` — the owners' call); role-based access control (SEC-02, reported not implemented); migrating off `--webpack`; Payload version upgrades.

---

## Finding index

| ID | Finding | Sev | Verification | Resolution |
|---|---|---|---|---|
| DS-01 | Authored design tokens have zero adoption | S3 | Corrected | _pending_ |
| DS-02 | 730 arbitrary values stand in for a token scale | S3 | Confirmed | _pending_ |
| DS-03 | One eyebrow element, 24+ implementations | S3 | Confirmed | _pending_ |
| DS-04 | No card component; 31 variants | S3 | Confirmed | _pending_ |
| MOB-01 | Lead capture invisible on iPad Mini portrait | S1 | Confirmed | _pending_ |
| MOB-02 | Budget planner sliders 6px tall | S1 | Confirmed | _pending_ |
| MOB-03 | iOS Safari zooms on five form controls | S2 | Confirmed | _pending_ |
| MOB-04 | Touch targets below 44px | S2 | Confirmed | _pending_ |
| MOB-05 | Duplicate implementations, timer-coordinated | S3 | Confirmed | _pending_ |
| CMS-01 | Case studies display another client's data | S1 | Confirmed | _pending_ |
| CMS-02 | Seeding overwrites editor content | S1 | Confirmed | _pending_ |
| CMS-03 | Branding font pickers do nothing | S2 | Confirmed | _pending_ |
| CMS-04 | Rebrand applies only partially | S2 | Confirmed | _pending_ |
| CMS-05 | Local SQLite lacks migrated columns | S2 | Confirmed | _pending_ |
| CMS-06 | Unguarded seed aborts the seed chain | S2 | Corrected | _pending_ |
| CMS-07 | Testimonials truncated to one on save | S3 | Confirmed | _pending_ |
| CMS-08 | On-demand revalidation omits two routes | S3 | Contested / Unverified | _pending_ |
| CH-01 | Homepage mapper untyped; 46 casts | S2 | Confirmed | _pending_ |
| CH-02 | Mapper helpers duplicated 17×, drifted | S3 | Corrected | _pending_ |
| CH-03 | 13 unreferenced files, 691 lines | S3 | Corrected | _pending_ |
| CH-04 | 81 exports never imported | S3 | Corrected | _pending_ |
| SEC-01 | `PAYLOAD_SECRET` defaults to empty string | S1 | Confirmed | _pending_ |
| SEC-02 | Flat authorization model | — | Confirmed | _accepted risk_ |
| BD-01 | Two undeclared dependencies | S1 | Confirmed | _pending_ |
| BD-02 | Dual lockfiles, no constraint | S2 | Confirmed | _pending_ |
| BD-03 | Misconfigured deploy goes green, 500s | S1 | Confirmed | _pending_ |

### Corrections to the pre-audit record

Seven claims did not survive re-verification unchanged. Recorded so the correction is not lost:

| Claim | Correction |
|---|---|
| `lib/offer-builder-dom.ts` is dead | **Live** — imported at `chiropractic-offer-builder.tsx:24`. Must not be deleted. |
| Dead files total ~1,000 lines | **691 lines** across 13 files. |
| 39 dead exports | **81** of 279 (29%). |
| `seedCaseStudyHighlightGlobal` is called first | Called **eighth of ten** (`payload-config-base.ts:68`); only 2 later seeds are skipped. |
| `lib/blog.ts:39-59` is a `Record<string, unknown>` type hole | **Fully typed `PostDoc`.** Real mechanism is per-field fallback to a real client's data (`:181-192`) — worse, and not fixed by type checking. |
| 10 radius tokens used zero times | **5 of 10** unused — precisely the purpose-named ones. |
| 26 duplicated mapper helpers | **17** across 8 files; `resolveMediaAlt` drift newly identified. |

Minor anchor corrections: MOB-01 mobile panel is `chiropractic-offer-builder.tsx:697` (not 695); CMS-07 slice is `globals/Homepage.ts:12` (not 13). Minor count corrections: `tsx` used by **12** scripts (not 10); `@libsql/client` has **9** consumers (not 7); arbitrary bracket values span **54** files (not 45); arbitrary font sizes are **101 across 15** distinct values (not 100/14).

### Verification boundary

Everything above was established by reading source in an isolated checkout with no `node_modules`. Nothing was built, type-checked, linted, or executed — this repository has no test suite, no installed linter, and type checking disabled. No claim in this report should be read as asserting that any of those pass.

One finding (CMS-08) could not be settled without running the application and is labelled accordingly. One adjacent exposure (third-party Go High Level iframe form inputs, MOB-03) lives outside this repository and could not be read.

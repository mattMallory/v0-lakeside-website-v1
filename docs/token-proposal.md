# Lakeside token proposal

> **Reviewing this? Start with [`token-decisions.md`](./token-decisions.md) instead.**
>
> That document leads with the 9 questions and 5 approvals actually needed from you, and
> takes about ten minutes. This one is the full evidence base behind it — 68 tokens and 692
> catalogued values — and is here to be checked against, not read front to back.

**What this is.** An inventory of every styling value the live site actually uses, grouped
into the token set those values are trying to be. It was mined out of the built code, not
designed on a blank page — so everything here is a description of what ships today, and a
proposal for what to name it.

**What it is for.** To be marked up. Nothing here is decided. Sections marked
**`DECISION`** are explicitly yours; the rest is a recommendation you can overrule.

**How to read it.** Every proposal carries a count — how many places in the site use that
value today. The counts are the argument. A value used 25 times is load-bearing; a value
used once is probably an accident, and the difference is the only reliable way to tell
which of these choices matter. File names appear as evidence, not as the point.

**One caveat worth stating up front.** Collapsing two near-identical values into one token
is, by definition, a visual change — something moves by a pixel. This document separates
those two cases everywhere:

- **Free** — the value is *already exactly equal* to a token that exists. Adopting it
  changes nothing on screen. There are **176** of these.
- **Costs a pixel** — near-identical values merge. Something shifts slightly. Marked
  **`⚠ moves`** throughout, with the size of the move stated.

---

## 1. The short version

| | In use today | Distinct values | Proposed tokens |
|---|---|---|---|
| **Colour** | 161 hardcoded classes + 185 raw hex + 56 in stylesheet | 53 | 41 exist · **16 new** |
| **Type size** | 305 declarations | **38** | **9** + 4 fluid display |
| **Letter-spacing** | 107 | 12 | **4** |
| **Line-height** | 28 | 11 | **4** |
| **Spacing** | 61 arbitrary (+ Tailwind scale) | 35 | **9** |
| **Radius** | 147 | **14 effective** | **7** |
| **Shadow** | 14 | 11 | **3** |
| **Icon size** | 28 | 8 | **5** |
| **Content width** | 39 | 14 | **4** |
| **Layout minimum** | 20 | 12 | **3** |
| **Z-index / border width** | 12 | 6 | **4** |
| **Breakpoint** | — | — | **5** (already agreed) |

**The headline: there is no type scale and no spacing scale at all.** Those are the two
categories being created from nothing. Everything else already half-exists.

Roughly **68 tokens** in total, of which **41 already exist and simply need adopting.**

---

## 2. The finding that frames the rest

**Part of this design system already exists. It was simply never used.**

The stylesheet defines **ten radius tokens**. Five of them are the hand-authored,
purpose-named ones — `pill`, `sq`, `card`, and two large sizes. **All five are used zero
times.** The five that *are* used are Tailwind's built-in names, which would work whether
the token block existed or not.

Meanwhile each unused token has a hardcoded twin in heavy use:

| Token defined | Its value | What the site writes instead | Times |
|---|---|---|---|
| `radius-pill` | 999px | `rounded-full` | **35** |
| `radius-sq` | 10px | `rounded-[10px]` | **16** |
| `radius-card` | 12px | `rounded-[12px]` | **8** |

The same pattern holds for colour, and larger. **117 hardcoded colours in the codebase are
byte-for-byte identical to a colour token the CMS already controls** — 75 in components,
42 in the stylesheet. They were typed as hex instead of referenced as tokens.

This has a live consequence. Those 117 values **do not respond to the brand controls in the
admin panel.** Change the brand blue there and the tokens move; these 117 stay exactly
where they are. It is the mechanism behind "the site doesn't fully rebrand."

**So the primary recommendation is adoption, not authorship.** Roughly two-thirds of the
work below is pointing existing values at existing names.

---

## 3. Colour

### 3.1 What already exists

**41 colour tokens**, all driven by the admin panel: background, foreground, heading, card,
popover, primary, button (+hover/active), secondary button, icon, secondary, muted, accent,
border, input, ring, ink, two lake tints, 5 chart colours, 8 sidebar colours.

One exception worth knowing: **`destructive` is the only colour token the CMS does not
drive.** It is a leftover default in a different colour system (`oklch`) and is unrelated to
the Lakeside palette. It is also never used in any component.

### 3.2 Free adoptions — 117 occurrences, zero visual change

These hardcoded colours are *identical* to a token that already exists. Pointing them at the
token changes nothing on screen and makes them respond to branding.

| Colour | Times | Already exists as |
|---|---|---|
| `#EFF6FF` | 21 | `secondary` / `lake-pale` |
| `#7CB0E8` | 19 | `chart-3` |
| `#F9F7F4` | 13 | `background` |
| `#0E1726` | 13 | `ink` |
| `#FFFFFF` | 14 | `card` / `popover` |
| `#374151` | 10 | `secondary-button-foreground` |
| `#D5D7DB` | 8 | `secondary-button` |
| `#6B7280` | 5 | `muted-foreground` |
| `#2563A8` | 3 | `primary` |
| `#DBEAFE` | 3 | `accent` / `lake-light` |
| `#F3F4F6` | 4 | `muted` |
| `#1D4F8A` | 3 | `button-hover` |
| `#111827` | 1 | `foreground` / `heading` |

**The sharpest single instance:** the colour `#7CB0E8` is written as a literal **five separate
times** in the stylesheet, under five differently-named rules, while the identical value sits
unused as the `chart-3` token a few hundred lines above it. It is written a further 14 times
across components. **19 hand-typed copies of one colour that already has a name.**

Two further near-whites — `#F9FAFB` and `#FAFBFC`, one use each — are within a hair of the
existing `card` white and the page `background`. Recommend folding both into those tokens
rather than naming them. ⚠ moves, imperceptibly.

### 3.3 New tokens needed — the gaps

Four families genuinely have no token and must be created.

**A · Dark section surfaces — 3 new tokens, 28 occurrences**

The site has dark bands (hero, funnel, results panels). There are no tokens for them, so
every dark section hardcodes its own.

| Proposed | Value | Replaces | Times |
|---|---|---|---|
| `surface-dark` | `#0B1220` | section/hero backgrounds | 5 |
| `surface-dark-raised` | `#111B2E` | cards sitting on dark | 4 |
| `border-on-dark` | `#1F2E45` | `#1F2E45` ×5, `#1E293B` ×1 ⚠ moves | 6 |
| *(deepest panel)* | — | use existing `ink` | 13 |

**B · Text on dark — 2 new tokens, 26 occurrences**

This is the clearest structural gap in the palette. There is a `muted-foreground` token for
muted text on light backgrounds, and **no equivalent for dark backgrounds** — so every dark
section invents one. Five different greys are in use for the same job.

The code says this out loud in two places: a single expression reads
*"if dark, use `#B9C2CF`; otherwise use the muted-foreground token."* The light branch has a
token. The dark branch has a hex.

| Proposed | Value | Replaces | Times |
|---|---|---|---|
| `foreground-on-dark` | `#B9C2CF` | `#B9C2CF` ×7, `#B8BBC2` ×2, `#E2E8F0` ×1 ⚠ moves | 10 |
| `muted-foreground-on-dark` | `#94A3B8` | `#94A3B8` ×13, `#64748B` ×8 ⚠ moves | 21 |

**`DECISION`** — those five greys span a visible range. Collapsing them to two is my
recommendation, but whether it's two or three levels is a call about how much tonal
separation you want inside dark panels.

**C · A second muted grey on light — 1 new token, 26 occurrences**

`#9CA3AF` is **the single most-used hardcoded colour in the entire codebase (25 uses in
components, 3 in the stylesheet)** and it has no token. It is a lighter grey than the
existing `muted-foreground` (`#6B7280`). So there are two levels of muted text on light, and
only one is named.

| Proposed | Value | Replaces | Times |
|---|---|---|---|
| `muted-foreground-subtle` | `#9CA3AF` | `#9CA3AF` ×28, `#4B5563` ×1 ⚠ moves | 29 |

**D · Status colours — 10 new tokens, ~19 occurrences**

Success, warning and danger states exist in the offer builder, budget planner and patient
journey. **None has a token.** Each is a text colour, a surface tint and a border.

| Proposed | Text | Surface | Border | Times |
|---|---|---|---|---|
| `success-*` | `#15803D` | `#F0FDF4` | `#86EFAC` | 5 |
| `warning-*` | `#B45309` | `#FDEBCB` | `#F6D79E` | 4 |
| `danger-*` | `#B45353` / `#7F1D1D` | `#FEF7F7` | `#F3D0D0` | 6 |
| `info-*` | — | `#EFF6FF` *(exists)* | `#BFDBFE` | 4 |

**`DECISION`** — danger currently uses three different reds (`#F87171`, `#B45353`,
`#7F1D1D`) for text in different components. One needs to win. ⚠ moves.

### 3.4 `DECISION` — the CTA blue is not the brand blue

The site's two largest conversion panels — the main call-to-action block and the homepage
audit block — are filled with **`#3761A2`**.

The brand primary is **`#2563A8`**.

These are different blues. The most prominent commercial element on the site is not painted
in the brand colour, and because it is hardcoded it will not follow the admin panel either.

Used 4 times, with a paired text colour `#DCE8F6` used twice.

Three options, and this is a brand call rather than a technical one:

1. It is drift → point it at `primary`, and the CTA becomes brand blue. ⚠ moves.
2. It is intentional → give it a real name (`cta` / `brand-blue-alt`) and add it to the
   admin panel so it is controllable.
3. It is neither → pick a third value deliberately.

---

## 4. Typography

**There is no type scale.** The site uses **38 distinct font sizes** across 305 declarations.

### 4.1 The sizes in use

Fixed sizes, in a near-continuous ramp — note the half-pixels, which are the signature of
hand-nudging rather than a system:

`10 · 11 · 12 · 13 · 13.5 · 14 · 14.5 · 15 · 16 · 17 · 18 · 19 · 20 · 22 · 24 · 26 · 28 · 37.6 · 40 · 44` px

### 4.2 Proposed scale — 9 steps

| Step | Size | Collapses | Times | Note |
|---|---|---|---|---|
| `text-eyebrow` | 11px | 10, 11 | 25 | ⚠ moves (1px, 3 sites) |
| `text-xs` | 12px | 12 | 27 | free |
| `text-sm` | 13px | 13, 13.5 | 21 | ⚠ moves (0.5px, 5 sites) |
| `text-base` | 15px | 14, 14.5, 15 | 106 | ⚠ moves (1px, 81 sites) |
| `text-md` | 17px | 16, 17 | 23 | ⚠ moves (1px, 18 sites) |
| `text-lg` | 19px | 18, 19 | 31 | ⚠ moves (1px, 25 sites) |
| `text-xl` | 22px | 20, 22 | 7 | ⚠ moves |
| `text-2xl` | 26px | 24, 26, 28 | 8 | ⚠ moves |
| `text-3xl` | 40px | 37.6, 40, 44 | 4 | ⚠ moves |

**`DECISION`** — the `text-base` row is the big one: **106 places**, and merging 14px into
15px nudges body text up a pixel across most of the site. It is the single largest visual
consequence in this document. The alternative is keeping 14 and 15 as separate steps, which
preserves today's rendering exactly but keeps a distinction nobody can see.

### 4.3 Fluid display sizes

Large headings scale with the viewport. There are **13 distinct fluid expressions** for what
is essentially four jobs. **Four of them start at the same size and differ only in how fast
they grow** — that is 12 occurrences of one heading style written four ways.

| Proposed | Range | Collapses | Times |
|---|---|---|---|
| `display-sm` | 19→24px | 1 expression | 1 |
| `display-md` | 24→30px | 2 expressions | 2 |
| `display-lg` | **28→42px** | **4 expressions** ⚠ moves | **12** |
| `display-xl` | 32→58px | 4 expressions ⚠ moves | 4 |

### 4.4 Letter-spacing — 12 values → 4

**Negative (headings), 59 uses, 5 values:** `-0.03 · -0.026 · -0.02 · -0.015 · -0.01em`.
They span 0.02em — visually indistinguishable at most sizes.

Critically, **the stylesheet already applies `-0.026em` to every heading globally.** So
`tracking-[-0.026em]`, written 12 separate times, is re-declaring a value the element
already has. **11 of those 12 are free to remove — zero visual change.**

The twelfth is the exception that proves the rule: it sits on a *paragraph* styled to look
like a title, so it does not inherit the heading rule and genuinely needs the value. Worth
noticing on its own terms — a title that is not a heading element is a small accessibility
and structure question, separate from tokens.

**Positive (eyebrows), 48 uses, 7 values:** `0.02 · 0.05 · 0.06 · 0.08 · 0.1 · 0.12 · 0.14em`.
`0.1em` accounts for 26 of the 48.

| Proposed | Value | Collapses | Times |
|---|---|---|---|
| `tracking-display` | `-0.03em` | -0.03, -0.02, -0.015 ⚠ moves | 39 |
| `tracking-heading` | `-0.026em` | *already global* — 12 removals | 12 free |
| `tracking-tight` | `-0.01em` | -0.01 | 8 |
| `tracking-eyebrow` | `0.1em` | all 7 positive values ⚠ moves | 48 |

### 4.5 Line-height — 11 values → 4

Seven values between `1.02` and `1.15` are all doing the same job (tight display headings);
four more sit between `1.28` and `1.72` for body copy.

| Proposed | Value | Collapses | Times |
|---|---|---|---|
| `leading-display` | 1.05 | 1.02–1.15 (7 values) ⚠ moves | 20 |
| `leading-snug` | 1.28 | 1.28 | 1 |
| `leading-body` | 1.55 | 1.45, 1.55 ⚠ moves | 6 |
| `leading-relaxed` | 1.72 | 1.72 *(the site's body default)* | 1 |

### 4.6 `DECISION` — weight, and a font that may not have the weight

Four weights are in use: **bold ×94, semibold ×73, medium ×24, normal ×1.**

The display face (Satoshi) is loaded at weights **400, 500 and 700 only — there is no 600.**
But **36 elements ask for semibold (600) in the display face.** The browser resolves that by
substituting or synthesising, which is not a decision anyone made.

Two ways out: load a real 600 weight, or standardise display text on 700/500. Either is
fine; the current state is neither.

**Also worth knowing:** a third font (Space Grotesk) is downloaded on every page load for a
logo wordmark token that **nothing uses**. Either the wordmark is meant to exist and was
lost, or the font can be dropped.

---

## 5. Spacing

**There is no spacing scale.** 61 hand-written values across 35 spellings, on top of
Tailwind's default 4px-based scale used everywhere else.

**The most interesting pattern:** the five most common custom paddings are
**18 · 22 · 26 · 30 · 34px** — which are *exactly 2px above* Tailwind's 16 · 20 · 24 · 28 · 32.
Someone nudged every step by 2px, by hand, one file at a time.

**`DECISION`** — this is either a deliberate optical preference (in which case it should be
the scale, defined once) or accumulated drift (in which case it should snap back to the
4px grid). Both are defensible. It cannot stay as-is, because right now it is both.

| Proposed | Value | Collapses | Times |
|---|---|---|---|
| `space-2xs` | 6px | 5, 7 ⚠ moves | 3 |
| `space-xs` | 11px | 11 | 2 |
| `space-sm` | 15px | 15 | 2 |
| `space-md` | 18px | 18 | 11 |
| `space-lg` | 22px | 22 | 8 |
| `space-xl` | 26px | 26 | 6 |
| `space-2xl` | 30px | 30, 34 ⚠ moves | 4 |
| `space-band` | 50px | 50 | 3 |
| `space-section` | 88px | 88, 84, 80, 70 ⚠ moves | 12 |

Section rhythm (the vertical gap between major bands) is currently **88 · 84 · 80 · 70 · 50px**
— five values for one job. The two smallest paddings (5px and 7px, on pills and badges) are
1–2px apart and merge without anyone noticing.

Four fluid paddings (`clamp`) are used for card interiors and are **genuinely responsive —
recommended to keep**, though the four expressions could become two.

---

## 6. Radius

**14 effective values between 7px and 22px**, which is more radii than the site has
components. Two pairs are visually identical but structurally different:

- **16px vs 16.8px** — 0.8px apart, 16 places
- **20px vs 21.6px** — 1.6px apart, 21 places

Nobody can see those differences. They exist because one was typed by hand and the other
came from the token scale.

| Proposed | Value | Collapses | Times | Note |
|---|---|---|---|---|
| `radius-xs` | 8px | 7, 7.2, 8, 9, 9.6 ⚠ moves | 23 | |
| `radius-sq` | **10px** | 10, 11 ⚠ moves | 23 | **token exists, unused** |
| `radius-card` | **12px** | 12 | 11 | **token exists, unused** |
| `radius-lg` | 14px | 14 | 12 | new — the dominant card radius |
| `radius-xl` | 17px | 16, 16.8, 18 ⚠ moves | 17 | |
| `radius-2xl` | 21px | 20, 21.6 ⚠ moves | 23 | |
| `radius-pill` | **999px** | `rounded-full` | 35 | **token exists, unused** |

Two square-cornered elements (`rounded-none`, and a 4px default) sit outside the scale and
are left as they are. The ramp above accounts for all **147** radius declarations.

**`DECISION` — what radius is a card?** Today, three answers ship simultaneously: **12px**
(the `radius-card` token, unused), **14px** (12 uses, the most common), and **21.6px**
(13 uses, the largest cluster). One card component with one radius is the goal; which
number wins is yours.

The strongest single illustration: **one 68-line component uses three different radii** — a
12px image frame in grid layout, 10px in list layout, and a 14px wrapper around both. Three
radii, one card, one file.

---

## 7. Shadows

**Every shadow in the codebase is unique.** 8 hand-written shadows, 8 distinct values, plus
4 uses of a built-in `shadow-sm`, one `shadow-xl`, and one in the stylesheet.

There is no shadow token of any kind.

Worse, **three of the eight bake the brand blue into the shadow colour as a raw value** —
which is a second reason those elements ignore the brand controls.

| Proposed | Role | Collapses | Times |
|---|---|---|---|
| `shadow-sm` | hairline lift — resting cards | 4 built-in + 3 custom ⚠ moves | 7 |
| `shadow-md` | hover / raised | 3 custom ⚠ moves | 3 |
| `shadow-lg` | floating panel, dark overlay | 2 custom ⚠ moves | 2 |

**Elevation is currently expressed five incompatible ways** on the same kind of element:
plain border (38 cards), shadow only (1), ring only (1), border + shadow (5), and one card
that stacks **border + ring + shadow simultaneously** — producing a doubled hairline that is
almost certainly unintended.

---

## 8. Sizing — three scales nobody noticed

### 8.1 Icons — 28 places, 8 sizes, no token

`9 · 15 · 19 · 22 · 26 · 30 · 46 · 76px`.

| Proposed | Value | Times |
|---|---|---|
| `icon-xs` | 15px | 3 |
| `icon-sm` | 19px | 2 |
| `icon-md` | 22px | 12 |
| `icon-lg` | 30px | 6 |
| `icon-xl` | 46px | 4 |

⚠ moves — 26px folds into 22px or 30px; 9px (a connector tick, 2 uses) and 76px (an avatar,
1 use) are one-offs (§10).

### 8.2 Content widths — 39 places, 14 values

Beyond the page container (§11, decision 1), text and panel widths are set by hand. They
cluster into three obvious jobs, but each cluster has four to six spellings.

| Proposed | Value | Collapses | Times |
|---|---|---|---|
| `width-prose` | 640px | 600, 620, 640 ⚠ moves | 12 |
| `width-prose-wide` | 760px | 720, 760, 780 ⚠ moves | 5 |
| `width-panel` | 540px | 520, 540, 560 ⚠ moves | 5 |
| `width-container` | *see §11* | 1080, 1120 ⚠ moves | 13 |

`980px` (1 use) and `360px` (1 use) are one-offs. `9.5rem` is the logo cap — it appears twice
because the header and footer each set it independently, and it pairs with the logo-height
control in the admin panel; recommend keeping the two in step.

### 8.3 Layout minimums — 20 places

| Proposed | Value | Collapses | Times |
|---|---|---|---|
| `min-column` | 300px | 300, 280, 220 ⚠ moves | 8 |
| `min-panel-height` | 30rem | 26, 30, 32rem ⚠ moves | 6 |
| `tap-target` | 44px | 42, 46 ⚠ moves | 2 |

`tap-target` is worth naming for its own sake — those two values are interactive controls
sized just above and just below the 44px accessibility guideline. Standardising at 44px
makes the intent explicit.

Responsive minimums (`min(100%, 380px)`, `min(100%, 320px)`) are deliberately fluid — keep.

**One duplicate worth noting:** a **236px sidebar rail** is hand-written identically in two
different files. That is a shared component, not a token.

---

## 9. Breakpoints

**Already settled — adopt as-is.** The canon is Tailwind's default scale, unmodified:
**640 / 768 / 1024 / 1280 / 1536**, with `768` and `1024` doing nearly all the work. This was
derived separately and is documented in `docs/breakpoints.md`; nothing in this proposal
changes it.

One exception remains open, and it is yours — see §11.

---

## 10. Values that are genuinely one-off

Not everything should be a token. The following are deliberate, context-specific values, and
**the recommendation is to leave them alone.** Listed so the inventory is complete and
nothing is silently omitted.

| Value | Where | Why it stays |
|---|---|---|
| 11 grid layouts (`repeat(auto-fit…)`, asymmetric columns) | 14 uses | Layout-specific; a token would not help |
| Aspect ratios 4/3, 5/4, 16/10, 16/8 | 9 uses | Content-shaped. *(16/8 vs 16/10 could merge — minor)* |
| `min-w-[2ch]` | animated metric | Intrinsic character unit — prevents digit jitter during count-up |
| `952px` fixed height | consultation form | Dictated by a third-party embedded form, not by us |
| `max(1.5rem, calc((100vw − 72rem)/2 + 1.5rem))` | 1 use | Container-aware alignment; correct as an expression |
| `min(80vw,45rem)`, `min(70vw,48rem)`, `min(64vw,51rem)` | decorative backgrounds | Deliberately fluid |
| `inset-[-18%]`, `scale-[1.03/1.65/1.79]`, `translate-x-[100px]` | animation | Motion values, not layout |
| `76px` avatar · `9px` connector tick | 3 uses | Genuine one-offs |
| `980px`, `360px` widths | 2 uses | Genuine one-offs |
| `#B8D4F5` | 1 decorative blob | Genuine one-off |
| `flex-[1.3]` ×2, `basis-[130px]`, `h-[85%]` | flex sizing | Proportional to siblings, not absolute |
| `underline-offset-[3px]` | 1 link style | Typographic detail; pairs with `border-thick` below |
| 8 `clamp()` display sizes | after collapse | Genuinely responsive |
| 2 tinted overlays (`rgba` of primary / chart-3) | 2 uses | Recommend re-expressing as an opacity of the existing token so they follow branding |

**Two small sets that are *not* one-off and need tokens:**

- **Z-index — 4 values (1, 100, 101, 110).** Currently magic numbers governing the sticky
  header and mobile menu stacking. Proposed: `z-header`, `z-header-trigger`, `z-overlay`.
- **Border width — `1.5px` used 7 times** (6 borders plus one underline thickness), and `3px`
  once as a callout rule. Proposed: `border-thick: 1.5px`, leaving the 3px accent as a
  one-off.

---

## 11. Decisions that are yours

Collected in one place. Each ships today in both forms — that is why someone has to choose.

**1 · Two container widths, 32px apart**

`max-w-6xl` (**1152px**) in **14 files**, and **1120px** written by hand, **12 times across 4
files**. Both are "the page container." Every page on the site is one or the other.

*(Correction to the brief: 1120px appears in 4 files, not 12.)*

**2 · The 821px breakpoint**

One value survives outside the breakpoint canon: the budget planner's layout wraps at 820px
rather than the standard 768px. Between 768 and 820 it renders its *desktop* email panel
inside a *stacked* layout — inconsistent, but not broken. Lead capture works at every width.

Both ways of removing it were measured and **both change what renders in that band**, so it
was escalated rather than decided.

One detail worth knowing: **the named token and the rule that implements it are not
connected.** The token says 821px; the actual rule hardcodes 820px and never reads the
token. So the name is documentation, not a mechanism. Resolving this deletes both.

**3 · Logo images bypass the image pipeline**

The header and footer logos use a plain image tag rather than the framework's image
component. This is not a neutral cleanup: image optimisation is currently disabled
site-wide, so switching has real consequences for sharpness and loading behaviour. A design
and performance call.

**4 · Dark mode — build it or delete it**

A complete dark theme sits in the stylesheet. It is **entirely unused: zero components use a
dark-mode variant anywhere.** It is also not Lakeside's palette — it is a default grey theme
from a component library, unrelated to the brand.

A confusing detail: "dark" already means something else here. Several components take a
`variant="dark"` prop, meaning *a dark-background section on a light site*. That is the
concept the site actually uses (see §3.3). The dormant dark-mode block is a different thing
wearing the same word.

So: is dark mode wanted? If yes it needs building properly against the brand palette. If no,
deleting it removes a standing source of confusion.

**5 · The CTA blue** — see §3.4. The site's biggest conversion panels are not brand blue.

**6 · Card radius** — see §6. Three radii ship for one component.

**7 · Body text size** — see §4.2. The largest visual consequence in this document.

**8 · The +2px spacing ramp** — see §5. Optical preference, or drift?

---

## 12. Component patterns

Three patterns recur often enough that a token alone will not fix them — they need a shared
component. Noted here because they are where the token drift originates.

**The eyebrow — 15 shared uses vs 46 hand-written.** A shared eyebrow component exists and
is used 15 times. Alongside it, the same small uppercase label is hand-written **46 times in
23 files, in 28 different combinations** of size, weight, letter-spacing and colour. One
class string is copy-pasted **verbatim 11 times**.

The shared component and its hand-written twin **appear two lines apart in the same
expression** in one file — and they do not match. One is 11px with wider spacing and a
leading dash; the other is 14px with tighter spacing and no dash. The same eyebrow changes
size depending on which colour variant is active.

**The card — 46 surfaces in 21 files.** There is no card component. The two largest clusters
are the same idea at two radii: a bordered white panel written at **21.6px** (7 exact
matches) and the identical panel written at **14px** (6 exact matches). Across all card
backgrounds those two radii account for 13 and 9 surfaces respectively. **Eight sets of
byte-identical card markup** are duplicated across different files, and five different
padding treatments sit on one otherwise identical card.

*(Correction to the brief: 46 surfaces across 21 files with 10 radii — not 18 across 12 with
3. The pattern is about 2.6× more widespread than recorded.)*

**The CTA block — written twice.** The main call-to-action and the homepage audit block are
the same component, duplicated. Every styling class is identical; only the content fields
differ.

*(Correction to the brief: not literally character-identical — indentation, section id and
one padding spelling differ — but every visual class matches exactly.)*

**One likely bug, surfaced by the inventory:** a white card carries the *dark-section* border
colour. It is the only light surface using that border, and reads as copy-paste from a dark
block.

---

## 13. Corrections to earlier figures

Several counts in circulation were re-derived. The codebase is authoritative; where it
disagrees, the codebase wins. Eight branches have landed and fourteen files were deleted
since the originals were taken.

| Figure | Recorded | Actual | Note |
|---|---|---|---|
| Arbitrary bracket values | 730 / 54 files | **692 / 46 files** | Deletions since |
| Arbitrary hex colour classes | 161 | **161** | ✓ exact |
| Raw hex in components | 185 | **185** | ✓ exact |
| Arbitrary font sizes | 100 / 14 distinct | **100 / 15** fixed — but **122 / 28** including fluid | Fluid sizes were never counted |
| Letter-spacing | 118 / 12 | **107 / 12** | |
| Radii | 67 / 10 | **59 / 10** arbitrary; **14 effective** incl. tokens | |
| Inline styles | 27 | **29** (5 are admin-only) | |
| Shadows | 10 / 8 distinct | **8 / 8** — all unique | |
| `rounded-[12px]` | 12 | **8** | |
| Eyebrow: hand-written | 29 in 22 files | **46 in 23 files**, 28 variants | |
| Eyebrow: shared component | 8 files | **8 files, 15 uses** | ✓ |
| Card pattern | 18 / 12 files / 3 radii | **46 / 21 files / 10 radii** | Understated 2.6× |
| `max-w-[1120px]` | 12 files | 12 uses in **4 files** | |
| Brand blue hardcoded in shadows | 6 components | **4** | |
| Files with ≥1 arbitrary value | 45 of 57 | **40 of 46 components** (46 of 59 incl. pages) | Still systemic |
| Concentration | 156 and 98 | **156 and 98** | ✓ exact |

**Two figures were larger than recorded, not smaller** — the eyebrow and card patterns. Both
are the duplication findings, and both were undercounted.

---

## Appendix A — Method

Counts were produced by extracting every bracketed value from all 59 component and page
files programmatically, then cross-checking the total against an independent search; both
agree at **692 occurrences across 46 files**. Values were grouped by utility and by literal
value, and every colour was compared byte-for-byte against the defined token values to
produce the "already exists" figures.

Three parallel research passes covered the eyebrow, card and stylesheet layers; **every
load-bearing claim from those passes was re-checked directly against the files before
appearing here**, and one arithmetic error and one miscount were corrected in the process.

Complete distinct-value manifest, by category:

- **Colour** — 163 occurrences, 38 distinct
- **Font size** — 122 occurrences, 28 distinct (15 fixed, 13 fluid)
- **Sizing** — 111 occurrences, 55 distinct
- **Letter-spacing** — 107 occurrences, 12 distinct
- **Spacing** — 61 occurrences, 35 distinct
- **Radius** — 59 occurrences, 10 distinct
- **Line-height** — 28 occurrences, 11 distinct
- **Grid / misc** — 33 occurrences, 24 distinct
- **Shadow** — 8 occurrences, 8 distinct

**Total 692 occurrences, 221 distinct values.** Every one is either mapped to a proposed
token above or listed in §10 as intentionally one-off.

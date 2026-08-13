# Lakeside token set — as approved

**Status: partially approved.** Pete has answered all ten questions and ruled on all five
approval groups. Roughly half the set is settled and can be built against; the rest is held
open, either because two answers conflict, because an answer was ambiguous, or because a
decision depends on something that does not yet exist.

**Nothing in this document is inferred.** Where Pete did not decide something, it says so.
Open items are listed in `token-followups.md`, which is short enough to answer in one pass.

**This document is the contract.** Downstream migration work is verified against it — so an
item marked `OPEN` must not be implemented until it is closed.

| Marker | Meaning |
|---|---|
| `APPROVED` | Pete decided it. Safe to build. |
| `FREE` | No decision needed — the value already equals an existing token. Nothing moves. |
| `OPEN` | Not decided, ambiguous, or contradicted. **Do not implement.** |
| `BLOCKED` | Decided, but cannot proceed until something external arrives. |
| `DEFERRED` | Pete asked to see an example first. |

---

## 1. The decisions, as given

Pete's answers, recorded verbatim.

| | Question | Answer |
|---|---|---|
| Q1 | CTA blue | *"Drift. Use the brand blue."* |
| Q2 | What is a card | *"14px radius, border only"* |
| Q3 | Eyebrow | *"14px, no dash"* |
| Q4 | Body text | *"Merge to 15px"* |
| Q5 | Spacing ramp | *"Drift. Snap back to 16/20/24/28/32"* |
| Q6 | Semibold | *"Load a real 600 (semibold) weight. Keep the wordmark font, build it."* |
| Q7 | Dark mode | *"Delete it"* |
| Q8 | Container width | *"1120px"* |
| Q9 | Budget planner breakpoint | *"Move the layout to 768px"* |
| Q10 | Logo images | *"Switch to the optimised component"* |

| Group | Verdict |
|---|---|
| A — invisible merges | **No.** *"Show example"* — wants to see one before deciding |
| B — 1–4px type and icon steps | **Yes, approve all** |
| C — letter-spacing and line-height | **Some.** *"I think 16pt for body is good for our target"* |
| D — colour merges | **No.** Error red → `#B45353`; muted grey → 2 levels |
| E — layout moves | **Some.** *"One shadow effect"* |

---

## 2. Colour

### Approved

| Token | Value | Decision | Replaces |
|---|---|---|---|
| `primary` | `#2563A8` *(existing)* | `APPROVED` Q1 — CTA blue confirmed drift | `#3761A2` ×4 |
| `danger` | `#B45353` | `APPROVED` Group D — Pete picked from the three reds that ship | `#F87171`, `#7F1D1D` |

**Q1 note.** The CTA panel becomes brand blue and starts responding to the admin brand
controls, which it does not today. This is a **visible change on the site's two largest
conversion panels** — intended, but worth stating plainly.

### Free adoptions — no decision required

**117 hardcoded colour occurrences are byte-identical to a token that already exists**
(75 in components, 42 in the stylesheet). Pointing them at the existing token changes nothing
on screen and makes them follow the admin brand controls.

| Colour | Times | Adopts |
|---|---|---|
| `#EFF6FF` | 21 | `secondary` / `lake-pale` |
| `#7CB0E8` | 19 | `chart-3` |
| `#FFFFFF` | 14 | `card` / `popover` |
| `#F9F7F4` | 13 | `background` |
| `#0E1726` | 13 | `ink` |
| `#374151` | 10 | `secondary-button-foreground` |
| `#D5D7DB` | 8 | `secondary-button` |
| `#6B7280` | 5 | `muted-foreground` |
| `#F3F4F6` | 4 | `muted` |
| `#2563A8` | 3 | `primary` |
| `#DBEAFE` | 3 | `accent` / `lake-light` |
| `#1D4F8A` | 3 | `button-hover` |
| `#111827` | 1 | `foreground` / `heading` |

All 41 existing CMS-driven colour tokens are retained unchanged.

### New tokens — created, not merged

Group D rejected the *merges*. Naming a value that already exists is not a merge and nothing
moves, so these proceed:

| Token | Value | Times | Note |
|---|---|---|---|
| `surface-dark` | `#0B1220` | 5 | Dark section backgrounds |
| `surface-dark-raised` | `#111B2E` | 4 | Cards on dark |
| `border-on-dark` | `#1F2E45` | 5 | Dark section borders |
| `muted-foreground-subtle` | `#9CA3AF` | 28 | The most-used hardcoded colour on the site |
| `success` / `success-surface` / `success-border` | `#15803D` / `#F0FDF4` / `#86EFAC` | 5 | |
| `warning` / `warning-surface` / `warning-border` | `#B45309` / `#FDEBCB` / `#F6D79E` | 4 | |
| `danger-surface` / `danger-border` | `#FEF7F7` / `#F3D0D0` | 2 | Pairs with `danger` above |
| `info-border` | `#BFDBFE` | 1 | Surface reuses `lake-pale` |

### Open

**`OPEN` C1 — Muted grey on dark: two levels, but which two.**
Pete answered *"muted grey → 2 levels"* while rejecting Group D. Those two instructions pull
in different directions: rejecting the merge keeps all five dark greys
(`#B9C2CF`, `#94A3B8`, `#64748B`, `#B8BBC2`, `#E2E8F0`); "2 levels" reduces them to two.
**Which greys map onto which of the two levels is not determined and has not been guessed.**

**`OPEN` C2 — The CTA's paired text colour.**
`#DCE8F6` (2 uses) is the light text sitting on the CTA panel. Q1 settled the panel colour
but not this. It has no token today.

**Rejected merges — both values retained**

| Merge proposed | Verdict | Result |
|---|---|---|
| `#1E293B` → `#1F2E45` | Rejected | Footer border stays `#1E293B`, unnamed |
| `#B8BBC2`, `#E2E8F0` → `#B9C2CF` | Rejected | All three retained *(see `OPEN` C1)* |
| `#64748B` → `#94A3B8` | Rejected | Both retained *(see `OPEN` C1)* |
| `#4B5563` → `#9CA3AF` | Rejected | `#4B5563` stays as a one-off |

### Deleted

**`APPROVED` Q7 — the dormant dark theme is deleted.** 33 lines of unused `oklch` values from
a component library, with zero components supporting dark mode. Note this does *not* touch the
`variant="dark"` component prop, which means a dark-background section on a light page and is
a different concept that stays.

---

## 3. Typography

### Approved

| Token | Value | Decision |
|---|---|---|
| `text-eyebrow` | 11px | `APPROVED` Group B — collapses 10/11px, 25 places |
| `text-sm` | 13px | `DEFERRED` — Group A |
| `text-md` | 17px | `APPROVED` Group B — collapses 16/17px, 23 places |
| `text-lg` | 19px | `APPROVED` Group B — collapses 18/19px, 31 places |
| `text-xl` | 22px | `APPROVED` Group B — collapses 20/22px, 7 places |
| `text-2xl` | 26px | `APPROVED` Group B — collapses 24/26/28px, 8 places |
| `text-3xl` | 40px | `APPROVED` Group B — collapses 37.6/40/44px, 4 places |

**`APPROVED` Q3 — the eyebrow is 14px with no leading dash.**
This selects the *hand-written* variant's size over the shared component's. The shared
component is currently 11px **with** a dash, so it changes on both counts and loses its
distinguishing mark. One eyebrow replaces 28 hand-written variants across 46 occurrences.

**`APPROVED` Q6 (in principle) — semibold becomes a real weight.** See `BLOCKED` T3.

**`APPROVED` Q6 — the wordmark font is kept and a wordmark is built.** See `OPEN` T4.

**Free — 11 letter-spacing removals.** `tracking-[-0.026em]` is written 11 times on headings
that already inherit exactly that value from the stylesheet. Removing them changes nothing.
*(A twelfth sits on a paragraph styled as a title and is genuinely needed — see drift item 9.)*

### Open and blocked

**`OPEN` T1 — Body text size. Two answers conflict, and this is the largest item in the set.**

- **Q4:** *"Merge to 15px"*
- **Group C:** *"I think 16pt for body is good for our target"*

These are different sizes. `pt` is also ambiguous — **16pt is roughly 21px**, which is far
larger than anything currently used for body copy and is very unlikely to be the intent; 16px
is plausible, 15px is what Q4 said.

**106 places depend on this.** It has not been resolved in either direction.

**`OPEN` T2 — Group C: which items are approved.**
Pete answered *"Some"* but the accompanying comment is about body size, which is not in Group
C. So none of Group C's four items has a recorded verdict:

| Item | Places | Status |
|---|---|---|
| Heading letter-spacing → −0.03em | 39 | `OPEN` |
| Eyebrow letter-spacing → 0.1em | 48 | `OPEN` |
| Heading line-height → 1.05 | 20 | `OPEN` |
| Body line-height → 1.55 | 6 | `OPEN` |

**`BLOCKED` T3 — the 600 weight file does not exist.**
`app/fonts/satoshi/` contains **only** `Satoshi-400.woff2`, `Satoshi-500.woff2` and
`Satoshi-700.woff2` — verified directly. Loading a real 600 requires Pete to supply the file.

Worth flagging alongside it: `lib/fonts.ts:23-27` already declares the **700 file under weight
900**, so the current font declaration is not accurate either. Whatever is done about 600
should correct that at the same time.

**`OPEN` T4 — "build it" means building a wordmark that does not exist.**
Space Grotesk is downloaded on every page load for `--font-logo`. That token has **exactly one
reference in the entire repository — its own emission** at `lib/branding.ts:171`. Nothing
renders it. So this is a new design deliverable, not a retention decision, and no
specification for it exists.

**`OPEN` T5 — eyebrow weight and letter-spacing.**
Q3 asked for size, weight, letter-spacing and dash. Pete answered size and dash. The most
common hand-written pairing today is semibold at `0.1em` — recorded here as **evidence, not as
his answer**. Compounded by `OPEN` T2, since eyebrow letter-spacing also sits in Group C.

---

## 4. Spacing

**`APPROVED` Q5 — the spacing scale snaps back to the standard grid: 16 / 20 / 24 / 28 / 32px.**

Pete confirmed the +2px ramp (18/22/26/30/34) as drift rather than an optical preference.

**Consequence worth stating plainly:** this moves *more* than the proposal originally
suggested. The proposal offered to standardise on the existing 18/22/26/30/34 values; snapping
back to the grid shifts every one of those ~31 occurrences by 2px instead of leaving them
where they are. That is what was asked for, and it is a larger visual change than the
alternative.

| Token | Value | Replaces |
|---|---|---|
| `space-sm` | 16px | 18px ×11 |
| `space-md` | 20px | 22px ×8 |
| `space-lg` | 24px | 26px ×6 |
| `space-xl` | 28px | 30px ×3 |
| `space-2xl` | 32px | 34px ×2 |

**`OPEN` S1 — section rhythm and small paddings.** `space-section` (70/80/84/88 → 88px, 12
places) and `space-2xs` (5/7 → 6px, 3 places) sit in Groups E and A respectively, neither of
which has a clear verdict for them.

---

## 5. Radius

**`APPROVED` Q2 — a card is 14px, border only.**

| Token | Value | Note |
|---|---|---|
| `radius-card` | **14px** | **The existing token is 12px and is redefined to 14px.** Applies to 46 card surfaces currently using 10 different radii |
| `radius-pill` | 999px | `FREE` — adopts the existing unused token, 35 places |
| `radius-sq` | 10px | `DEFERRED` — Group A |
| `radius-xs` / `radius-xl` / `radius-2xl` | 8 / 17 / 21px | `DEFERRED` — Group A |

**"Border only" has a consequence beyond radius.** Cards currently use five different
elevation mechanisms. Border-only removes shadows from the 5 border+shadow cards, the
shadow-only card, and simplifies the one card stacking border + ring + shadow together. This
interacts with the unresolved shadow question below.

---

## 6. Shadows

**`OPEN` SH1 — "One shadow effect" is ambiguous.**

Pete marked Group E as *"Some"* with the note *"One shadow effect"*. That reads two ways, and
they imply very different work:

1. **Approve only the shadow item** within Group E, leaving the other layout moves unresolved.
2. **There should be exactly one shadow token** across the entire site.

Every shadow in the codebase is currently unique — 8 hand-written, no two alike, plus a few
built-ins, and no shadow token exists. Both readings are plausible.

Reading 2 also interacts with Q2: if cards are border-only, a single shadow token may be all
the site needs — but that is a chain of reasoning, not something Pete said.

---

## 7. Layout and widths

**`APPROVED` Q8 — the page container is 1120px.**
This narrows `max-w-6xl` (1152px) across **14 files** by 32px. Visible on every page.

**`OPEN` L1 — the rest of Group E.** Because Group E's *"Some"* is unresolved, these have no
verdict: prose widths (12 places), wide prose (5), panel width (5), column minimum (8), panel
min-height (6), section rhythm (12), block padding (4), and the two fluid heading collapses
(16). Largest individual move among them is 80px.

---

## 8. Breakpoints

**`APPROVED` Q9 — the budget planner's layout boundary moves to 768px.**

This resolves the last value outside the breakpoint canon. Consequences:

- `--breakpoint-planner: 821px` is **deleted** from the theme.
- The named-exception section in `docs/breakpoints.md` is **deleted**, as that document
  anticipated.
- From 768px up, the planner's two columns sit side by side. Measured previously: at 820px the
  results card moves from full width at x=56 to a 304px column at x=460.

The canon is then Tailwind's default scale unmodified — 640 / 768 / 1024 / 1280 / 1536 — with
no exceptions.

---

## 9. Images

**`APPROVED in principle` Q10 — logos switch to the optimised image component.**

**`OPEN` I1 — but this is currently a no-op, and the real question is Matt's.**
`next.config.ts:29` sets `images.unoptimized: true` — verified directly. While that stands,
switching to the optimised component yields an *unoptimised* optimised component: the change
would be cosmetic. Actually optimising means flipping that flag, which carries cost and
configuration implications on Vercel and interacts with the existing `localPatterns` entry for
`/api/media/file/**` at `next.config.ts:30-34`.

**This is an infrastructure decision, not a design one — it goes to Matt, not Pete.**

---

## 10. Drift — confirmed

Nine of the ten drift candidates are confirmed as drift: the value in the code is not what was
designed.

| # | Behaviour | Verdict |
|---|---|---|
| 1 | CTA panel `#3761A2`, not brand `#2563A8` | **Drift** → use brand blue |
| 2 | Eyebrow renders at two sizes depending on colour variant | **Drift** → 14px, no dash |
| 3 | Cards use 10 different corner radii | **Drift** → 14px, border only |
| 4 | Spacing sits 2px above the standard grid | **Drift** → snap back to grid |
| 5 | 36 elements use a font weight the font does not have | **Drift** → load a real 600 |
| 6 | A wordmark font loads but is never shown | **Drift** → build the wordmark |
| 7 | The page container is two different widths | **Drift** → 1120px |
| 9 | A title is marked up as a paragraph, not a heading | **Drift** |
| 10 | Unused dark theme from a component library | **Drift** → delete |

### One is not drift

> ## 8 · The dark-section border on a white card is **designed. Do not fix.**
>
> `components/homepage-growth-system.tsx:210` applies the dark-section border colour
> `#1F2E45` to a `bg-white` card. It is the only light surface on the site using that border,
> and earlier analysis flagged it as a **likely copy-paste bug**.
>
> **Pete confirms it is intentional.**
>
> It must therefore survive migration. Expressed as a token, this is
> `border-on-dark` applied deliberately to a light surface — not an anomaly to be tidied
> away. **Anyone migrating this file should leave it exactly as it is.**

This single answer is the clearest argument for having run the drift check at all: nine
confirmations, and one save that would otherwise have been "helpfully corrected" out of
existence.

---

## 11. Design source and working process

Recorded for later work.

**The Claude Design project can be shared.** Pete: *"It can be shared. It exists for some
parts of the design. Not all."*

- Publication to it is therefore **viable** — no export-based fallback is needed.
- Coverage is **partial**, so whatever is published will be a superset of what is there today.
- **`OPEN` P1 — the project identifier has not been supplied.** "It can be shared" is not the
  same as having it.

**Pete works in HTML design mockups.** Pete: *"HTML design mockups"*

This revises an assumption the project has carried from the beginning. The working theory was
*"Pete produces a design system, Matt receives pixels — nothing carries the structure
across."* If the deliverable is HTML, that is not what happens:

- The values are **already machine-readable on both sides**. Pete's mockups contain real CSS;
  the site contains real CSS.
- So the loss is **not translation — it is reconciliation**. Two sets of genuine values, with
  nothing comparing them.
- That is a materially more tractable problem than the one assumed. It points toward diffing
  the two sets rather than publishing tokens and hoping they get picked up.

This observation should carry substantial weight in the final report's handoff recommendation.

---

## 12. What is settled, and what is not

**Safe to build now:** the 117 free colour adoptions, the 11 free letter-spacing removals, the
free radius adoptions, plus Q1 (CTA blue), Q2 (card 14px/border), Q3 (eyebrow size/dash),
Q5 (spacing grid), Q7 (delete dark mode), Q8 (1120px), Q9 (768px breakpoint), Group B's type
steps, and Group D's supplied `#B45353`.

**Held open — 11 items:** T1 body size *(largest — 106 places)*, T2 Group C, T3 the 600 font
file, T4 the wordmark, T5 eyebrow weight/tracking, C1 dark greys, C2 CTA text colour,
S1 section rhythm, SH1 the shadow ambiguity, L1 the rest of Group E, I1 the image config —
plus P1, the Claude Design identifier, and Group A pending its example.

All are in `token-followups.md`. The Group A example is at `token-group-a-example.html`.

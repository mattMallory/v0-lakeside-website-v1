# Token decisions — review pack for Pete

**Read this one. `token-proposal.md` is the evidence behind it; you shouldn't need to open it
unless you want to check something.**

---

## What this is, and what it isn't

We went through the Lakeside site and pulled out every colour, size, spacing and radius the
code actually uses — 692 hand-written values in total. Then we grouped them into the token
set they were clearly trying to be.

**This is a description of what the code does today. It is not a review of your design.**

That distinction matters, because in a few places what shipped is not what was designed —
the value drifted somewhere between your file and the browser, and nobody caught it. Those
cases are the most useful part of this conversation, and they're the reason we're having it:
we're trying to fix the handover, not the design.

So where a question below reads "was this intentional?", it's a genuine question. If the
answer is "no, that's not what I drew" — that's the finding we're looking for.

**You don't need to review 68 tokens. You need to answer 10 questions and approve or reject
5 groups of changes.** That's the whole ask.

---

## The one-paragraph background

The site already has a design system in its stylesheet — 41 colour tokens and 10 radius
tokens. **Most of it was never used.** Values got typed in by hand instead, over and over.
The clearest example: **117 hardcoded colours in the code are character-for-character
identical to a token that already exists.** They're the same colour — just written out
longhand. Which is why changing the brand colour in the admin panel doesn't fully rebrand
the site: those 117 don't move.

So the bulk of the work is *adoption* — pointing existing values at names that already
exist. **176 of those changes are completely free: nothing moves on screen.** They'll happen
regardless and need no decision from you.

Everything below is the part that isn't free.

---

# Part 1 — Ten questions

---

## Q1 · Is the CTA meant to be brand blue?

**What ships today:** the two biggest conversion panels on the site — the main
call-to-action block and the homepage audit block — are filled with **`#3761A2`**.

The brand primary is **`#2563A8`**.

Those are different blues. And because it's hand-written rather than tokenised, that panel
also ignores the brand controls in the admin panel entirely.

**This is our strongest drift candidate.** Two similar-but-different blues usually means one
was sampled or eyeballed rather than taken from the palette.

**Options:**
1. It's drift → point it at the brand primary. The CTA becomes brand blue.
2. It's intentional → we name it properly and add it to the admin panel so it's controllable.
3. Neither → you pick a third value.

**Answer:**

**Was this designed as a separate blue, or should it have been the brand blue all along?**

---

## Q2 · What is a card?

**What ships today: 46 card surfaces across 21 files, using 10 different corner radii.**

There is no card component — every card is built by hand. The two biggest groups are the
*same* bordered white panel written two different ways: **21.6px** corners in one, **14px**
in the other. Same element, 7.6px apart.

There's a defined `card` radius token of **12px** in the stylesheet. **It is used zero times.**

One 68-line component uses three different radii by itself — 12px, 10px and 14px.

Elevation is equally split: some cards use a border, some a shadow, some a ring, some a
border *and* a ring *and* a shadow at once (which double-draws the hairline — almost
certainly nobody's intention).

**What we need:** one radius for cards, and one way of lifting them off the page.

**Answer — card radius:**

**Answer — card elevation (border / shadow / both):**

---

## Q3 · The eyebrow — was there one spec?

**What ships today:** the small uppercase label above headings exists **twice**. There's a
shared component, used 15 times. And there's a hand-written version — **46 times, across 23
files, in 28 different combinations** of size, weight, letter-spacing and colour.

One class string is copy-pasted **verbatim 11 times**.

The sharpest bit: in one file, the shared component and the hand-written copy sit **two lines
apart in the same expression** — and they don't match. One is 11px with wide letter-spacing
and a small leading dash. The other is 14px, tighter, no dash. **So the eyebrow changes size
depending on which colour variant is showing.**

That's not a decision anyone made. It's what happens when one element gets built twice.

**What we need:** one eyebrow. Size, weight, letter-spacing, and whether it has the dash.

**Answer:**

---

## Q4 · Body text — what size is it actually meant to be?

**What ships today:** the page sets an 18px base. But the most-used text size in the site is
**15px (25 uses)** and **14px (77 uses)** — 106 places between them, one pixel apart.

We can't tell from the code whether 14 and 15 are two deliberate steps or the same step
written inconsistently.

**This is the single largest visual decision in the document.** Merging them nudges body text
by 1px across most of the site. That's either invisible polish or a real change to reading
rhythm — and that's a judgement about how the site should *feel* to read, which is yours.

**Options:**
1. Merge to 15px — one body size, 1px shift in 81 places.
2. Merge to 14px — one body size, 1px shift the other way.
3. Keep both — they're distinct steps, nothing moves.

**Answer:**

---

## Q5 · The spacing ramp — deliberate, or drift?

**What ships today:** the five most common custom paddings are **18 · 22 · 26 · 30 · 34px**.

Those are *exactly 2px above* the standard 16 · 20 · 24 · 28 · 32 grid. Every single step,
nudged by the same 2px, by hand, in different files.

That's a strikingly consistent pattern — which is why we think it might be deliberate
(an optical preference) rather than accidental. But it could equally be one value that got
copied forward.

**Options:**
1. Deliberate → we make **18/22/26/30/34** the official scale and use it everywhere.
2. Drift → we snap back to the standard **16/20/24/28/32** grid.

Either is fine. What isn't fine is the current state, which is both at once.

**Answer:**

---

## Q6 · Semibold — should it exist?

**What ships today: 36 elements ask for semibold (600 weight) in the display font.**

The display font is loaded with only 400, 500 and 700. **There is no 600.** So the browser
either substitutes 700 or fakes the weight — neither of which is a decision anyone made.

**Options:**
1. Semibold is part of the design → we load a real 600 weight.
2. It isn't → those 36 elements become 500 or 700.

**Answer:**

**Related, quick:** a third font (Space Grotesk) is downloaded on every page load for a logo
wordmark — **but nothing on the site uses it.** Was there meant to be a wordmark? If not we
can drop the font entirely and save the download.

**Answer:**

---

## Q7 · Dark mode — build it or bin it?

**What ships today:** a complete dark theme sits in the stylesheet, and **nothing uses it.**
Zero components support dark mode. It's also not the Lakeside palette — it's a default grey
theme that came with a component library.

One confusion worth clearing up: "dark" already means something else on this site. Several
components take a `dark` variant meaning *a dark-background section on a light page* — the
navy bands. That's a real thing the site does. The dormant dark-mode theme is unrelated but
shares the word.

**Options:**
1. Dark mode is wanted → it needs building properly against the Lakeside palette.
2. It isn't → we delete it, which removes a standing source of confusion.

**Answer:**

---

## Q8 · Two page widths, 32px apart

**What ships today:** the page container is **1152px** in 14 files, and **1120px** written by
hand in 4 files. Both are "the page container." Every page is one or the other.

**Answer — which width:**

---

## Q9 · The budget planner's odd breakpoint

**What ships today:** everything on the site switches layout at the standard 768px — except
the budget planner, which switches at 820px.

In the 53px band between them, the planner shows its *desktop* email panel inside a *stacked*
mobile layout. It's inconsistent-looking, but nothing breaks and lead capture works at every
width.

We measured both ways of fixing it and **both change what the planner looks like in that
band**, so we didn't want to pick unilaterally:

1. Move the layout to 768px → the two columns sit side by side from 768px up.
2. Move the panel to 821px → the email form moves out of the dark results card to below it.

**Answer:**

---

## Q10 · The logo images

**What ships today:** the header and footer logos are plain image tags rather than going
through the framework's image component.

Normally that's a routine technical cleanup — but image optimisation is currently switched
off site-wide, so changing it has real consequences for how sharp the logo looks and how it
loads. That makes it partly your call rather than purely a developer one.

**Options:**
1. Switch to the optimised component (and turn optimisation on).
2. Leave as-is — the logo is a small asset and the current output is known-good.

**Answer:**

---

# Part 2 — Five groups of changes to approve or reject

Everything here moves something on screen. Grouped by how visible the move is, so you can
approve a whole class at once. **A rejection is a perfectly good answer** — it just means we
keep both values and live with the duplication.

---

## Group A · Invisible — sub-pixel and imperceptible

Eight merges where the difference is under ~2px and genuinely cannot be seen.

| Merge | From → to | Places |
|---|---|---|
| Two near-white backgrounds | `#F9FAFB`, `#FAFBFC` → white | 2 |
| Small text | 13 / 13.5px → 13px | 5 |
| Small radii | 7 / 7.2 / 8 / 9 / 9.6px → 8px | 23 |
| Square radii | 10 / 11px → 10px | 23 |
| Large radii | 16 / 16.8 / 18px → 17px | 17 |
| Extra-large radii | 20 / 21.6px → 21px | 23 |
| Tiny padding | 5 / 7px → 6px | 3 |
| Tap targets | 42 / 46px → 44px | 2 |

The tap-target one is worth a nod: those are interactive controls sized just under and just
over the 44px accessibility guideline. Standardising at 44 makes the intent explicit.

**Approve Group A?**  ☐ Yes  ☐ No  ☐ Some (note which)

---

## Group B · 1–4px type and icon steps

The type scale. **Q4 covers the big one (body text) separately** — if you answer Q4, the rest
of this group follows the same logic.

| Merge | From → to | Places | Move |
|---|---|---|---|
| Eyebrow text | 10 / 11px → 11px | 25 | 1px, 3 sites |
| Body text *(see Q4)* | 14 / 14.5 / 15px → 15px | 106 | 1px, 81 sites |
| Medium text | 16 / 17px → 17px | 23 | 1px, 18 sites |
| Large text | 18 / 19px → 19px | 31 | 1px, 25 sites |
| XL text | 20 / 22px → 22px | 7 | 2px |
| 2XL text | 24 / 26 / 28px → 26px | 8 | 2px |
| 3XL text | 37.6 / 40 / 44px → 40px | 4 | up to 4px |
| Icon sizes | 26px folds into 22 or 30px | 1 | 4px |

**Approve Group B?**  ☐ Yes  ☐ No  ☐ Some (note which)

---

## Group C · Typographic feel — letter-spacing and line-height

No size changes, but these affect how text *sits*. Worth a designer's eye more than the
others.

| Merge | From → to | Places | What actually moves |
|---|---|---|---|
| Heading letter-spacing | −0.03 / −0.02 / −0.015em → −0.03em | 39 | Slightly tighter headings; accumulates across a long line |
| Eyebrow letter-spacing | 7 values (0.02–0.14em) → 0.1em | 48 | Some labels widen, some tighten |
| Heading line-height | 7 values (1.02–1.15) → 1.05 | 20 | Up to ~5px per line on a large heading |
| Body line-height | 1.45 / 1.55 → 1.55 | 6 | ~1.5px per line |

**Note:** 11 further letter-spacing declarations are being removed entirely and are **free** —
they re-state a value the headings already inherit. Not part of this group.

**Approve Group C?**  ☐ Yes  ☐ No  ☐ Some (note which)

---

## Group D · Colour merges — visible tonal shifts

These change actual colours. The first two are close; **the last two are clearly visible** and
we'd particularly like your eye on them.

| Merge | From → to | Places | Visibility |
|---|---|---|---|
| Dark-section borders | `#1E293B` → `#1F2E45` | 6 | Barely |
| Light text on dark | `#B8BBC2`, `#E2E8F0` → `#B9C2CF` | 10 | `#E2E8F0` is noticeably lighter |
| Muted text on dark | `#64748B` → `#94A3B8` | 21 | **Clearly lighter** |
| Muted text on light | `#4B5563` → `#9CA3AF` | 29 | **Much lighter — 1 site** |
| Error red — pick one | `#F87171` / `#B45353` / `#7F1D1D` → ? | 4 | **Three different reds ship today** |

**On the error red:** warning and success states each use one colour consistently. Error uses
three, in three different components — a light red, a mid red and a very dark red. One needs
to win, and which one is a legibility call on the surfaces they sit on.

**Which error red?**

**Context worth knowing:** there's a token for muted text on *light* backgrounds and **none
for dark backgrounds** — so every dark section invented its own grey. Five of them, for one
job. The code says it out loud in one place: *"if dark use this hex, otherwise use the
token."* The light branch has a name; the dark branch doesn't.

We're proposing to create that missing token. How many shades of grey you want inside dark
panels — one, two, or three — is the actual question.

**Approve Group D?**  ☐ Yes  ☐ No  ☐ Some (note which)

**How many muted-grey levels on dark?**

---

## Group E · Layout — the largest moves

These shift things by 20–80px. Most visible group; most likely to want individual answers.

| Merge | From → to | Places | Largest move |
|---|---|---|---|
| Section rhythm | 70 / 80 / 84 / 88px → 88px | 12 | **18px** |
| Block padding | 30 / 34px → 30px | 4 | 4px |
| Prose width | 600 / 620 / 640px → 640px | 12 | 40px |
| Wide prose | 720 / 760 / 780px → 760px | 5 | 40px |
| Panel width | 520 / 540 / 560px → 540px | 5 | 20px |
| Column minimum | 220 / 280 / 300px → 300px | 8 | **80px** |
| Panel min-height | 26 / 30 / 32rem → 30rem | 6 | **64px** |
| Big headings | 4 near-identical fluid sizes → 1 | 12 | varies by screen |
| Largest headings | 4 fluid sizes → 1 | 4 | varies by screen |
| Shadows | 11 unique shadows → 3 | 12 | visual weight |

**On shadows:** every single shadow in the codebase is currently unique — 8 hand-written
ones, no two the same, plus a few built-ins. There's no shadow token at all. Three of them
also bake the brand blue into the shadow colour, which is another reason those elements
ignore the brand controls.

**Approve Group E?**  ☐ Yes  ☐ No  ☐ Some (note which)

---

# Part 3 — Drift check

Quick yes/no on each. **"That's not what I designed" is the useful answer here** — it tells us
where the handover leaks, which is what the whole project is trying to fix.

| # | What the code does | Designed this way? |
|---|---|---|
| 1 | CTA panel is `#3761A2`, not the brand `#2563A8` | ☐ Yes ☐ No |
| 2 | The eyebrow renders at two different sizes depending on colour variant | ☐ Yes ☐ No |
| 3 | Cards use 10 different corner radii | ☐ Yes ☐ No |
| 4 | Spacing sits 2px above the standard grid | ☐ Yes ☐ No |
| 5 | 36 elements use a font weight the font doesn't have | ☐ Yes ☐ No |
| 6 | A wordmark font loads but is never shown | ☐ Yes ☐ No |
| 7 | The page container is two different widths | ☐ Yes ☐ No |
| 8 | A white card uses the dark-section border colour | ☐ Yes ☐ No |
| 9 | A title is marked up as a paragraph, not a heading | ☐ Yes ☐ No |
| 10 | The site has an unused dark theme from a component library | ☐ Yes ☐ No |

**For any "No" — if you remember roughly when or how it was handed over, that detail is
genuinely valuable.** It's the difference between "these drifted" and a concrete account of
where the process loses information.

---

# Part 4 — Two things to ask Pete directly

Not decisions — context we need and don't have.

**1 · The Claude Design project.**
We can't see it from the codebase. Could you tell us:
- Does it still exist, and what's it called?
- How is it organised — components, tokens, pages?
- **Can it be shared with the dev side, or not?**

"It can't be shared" is a completely fine answer — we just need to know now, because it
changes what we build. Shareable means a live link; not shareable means we produce an export
instead.

**2 · How you actually work.**
- What do you produce when you design a page — and what do you hand over?
- What does Matt receive, and in what form?
- What would you *want* to hand over, if the tooling allowed it?

The final report's main recommendation is a handover workflow. One built around how you
actually work will be worth considerably more than a generic one.

---

## Summary of what we need back

- **10 answers** (Part 1)
- **5 group approvals**, or partial with notes (Part 2)
- **10 drift yes/nos**, plus any story attached to the "no"s (Part 3)
- **Claude Design project status + how you work** (Part 4)

Anything you'd rather not decide yet, say so — we'll record it as open rather than guess.
**A recorded "undecided" is genuinely more useful to us than an assumed preference**, because
the approved set becomes the contract everything downstream is built against.

# Follow-ups — one pass

Everything still open after Pete's review. **Ten for Pete, one for Matt.** Most are one-liners;
the first is the only one that really needs thought.

Full context for any item is in `token-set.md` under the reference in brackets.

---

## For Pete

### 1 · Body text — 15px or 16px? ⚠ the big one

You answered two different things, and this one touches **106 places**:

- **Q4:** *"Merge to 15px"*
- **Group C:** *"I think 16pt for body is good for our target"*

Also — did you mean **16px** or **16pt**? They're not the same: 16pt is about **21px**, which
would be much larger than anything currently used for body copy.

Today the site uses 14px in 77 places and 15px in 25.

**☐ 15px  ☐ 16px  ☐ 21px (i.e. actually 16pt)  ☐ something else: ______**  *(T1)*

---

### 2 · Group A — here's the example you asked for

Open **`token-group-a-example.html`** in a browser. It shows the merges at real size, plus a
magnified view — the two biggest are a 0.8px and a 1.6px difference in corner rounding, on
panels that sit directly above one another on the About page.

**☐ Approve all  ☐ Approve except: ______  ☐ Reject**  *(Group A)*

---

### 3 · Group C — which ones?

You said *"Some"*, but the note was about body size, which isn't in this group. So we don't
know which of these four you meant:

- ☐ Heading letter-spacing → −0.03em *(39 places)*
- ☐ Eyebrow letter-spacing → 0.1em *(48 places)*
- ☐ Heading line-height → 1.05 *(20 places)*
- ☐ Body line-height → 1.55 *(6 places)*

*(T2)*

---

### 4 · Group E — what did "one shadow effect" mean?

- ☐ **Approve just the shadow change** in that group, leave the rest open
- ☐ **There should be exactly one shadow** across the whole site

*(Right now every shadow on the site is unique — 8 of them, no two alike.)*  *(SH1)*

---

### 5 · Group E — the rest of it

If you meant the first option above, these are still open. Biggest single move is 80px.

☐ Approve all  ☐ Approve except: ______  ☐ Reject

*(Covers prose widths, panel widths, column minimums, section spacing, and two heading-size
merges.)*  *(L1, S1)*

---

### 6 · Eyebrow — weight and letter-spacing

You gave us **14px, no dash**. Still need:

- **Weight:** ☐ medium ☐ semibold ☐ bold
- **Letter-spacing:** ______

*(Most common on the site today is semibold at 0.1em — but we're not assuming that's your
intent.)*  *(T5)*

---

### 7 · Muted grey on dark — which two?

You said **2 levels**, which we've recorded. There are currently five greys doing this job:

`#B9C2CF` · `#94A3B8` · `#64748B` · `#B8BBC2` · `#E2E8F0`

**Which two survive?** ______ and ______  *(C1)*

---

### 8 · The CTA's text colour

The CTA panel becomes brand blue. The pale text sitting on it is `#DCE8F6` and has no token.

☐ Keep as-is  ☐ Use white  ☐ Other: ______  *(C2)*

---

### 9 · The Satoshi 600 file 🔒 blocks the semibold change

You asked for a real 600 weight. **The font folder only has 400, 500 and 700** — there's no
600 file to load. Can you send it?

☐ Sending it  ☐ Use 500 instead  ☐ Use 700 instead  *(T3)*

*(Separately: the current setup labels the 700 file as weight 900, which we'll correct at the
same time.)*

---

### 10 · The wordmark — what is it?

"Keep the wordmark font, build it" means building something that doesn't exist yet. The font
(Space Grotesk) downloads on every page, but **nothing on the site uses it** — there's no
wordmark anywhere.

**What should it look like, and where does it go?** ______  *(T4)*

---

### 11 · Claude Design project — the link

You confirmed it can be shared. We still need the actual project name or link.

______  *(P1)*

*(Worth knowing: since it covers only some of the design, what we publish will be more than
what's there now.)*

---

## For Matt

### 12 · Image optimisation is switched off

Pete approved switching the logos to the optimised image component. But `next.config.ts:29`
sets `images.unoptimized: true` — so as things stand, that change would do nothing.

Actually optimising means flipping that flag, which has cost and configuration implications on
Vercel and interacts with the existing `localPatterns` rule for `/api/media/file/**`.

☐ Flip the flag  ☐ Leave optimisation off (and skip the logo change)  ☐ Needs discussion  *(I1)*

---

**Once 1–5 are answered, the bulk of the token set closes.** Items 6–11 affect smaller areas
and can follow. Item 12 is independent of everything else.

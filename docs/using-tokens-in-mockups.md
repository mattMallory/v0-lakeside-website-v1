# Designing with the site's tokens

For designing mockups in HTML using the exact colours, type sizes, radii and
breakpoints the live site ships.

## The one line

Put `tokens.css` next to your mockup and link it:

```html
<link rel="stylesheet" href="tokens.css">
```

Or, from inside a stylesheet you already have:

```css
@import url('tokens.css');
```

That is the whole integration. No build step, no Tailwind, no npm. A plain `.html`
file opened straight from your desktop works.

## What you get

Every token is a CSS custom property on `:root`, so use it anywhere a value goes:

```css
.headline {
  color: var(--color-heading);
  font-size: var(--text-display);
}

.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  max-width: var(--container-page);
}

@media (min-width: 48rem) { /* --breakpoint-md */ }
```

The names group by what they are:

| Prefix | What it covers |
|---|---|
| `--color-*` | Every colour — brand, surfaces, text, status, dark bands |
| `--text-*` | Type sizes, named by role (`--text-eyebrow`, `--text-lead`, `--text-display`) |
| `--radius-*` | Corner radii, including `--radius-card` and `--radius-pill` |
| `--spacing-icon-*` | Icon sizes |
| `--breakpoint-*` | The five widths the layout actually changes at |
| `--container-page` | The page content width |

Open `tokens.css` and read it — it is a short, flat list, and the comments explain
why several of the values are what they are. If a token you expect is missing, that
is usually deliberate and the comments say so. Font weight and letter-spacing, for
instance, are absent on purpose because they have not been decided.

## When the site's tokens change

Take a fresh copy of `tokens.css`. Nothing else changes — the names stay put, so a
mockup written against them keeps working and simply picks up the new values.

The file is regenerated from the site's stylesheet on every build, so the copy in
the repository is always current. Grab it from:

```
public/tokens.css
```

or, on a deployed site, from `/tokens.css`.

## Two things worth knowing

**Do not edit `tokens.css`.** It is generated from `app/globals.css` and any change
is overwritten by the next build. If a value is wrong, that is a conversation about
the site's tokens, not a local edit — which is the entire point of sharing one file.

*(For whoever maintains the site: `pnpm generate:tokens` rewrites it, and
`pnpm check:tokens` exits non-zero if the committed copy has fallen behind the
`@theme` block — suitable for a CI step.)*

**Colours are the site's defaults.** A site owner can override some of them at
runtime through the CMS branding settings, so a live page may differ from the
default palette. Design against these values; they are what ships unless someone
deliberately changes them.

# Verified Baseline

Measured state of this repository's build, type-check, and lint tooling.

Every result below was produced by running the stated command in this workspace and
reading its output. Nothing here is inferred from reading source code. Where a value
could not be measured, that is stated plainly rather than estimated.

**No source file was modified to make any command pass.** The working tree was clean
(`git status --short` empty) after all measurements.

---

## 1. Environment

Conditions the measurements were taken under.

| Property | Value |
|---|---|
| Date | 2026-08-06 16:17 UTC |
| OS | macOS 26.5.2 |
| Architecture | arm64 (Apple Silicon) |
| Node | v24.13.1 (via nvm) |
| pnpm | 10.34.5 |
| TypeScript | 5.7.3 (`npx tsc --version`) |
| sqlite3 CLI | 3.51.0 |
| Branch | `chore/verified-baseline` |
| Commit at measurement | `8cfc6ff` |

### 1.1 pnpm was not installed on this machine

`pnpm` was not present on `PATH` before this session — only `npm`, `npx`, and
`corepack` were available:

```
$ which -a pnpm
pnpm not found
```

`package.json` declares no `packageManager` field and no `engines` block, and the
repository contains no `.npmrc`, `.nvmrc`, or `vercel.json`. The pnpm major version
was therefore not pinned by anything in the repo.

pnpm 10 was selected on the following evidence, not preference: `package.json`
contains a `pnpm.onlyBuiltDependencies` array (lines 78–82), a field that only has
meaning in pnpm 10, where lifecycle scripts are blocked unless explicitly allowlisted.
`pnpm-lock.yaml` declares `lockfileVersion: '9.0'`, which pnpm 10 reads natively.

pnpm was activated with:

```
$ corepack prepare pnpm@10 --activate
$ corepack enable pnpm
```

**This is an unpinned variable.** A different machine could resolve a different pnpm
major and get different build-script behaviour. Pinning `packageManager` would remove
this ambiguity, but that is a change, not a measurement, so it was not made here.

### 1.2 Environment file

No `.env` existed at the repository root before this session. One was created,
containing only the two variables local development requires:

- `PAYLOAD_SECRET` — a locally generated random value
- `DATABASE_URL` — set to the local SQLite file path

Variable **values are not recorded anywhere**, by name only. `.env*` is gitignored
(`.gitignore` lines 19–21), so the file is not committed. No production credential was
needed or obtained.

Creating this file was a prerequisite for running the build at all, not a repair to the
codebase, so it does not compromise the baseline.

### 1.3 Database path resolved

The measurements ran against **SQLite**, confirmed empirically rather than assumed:
no Postgres URL variable was set and `VERCEL` was unset, so `shouldUsePostgresConfig()`
(`lib/db-url.ts:61-63`) returned false. Confirmation from the build output itself —
every database error emitted was a `LibsqlError`, which is the SQLite driver.

---

## 2. `pnpm install`

**Command:** `pnpm install`
**Outcome:** Succeeded. Exit code 0. `Done in 12.7s using pnpm v10.34.5`. 745 packages.

### 2.1 Lockfile state

```
Lockfile is up to date, resolution step is skipped
```

**No lockfile-vs-`package.json` mismatch was reported.** `pnpm-lock.yaml` is in sync
with `package.json`.

Both lockfiles remain present and unmodified, as instructed:
`pnpm-lock.yaml` (8,321 lines, maintained) and `package-lock.json` (11,908 lines, stale).

### 2.2 Peer dependency warnings — NOT MEASURED

**No peer dependency warnings were emitted, but this is not evidence that none exist.**

Because the lockfile was already current, pnpm skipped the resolution step entirely
(see the message above), and peer relationships were never recomputed. Forcing
resolution would rewrite `pnpm-lock.yaml`, which this work was instructed not to do.

This is a genuine gap in the baseline. Measuring it requires either a throwaway clone
or accepting a lockfile rewrite.

### 2.3 Build scripts

One warning was emitted, verbatim:

```
╭ Warning ─────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Ignored build scripts: bufferutil@4.1.0, msw@2.14.6.                       │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
```

**`sharp` was not among the ignored scripts.** The build scripts that ran were:

```
.../sharp@0.34.5/node_modules/sharp install$ node install/check.js || npm run build
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.28.1/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
```

All four reported `Done`. `esbuild`, `sharp`, and `unrs-resolver` are allowlisted in
`package.json` under `pnpm.onlyBuiltDependencies`, which is why they were permitted.

### 2.4 Two sharp versions coexist

The `install` script above ran for `sharp@0.34.5`, while the declared direct dependency
resolved to `sharp@0.35.2`. Both are present:

```
$ pnpm why sharp
sharp@0.34.5  └─┬ next@16.2.6            (transitive)
sharp@0.35.2  └── my-project@0.1.0       (direct dependency)
Found 2 versions of sharp
```

**This is not a defect.** `sharp@0.35.2` declares no `install` script at all — 0.35.x
ships prebuilt binaries via optional dependencies instead of building on install. Only
0.34.5 (which uses `install/check.js`) has one. Nothing was skipped.

Image handling was verified functional:

```
$ node -e "const s=require('sharp'); console.log(s.versions.sharp, s.versions.vips)"
sharp loaded OK, version: 0.35.2 | libvips: 8.18.3
```

---

## 3. `pnpm build`

**Command:** `pnpm build`
(resolves to `node scripts/sync-layout-scripts.mjs && cross-env NODE_OPTIONS=... next build --webpack`)

**Outcome: SUCCEEDED. Exit code 0.**

| Run | Exit | Duration | Output lines |
|---|---|---|---|
| First (no `payload.db` present) | 0 | 40s | 1,177 |
| Second (`payload.db` present) | 0 | 30s | 1,175 |

The build was run twice deliberately, to establish whether the database errors below
are a first-boot artifact or a persistent condition. They are persistent.

### 3.1 The pre-build script ran cleanly

`scripts/sync-layout-scripts.mjs` did **not** throw. It emitted:

```
Wrote public/scripts/lakeside-metric-count-up.js
Wrote public/scripts/lakeside-tech-logos-reveal.js
Wrote public/scripts/lakeside-offer-builder.js
Wrote public/scripts/lakeside-budget-planner.js
```

The regenerated files are **byte-identical to the committed versions** — `git status
--short` was empty and `git diff --stat` produced no output afterwards, despite all
four files being tracked. There is no drift between the `lib/` template-literal sources
and the generated `public/scripts/` output.

### 3.2 Compilation

```
▲ Next.js 16.2.6 (webpack)
- Environments: .env
  Creating an optimized production build ...
⚠ Compiled with warnings in 12.7s
  Skipping validation of types
  Finished TypeScript config validation in 5ms ...
```

Two things to note precisely:

- **`Skipping validation of types`** — this is `next.config.ts` setting
  `typescript.ignoreBuildErrors: true`. The successful build is therefore **not**
  evidence that types are clean. See section 4.
- **`⚠ Compiled with warnings`** — the banner appeared, but **Next.js emitted no
  warning detail to stdout**, so the specific compile warnings are unknown. This is a
  gap; the count and content of those warnings were not measurable from this output.

The only warning printed with detail anywhere in the build was:

```
⚠ metadataBase property in metadata export is not set for resolving social open graph
or twitter images, using "http://localhost:3000".
```

### 3.3 All 12 routes built

```
Route (app)
┌ ƒ /                                  ├ ƒ /blog
├ ○ /_not-found                        ├ ƒ /blog/[slug]
├ ƒ /about                             ├ ƒ /consultation
├ ƒ /admin/[[...segments]]             ├ ƒ /privacy
├ ƒ /api/[...slug]                     ├ ƒ /services
                                       ├ ƒ /terms
                                       └ ƒ /tools/google-ads-budget-planner
```

`✓ Generating static pages using 10 workers (11/11) in 398ms`

### 3.4 The build succeeds but logs ~1,175 lines of database errors

Although the exit code is 0, the build emits a large volume of runtime errors during
page-data collection. Counted from the second (steady-state) run:

| Count | Error |
|---|---|
| 13 | `[blog] Failed to load posts` |
| 10 | `[blog] Failed to load tags` |
| 9 | `[payload] Failed to load homepage SEO` |
| 6 | `[blog] Failed to load post "tuscola-pain-wellness-center-case-study"` |
| 2 | `[payload] onInit seeding failed` |
| 2 | `[payload] Failed to seed navigation global` |
| 2 | `[payload] Failed to seed legal global` |
| 2 | `[payload] Failed to ensure posts case study columns` |
| 2 | `[payload] Failed to ensure homepage growth system tables` |
| 2 | `[payload] Failed to ensure about global columns` |
| 1 | `[payload] Failed to load services content` |
| 1 | `[payload] Failed to load homepage content` |
| 1 | `[payload] Failed to load about SEO` |
| 1 | `[payload] Failed to load about content` |
| 1 | `[blog] Failed to load categories` |

Every one has the same underlying cause, `SQLITE_ERROR: no such table`. Representative
excerpt, verbatim (long SQL elided at the marked point only):

```
[payload] Failed to ensure homepage growth system tables: Error [LibsqlError]: SQLITE_ERROR: no such table: homepage
    at X (.next/server/chunks/5046.js:1:31465)
    at Q (.next/server/chunks/5046.js:1:30652)
    at O.execute (.next/server/chunks/5046.js:1:27705)
    at n (.next/server/chunks/5046.js:144:2318)
    at async Object.o [as beforeSeed] (.next/server/chunks/5046.js:144:5135)
    at async Object.onInit (.next/server/chunks/4265.js:1:105954)
    at async m (.next/server/chunks/3163.js:808:4206) {
  code: 'SQLITE_ERROR',
  rawCode: 1,
  [cause]: SqliteError: no such table: homepage { code: 'SQLITE_ERROR', rawCode: 1 }
}
```

The build survives this because the mapper layer is written to fall back to hard-coded
defaults when a query throws. The site renders; it renders **entirely from defaults**,
not from the database.

### 3.5 Root cause: local SQLite schema is never created

`payload.db` was created by the build (73,728 bytes) but contains only **9 tables**:

```
$ sqlite3 payload.db "select name from sqlite_master where type='table' order by name;"
legal
legal_privacy_sections
legal_terms_sections
navigation
navigation_footer_nav_items
navigation_header_nav_items
services_page
services_page_technology_categories
services_page_technology_categories_items
```

Missing: `homepage`, `about`, `branding`, `posts`, `users`, `media`, `categories`,
`tags`. The count stayed at exactly 9 across both build runs — it does not converge.

The nine tables that do exist are precisely those created by the hand-written DDL in
`lib/ensure-legal-global-sqlite.ts`, `lib/ensure-navigation-global-sqlite.ts`, and
`lib/ensure-services-global-sqlite.ts`. No table is created by Payload itself.

The reason: `payload.config.sqlite.ts:27` reads

```ts
push: process.env.PAYLOAD_DB_PUSH === "true",
```

and `PAYLOAD_DB_PUSH` is **never set to `"true"` anywhere in the repository.** Every
occurrence outside that one comparison assigns `"false"`:

```
$ grep -rn "PAYLOAD_DB_PUSH" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
package.json:7                        PAYLOAD_DB_PUSH=false          (dev script)
payload.config.sqlite.ts:27           === "true"                     (the only reader)
scripts/setup-services-global.mjs:9   = "false"
scripts/seed-blog-production.mjs:31   = "false"
scripts/diagnose-production.mjs:35    = "false"
scripts/setup-navigation-global.mjs:9 = "false"
scripts/reset-production-admin.mjs:29 = "false"
```

`pnpm build` does not set the variable at all, so the comparison is false there too.
**SQLite push is unconditionally disabled, and there is no code path in this repository
that creates the full local schema.** The `lib/ensure-*-sqlite.ts` modules cover only
three globals; the remaining collections and globals have no local DDL.

The practical consequence: a fresh clone cannot produce a working local admin panel or
local content editing, regardless of what the developer does, without work that does
not currently exist in the repo.

---

## 4. `npx tsc --noEmit`

**Command:** `npx tsc --noEmit`
**Outcome:** Failed. Exit code 2.

### 4.1 Exact error count: 25

**25 errors across 17 files.** Established by three independent methods that agree:

1. TypeScript's own summary line, from `npx tsc --noEmit --pretty`:
   ```
   Found 25 errors in 17 files.
   ```
2. Counting diagnostic lines —
   `grep -cE '^[^ ].*\([0-9]+,[0-9]+\): error TS' tsc.txt` → `25`
3. Summing the per-code breakdown in 4.2 → 7+6+5+2+2+1+1+1 = 25

The per-file breakdown in 4.3 also sums to 25.

### 4.2 By category

| Count | Code | Category | Nature of the problem |
|---|---|---|---|
| 7 | TS2307 | **Undeclared dependency** | `Cannot find module '@libsql/client'` |
| 6 | TS2305 | **Missing type exports** | Module `@/lib/payload` has no exported member |
| 5 | TS7006 | **Implicit `any`** | Parameter implicitly has an `any` type |
| 2 | TS18047 | **Null safety** | Value is possibly `null` |
| 2 | TS1378 | **tsconfig misconfiguration** | Top-level `await` not allowed at `target: ES6` |
| 1 | TS2352 | **Unsafe cast** | Insufficiently overlapping type conversion |
| 1 | TS2339 | **Wrong DOM type** | Property does not exist on `HTMLElement` |
| 1 | TS2322 | **Library type mismatch** | Payload `TextField` validate signature |

**TS2307 (7) — `@libsql/client` is used but never declared.** All seven occur at line 3
of the `lib/ensure-*-sqlite.ts` modules, each doing
`import { createClient } from "@libsql/client"`. The package resolves at runtime only
because it arrives transitively via `@payloadcms/db-sqlite`; it is absent from
`package.json` (`grep -c 'libsql' package.json` → `0`). `scripts/migrate-why-choose-cards-sqlite.mjs`
imports it too. This is the single largest category and has one fix.

**TS2305 (6) — types imported that do not exist.** Six components import
`HowItWorksStep`, `ProblemItem`, `ServiceItem`, `SolutionPillar`, `WhoWeHelpPractice`,
and `WhyChooseCard` from `@/lib/payload`. That module exports only two things: the type
`HomepageContent` and the function `getHomepageContent`. None of the six exist.

Of those six components, **only `services-section.tsx` is actually imported** — by
`app/(frontend)/services/page.tsx`. The other five (`how-it-works`, `problem-section`,
`solution-section`, `who-we-help`, `why-choose`) are referenced by nothing:

```
$ grep -rn 'from "@/components/<name>"' app components lib
services-section   → app/(frontend)/services/page.tsx
how-it-works       → (none)
problem-section    → (none)
solution-section   → (none)
who-we-help        → (none)
why-choose         → (none)
```

So 5 of these 6 errors sit in unreferenced code. **Whether those five components are
dead code or unfinished work is a product question, not an implementation detail, and
is not decided here.**

**TS1378 (2) — a one-line tsconfig fix.** `payload.config.ts` uses top-level `await`,
but `tsconfig.json:9` sets `"target": "ES6"`. `"module"` is already `esnext`, so only
the target is out of range; it needs `ES2017` or higher.

### 4.3 By file

Concentration is high: the 7 `lib/ensure-*-sqlite.ts` modules account for 11 of 25
errors (44%), all from two repeated causes.

| Count | File |
|---|---|
| 3 | `components/site-header.tsx` |
| 2 | `payload.config.ts` |
| 2 | `globals/Branding.ts` |
| 2 | `lib/ensure-about-global-sqlite.ts` |
| 2 | `lib/ensure-case-study-highlight-globals-sqlite.ts` |
| 2 | `lib/ensure-homepage-growth-system-sqlite.ts` |
| 2 | `lib/ensure-posts-case-study-sqlite.ts` |
| 1 | `lib/ensure-legal-global-sqlite.ts` |
| 1 | `lib/ensure-navigation-global-sqlite.ts` |
| 1 | `lib/ensure-services-global-sqlite.ts` |
| 1 | `components/blog-rich-text.tsx` |
| 1 | `components/how-it-works.tsx` |
| 1 | `components/problem-section.tsx` |
| 1 | `components/services-section.tsx` |
| 1 | `components/solution-section.tsx` |
| 1 | `components/who-we-help.tsx` |
| 1 | `components/why-choose.tsx` |

### 4.4 The `payload-types.ts` category is empty

This baseline was expected to find a distinct class of errors caused by
`payload-types.ts` being generated, gitignored, and never present in the repository.

**That class produced zero errors.** `payload-types.ts` does not exist
(`ls payload-types.ts` → No such file or directory), but nothing imports it. Its only
reference in the entire codebase is as a generator *output path*:

```
lib/payload-config-base.ts:51:  outputFile: path.resolve(dirname, "..", "payload-types.ts"),
```

Consequently, running `pnpm generate:types` would not reduce the error count, and the
25 errors above are all ordinary type errors. Note that this also means the codebase
derives no type safety from Payload's generated schema types — a separate observation,
not an error.

---

## 5. `pnpm lint`

**Command:** `pnpm lint` (defined as `eslint .`)
**Outcome:** Failed. Exit code 1. Complete output, verbatim:

```
> my-project@0.1.0 lint /Users/winudomlarp/projects/lakeside/v0-lakeside-website-v1
> eslint .

sh: eslint: command not found
 ELIFECYCLE  Command failed.
```

The failure mode is **`command not found`** — the binary does not exist, so eslint never
started and produced no diagnostics of its own.

Both preconditions for that failure were confirmed directly:

- eslint is not installed: `ls -d node_modules/eslint` → No such file or directory.
  It appears in neither `dependencies` nor `devDependencies`.
- No configuration exists: no `eslint.config.*` and no `.eslintrc*` file in the
  repository root.

So adopting lint requires both a dependency and a configuration decision — neither
exists to be repaired. **There is currently no measurable lint baseline**, and the
number of lint violations in this codebase is unknown.

---

## 6. Summary

| Check | Command | Result |
|---|---|---|
| Install | `pnpm install` | **Passes.** 745 packages, 12.7s. Build scripts ran for sharp and esbuild. |
| Build | `pnpm build` | **Passes**, exit 0, 30–40s — but logs ~1,175 lines of DB errors and renders from defaults only. |
| Types | `npx tsc --noEmit` | **Fails**, exit 2. **25 errors in 17 files.** Not enforced at build time. |
| Lint | `pnpm lint` | **Fails**, exit 1. eslint not installed, no config. No baseline obtainable. |
| Tests | — | **None exist.** No test runner and no test files in the repository. |

### What could not be measured

Stated plainly, so later work does not build on a false premise:

1. **Peer dependency warnings.** The lockfile was current, so pnpm skipped resolution
   and never recomputed them. Absence of warnings is not evidence of absence of
   problems. (§2.2)
2. **Webpack compile warnings.** Next.js printed `⚠ Compiled with warnings` without
   emitting any detail, so their number and content are unknown. (§3.2)
3. **Lint violations.** Unknowable until eslint and a config exist. (§5)
4. **Runtime behaviour beyond build.** `pnpm start` and `/admin` were not exercised.
   Given §3.5, the admin panel is unlikely to function locally, but that is a
   prediction, not a measurement.

### Reproducing this

```bash
corepack prepare pnpm@10 --activate && corepack enable pnpm
# .env must exist with PAYLOAD_SECRET and DATABASE_URL
pnpm install
pnpm build
npx tsc --noEmit
pnpm lint
```

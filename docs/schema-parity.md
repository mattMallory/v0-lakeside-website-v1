# Schema parity between local SQLite and production Postgres

This repository maintains two databases with different schema sources:

| | Local | Production |
|---|---|---|
| Engine | SQLite (`payload.db`) | Vercel Postgres |
| Config | `payload.config.sqlite.ts` | `payload.config.postgres.ts` |
| Schema comes from | Payload push, generated from the Payload config | hand-written migrations in `migrations/` |

Nothing reconciles the two automatically. A field added to the config reaches local
immediately and production never, until someone writes the migration. That asymmetry is
the thing to watch.

---

## How the local schema is created

`payload.config.sqlite.ts` sets `push: process.env.PAYLOAD_DB_PUSH !== "false"`, so push is
**on by default**. Payload generates the entire local schema — currently 37 tables — from
the config on boot.

Nothing else creates local tables. There is no hand-written SQLite DDL, by design: see
*Why push rather than hand-written DDL* below.

**A fresh clone needs no schema step.** Create a `.env` with `PAYLOAD_SECRET` and
`DATABASE_URL=file:./payload.db`, then `pnpm dev` or `pnpm build`. The database is built on
first boot and seeded by `onInit`.

### If push asks a question

Push prints a `(y/N)` prompt before anything it considers destructive — dropping a column,
for example. A non-interactive process (a build, a script, CI) has no terminal to answer on
and **will wait forever rather than fail**. If a boot hangs after
`Pulling schema from database...`, that is what happened.

The fix is almost always to delete the local database and let push rebuild it:

```bash
rm payload.db && pnpm dev
```

Local SQLite holds only seeded content, so this costs nothing. Set `PAYLOAD_DB_PUSH=false`
to skip push entirely if you need to boot against a database you do not want touched.

---

## The parity check

```bash
pnpm check:schema-parity
```

It needs **no database credential**. It builds a throwaway SQLite schema from the Payload
config in a temp directory, reads `migrations/*.ts` as text, and compares the two. Exit 0
means they agree.

The two directions are not equally serious, and the check treats them differently:

- **Missing from production** — the config declares a table or column, no migration creates
  it. Production will fail a query that works locally. **This fails the check.**
- **Orphaned in production** — a migration created it, the config no longer declares it.
  Dead weight that nothing reads. Reported but does not fail, so a real breakage is never
  buried under pre-existing cleanup debt.

### Current state

At the time of writing: **0 missing, 42 orphaned.** Everything the application queries
exists in production. The 42 orphans are the pre-growth-system homepage design — six tables
(`homepage_problem_items`, `homepage_solution_pillars`, `homepage_how_it_works_steps`,
`homepage_services_items`, `homepage_who_we_help_practices`, `homepage_why_choose_cards`)
and roughly 36 columns on `homepage`, including `template`.

Those are safe to leave. Removing them means writing a migration that drops production
columns, which is a data decision, not a cleanup.

---

## Reproducing the parity check by hand

If you want to verify the tooling rather than trust it:

```bash
# 1. Build a local schema from nothing
rm -f payload.db
pnpm build                     # or: pnpm dev, then stop it once it boots

# 2. Every table the config declares
sqlite3 payload.db "select name from sqlite_master where type='table' \
  and name not like 'sqlite_%' order by name"

# 3. Columns of any one table
sqlite3 payload.db "select name from pragma_table_info('homepage')"

# 4. What production has, from the migration text
grep -hoE 'ALTER TABLE "[^"]+" ADD COLUMN( IF NOT EXISTS)? "[^"]+"' migrations/*.ts
grep -hoE 'CREATE TABLE( IF NOT EXISTS)? "[^"]+"' migrations/*.ts
```

A table or column present in step 2 but absent from step 4 is a missing migration.

### Confirming every global and collection actually loads

Table existence is not the same as usability. This boots Payload and queries each one:

```bash
node --env-file=.env --import tsx -e '
const { default: config } = await import("@payload-config")
const { getPayload } = await import("payload")
const payload = await getPayload({ config })
for (const slug of ["branding","homepage","about","services-page","legal","navigation"])
  await payload.findGlobal({ slug, depth: 0 }).then(() => console.log("OK   ", slug),
    (e) => console.log("FAIL ", slug, e.message.split("\n")[0]))
for (const slug of ["users","media","categories","tags","posts"])
  await payload.find({ collection: slug, limit: 1, depth: 0 }).then((r) => console.log("OK   ", slug, r.totalDocs, "docs"),
    (e) => console.log("FAIL ", slug, e.message.split("\n")[0]))
process.exit(0)'
```

All six globals and all five collections should report `OK`.

---

## Making a schema change

Both edits are required. Skipping either breaks one environment silently.

1. **Change the Payload config** — the collection or global under `collections/`,
   `globals/`, or `fields/`. Local picks it up on the next boot through push.
2. **Write the Postgres migration** — `pnpm migrate:create:vercel`, then register it in
   `migrations/index.ts`.
3. **Run `pnpm check:schema-parity`** — it fails if step 2 was forgotten.
4. **Run `pnpm generate:types`** if field shapes changed; `pnpm build` verifies this.

---

## Why push rather than hand-written DDL

The local schema used to be built by seven `lib/ensure-*-sqlite.ts` modules containing
hand-written `CREATE TABLE` and `ALTER TABLE` statements. That approach was removed rather
than extended, for reasons that were measured rather than assumed:

- **It never worked.** Push was disabled and those modules covered only three globals, so a
  fresh clone got 9 of 37 tables. `posts`, `users`, `media`, `categories`, `tags`,
  `homepage`, `about`, and `branding` did not exist. The site rendered only because every
  mapper falls back to hardcoded defaults.
- **It could not add columns to an existing database.**
  `lib/ensure-services-global-sqlite.ts` returned early when the table already existed, so a
  developer who already had a `payload.db` never received a new column, silently.
- **It actively broke push.** Those modules added a `homepage.template` column that the
  Payload config does not declare. On the next boot push saw a column it did not recognise,
  tried to drop it, and blocked on the data-loss prompt — hanging the boot indefinitely.
- **It could only ever match by coincidence.** Keeping hand-written DDL correct for 37
  tables means reimplementing Payload's schema generation by hand, forever.

Push derives the schema from the config, so local and the config agree by construction. The
remaining risk is the config drifting from the Postgres migrations, which is exactly what
`pnpm check:schema-parity` measures.

---

## Recommended next step: catch drift automatically

`pnpm check:schema-parity` is a manual command. It only helps when someone runs it. Two
options, cheapest first:

1. **Add it to the build.** `pnpm build` already verifies `payload-types.ts` via
   `scripts/check-payload-types.mjs`. Adding the parity check beside it costs one SQLite
   build (a few seconds) and makes a missing migration fail the build. This is the smallest
   change with most of the benefit.
2. **Add it to CI on pull requests.** Better signal — the failure lands in review, where the
   migration should have been written — but requires CI that runs the suite.

Either way the check needs no credential, so it can run anywhere.

A third option, verifying against the real Postgres schema rather than the migration text,
would catch drift introduced outside migrations (a manual `ALTER TABLE` in the Vercel
console, say). That needs a production connection string and is a bigger decision; the
text-based check covers the failure mode this repository actually has.

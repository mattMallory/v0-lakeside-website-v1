import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

// The logo height control had no effect: both the header and the footer hardcoded 34px.
// Now that they read the stored value, a row still holding the old default of 44 would
// render a logo 10px taller than the site has ever shown. This brings those rows, and the
// column default behind them, to the height the site actually renders.
//
// Scoped to rows still holding 44. A height someone deliberately chose is their decision
// and survives untouched.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" ALTER COLUMN "logo_height" SET DEFAULT 34;
  UPDATE "branding" SET "logo_height" = 34 WHERE "logo_height" = 44;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" ALTER COLUMN "logo_height" SET DEFAULT 44;
  UPDATE "branding" SET "logo_height" = 44 WHERE "logo_height" = 34;`)
}

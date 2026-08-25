import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line_1" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line_2" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_phone" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_email" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_address_line_1";
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_address_line_2";
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_phone";
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_email";`)
}

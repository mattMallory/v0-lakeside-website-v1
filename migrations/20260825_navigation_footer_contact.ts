import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Payload toSnakeCase: footerAddressLine1 → footer_address_line1 (no underscore before digit)
  await db.execute(sql`
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line1" varchar;`)
  await db.execute(sql`
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line2" varchar;`)
  await db.execute(sql`
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_phone" varchar;`)
  await db.execute(sql`
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_email" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_address_line1";`)
  await db.execute(sql`
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_address_line2";`)
  await db.execute(sql`
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_phone";`)
  await db.execute(sql`
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "footer_email";`)
}

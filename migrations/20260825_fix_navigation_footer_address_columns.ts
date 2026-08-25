import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

/**
 * Payload/drizzle toSnakeCase("footerAddressLine1") → "footer_address_line1"
 * (no underscore before the digit). An earlier migration created
 * "footer_address_line_1" which broke /api/globals/navigation.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line_1'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line1'
    ) THEN
      ALTER TABLE "navigation" RENAME COLUMN "footer_address_line_1" TO "footer_address_line1";
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line_2'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line2'
    ) THEN
      ALTER TABLE "navigation" RENAME COLUMN "footer_address_line_2" TO "footer_address_line2";
    END IF;
  END $$;

  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line1" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_address_line2" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_phone" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "footer_email" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line1'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line_1'
    ) THEN
      ALTER TABLE "navigation" RENAME COLUMN "footer_address_line1" TO "footer_address_line_1";
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line2'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'navigation' AND column_name = 'footer_address_line_2'
    ) THEN
      ALTER TABLE "navigation" RENAME COLUMN "footer_address_line2" TO "footer_address_line_2";
    END IF;
  END $$;`)
}

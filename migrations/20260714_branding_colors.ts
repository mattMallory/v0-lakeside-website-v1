import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Additive branding color columns for any environment that got a partial branding table. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "icon_color" varchar DEFAULT '#3B6FD8';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "button_color" varchar DEFAULT '#3B6FD8';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "button_text_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "secondary_button_color" varchar DEFAULT '#3B6FD8';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "secondary_button_text_color" varchar DEFAULT '#3B6FD8';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT '#F7F9FC';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "heading_color" varchar DEFAULT '#1B2433';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "text_color" varchar DEFAULT '#1B2433';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "muted_text_color" varchar DEFAULT '#6B7A90';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "border_color" varchar DEFAULT '#D9E1EE';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "focus_ring_color" varchar DEFAULT '#3B6FD8';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "icon_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "button_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "button_text_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "secondary_button_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "secondary_button_text_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "text_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "muted_text_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "border_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "focus_ring_color";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "image_alt" varchar;

  UPDATE "homepage_why_choose_cards"
  SET "image_alt" = "base_alt"
  WHERE "image_alt" IS NULL AND "base_alt" IS NOT NULL;

  DO $$ BEGIN
    ALTER TABLE "homepage_why_choose_cards" ADD CONSTRAINT "homepage_why_choose_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "homepage_why_choose_cards_image_idx" ON "homepage_why_choose_cards" USING btree ("image_id");

  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "base_image";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "base_alt";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "overlay_image";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "overlay_alt";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "overlay_width_class";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "overlay_position_class_mobile";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "overlay_position_class";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "base_image" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "base_alt" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "overlay_image" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "overlay_alt" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "overlay_width_class" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "overlay_position_class_mobile" varchar;
  ALTER TABLE "homepage_why_choose_cards" ADD COLUMN IF NOT EXISTS "overlay_position_class" varchar;

  UPDATE "homepage_why_choose_cards"
  SET "base_alt" = "image_alt"
  WHERE "base_alt" IS NULL AND "image_alt" IS NOT NULL;

  ALTER TABLE "homepage_why_choose_cards" DROP CONSTRAINT IF EXISTS "homepage_why_choose_cards_image_id_media_id_fk";
  DROP INDEX IF EXISTS "homepage_why_choose_cards_image_idx";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "homepage_why_choose_cards" DROP COLUMN IF EXISTS "image_alt";`)
}

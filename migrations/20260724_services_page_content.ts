import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_services_page_offerings_items_icon" AS ENUM(
      'line-chart',
      'trending-down',
      'compass',
      'bar-chart-3',
      'megaphone',
      'layout-template',
      'users',
      'gauge',
      'activity',
      'bone',
      'flask-conical',
      'leaf',
      'heart-pulse',
      'sparkles',
      'zap',
      'palette',
      'database'
    );
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_eyebrow" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_description" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "offerings_eyebrow" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "offerings_headline" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_eyebrow" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_headline" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_description" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_cta" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_image_id" integer;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_image_alt" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "cta_headline" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "cta_subheadline" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "cta_button" varchar;

  CREATE TABLE IF NOT EXISTS "services_page_offerings_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" "enum_services_page_offerings_items_icon" NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "services_page_offerings_items" ADD CONSTRAINT "services_page_offerings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "services_page" ADD CONSTRAINT "services_page_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "services_page_offerings_items_order_idx" ON "services_page_offerings_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_page_offerings_items_parent_id_idx" ON "services_page_offerings_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_page_about_image_idx" ON "services_page" USING btree ("about_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "services_page" DROP CONSTRAINT IF EXISTS "services_page_about_image_id_media_id_fk";
  DROP TABLE IF EXISTS "services_page_offerings_items";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "hero_eyebrow";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "hero_title";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "hero_description";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "offerings_eyebrow";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "offerings_headline";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_eyebrow";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_headline";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_description";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_cta";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_image_id";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_image_alt";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "cta_headline";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "cta_subheadline";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "cta_button";
  DROP TYPE IF EXISTS "public"."enum_services_page_offerings_items_icon";`)
}

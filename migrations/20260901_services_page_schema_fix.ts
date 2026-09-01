import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services_page'
    ) THEN
      ALTER TABLE "services" RENAME TO "services_page";
    END IF;
  END $$;

  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services_technology_categories'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services_page_technology_categories'
    ) THEN
      ALTER TABLE "services_technology_categories" RENAME TO "services_page_technology_categories";
    END IF;
  END $$;

  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services_technology_categories_items'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'services_page_technology_categories_items'
    ) THEN
      ALTER TABLE "services_technology_categories_items" RENAME TO "services_page_technology_categories_items";
    END IF;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_services_page_technology_categories_icon" AS ENUM(
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
      'database',
      'map-pin',
      'circle-dollar-sign',
      'eye',
      'monitor',
      'message-square',
      'signpost'
    );
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_page_offerings_items_icon') THEN
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'map-pin';
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'circle-dollar-sign';
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'eye';
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'monitor';
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'message-square';
      ALTER TYPE "public"."enum_services_page_offerings_items_icon" ADD VALUE IF NOT EXISTS 'signpost';
    END IF;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "services_page_technology_categories"
    ADD COLUMN IF NOT EXISTS "icon" "enum_services_page_technology_categories_icon";

  UPDATE "services_page_technology_categories"
  SET "icon" = 'database'
  WHERE "icon" IS NULL;

  ALTER TABLE "services_page_technology_categories"
    ALTER COLUMN "image_alt" DROP NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "services_page_technology_categories" DROP COLUMN IF EXISTS "icon";
  DROP TYPE IF EXISTS "public"."enum_services_page_technology_categories_icon";`)
}

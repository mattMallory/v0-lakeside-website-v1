import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "services_page" (
    "id" serial PRIMARY KEY NOT NULL,
    "technology_eyebrow" varchar,
    "technology_headline" varchar,
    "technology_description" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "services_page_technology_categories" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer,
    "image_alt" varchar NOT NULL,
    "title" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "services_page_technology_categories_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "services_page_technology_categories" ADD CONSTRAINT "services_page_technology_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "services_page_technology_categories" ADD CONSTRAINT "services_page_technology_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "services_page_technology_categories_items" ADD CONSTRAINT "services_page_technology_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_technology_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "services_page_technology_categories_order_idx" ON "services_page_technology_categories" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_page_technology_categories_parent_id_idx" ON "services_page_technology_categories" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_page_technology_categories_image_idx" ON "services_page_technology_categories" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_page_technology_categories_items_order_idx" ON "services_page_technology_categories_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_page_technology_categories_items_parent_id_idx" ON "services_page_technology_categories_items" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "services_page_technology_categories_items";
  DROP TABLE IF EXISTS "services_page_technology_categories";
  DROP TABLE IF EXISTS "services_page";`)
}

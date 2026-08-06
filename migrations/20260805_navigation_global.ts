import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "navigation" (
    "id" serial PRIMARY KEY NOT NULL,
    "header_cta_label" varchar,
    "header_cta_href" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "navigation_header_nav_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "href" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "navigation_footer_nav_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "href" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "navigation_header_nav_items" ADD CONSTRAINT "navigation_header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "navigation_footer_nav_items" ADD CONSTRAINT "navigation_footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "navigation_header_nav_items_order_idx" ON "navigation_header_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_header_nav_items_parent_id_idx" ON "navigation_header_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "navigation_footer_nav_items_order_idx" ON "navigation_footer_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_footer_nav_items_parent_id_idx" ON "navigation_footer_nav_items" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "navigation_footer_nav_items";
  DROP TABLE IF EXISTS "navigation_header_nav_items";
  DROP TABLE IF EXISTS "navigation";`)
}

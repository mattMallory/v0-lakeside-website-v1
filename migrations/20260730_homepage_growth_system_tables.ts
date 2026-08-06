import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

/**
 * Repair migration: production marked 20260731_homepage_growth_system complete
 * without creating homepage_gs_* child tables. Re-applies table/FK/index DDL safely.
 *
 * Named 20260730_* so Payload's alphabetical file sort runs this before 20260731_funnel_step_images.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "homepage_gs_hero_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_who_criteria" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" "enum_homepage_problem_items_icon" NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_funnel_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "tag" varchar NOT NULL,
    "title" varchar NOT NULL,
    "detail" varchar NOT NULL,
    "button_label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_pillars" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" "enum_homepage_problem_items_icon" NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_included_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar NOT NULL,
    "name" varchar NOT NULL,
    "practice" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_team_members" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "photo_id" integer,
    "photo_url" varchar,
    "photo_alt" varchar NOT NULL,
    "name" varchar NOT NULL,
    "role" varchar NOT NULL,
    "bio" varchar NOT NULL,
    "linkedin_url" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_gs_next_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "homepage_gs_hero_stats" ADD CONSTRAINT "homepage_gs_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_who_criteria" ADD CONSTRAINT "homepage_gs_who_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_funnel_steps" ADD CONSTRAINT "homepage_gs_funnel_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_pillars" ADD CONSTRAINT "homepage_gs_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_included_items" ADD CONSTRAINT "homepage_gs_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_testimonials" ADD CONSTRAINT "homepage_gs_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_team_members" ADD CONSTRAINT "homepage_gs_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_team_members" ADD CONSTRAINT "homepage_gs_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_gs_next_steps" ADD CONSTRAINT "homepage_gs_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "homepage_gs_hero_stats_order_idx" ON "homepage_gs_hero_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_hero_stats_parent_id_idx" ON "homepage_gs_hero_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_who_criteria_order_idx" ON "homepage_gs_who_criteria" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_who_criteria_parent_id_idx" ON "homepage_gs_who_criteria" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_funnel_steps_order_idx" ON "homepage_gs_funnel_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_funnel_steps_parent_id_idx" ON "homepage_gs_funnel_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_pillars_order_idx" ON "homepage_gs_pillars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_pillars_parent_id_idx" ON "homepage_gs_pillars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_included_items_order_idx" ON "homepage_gs_included_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_included_items_parent_id_idx" ON "homepage_gs_included_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_testimonials_order_idx" ON "homepage_gs_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_testimonials_parent_id_idx" ON "homepage_gs_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_team_members_order_idx" ON "homepage_gs_team_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_team_members_parent_id_idx" ON "homepage_gs_team_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_team_members_photo_idx" ON "homepage_gs_team_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "homepage_gs_next_steps_order_idx" ON "homepage_gs_next_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_gs_next_steps_parent_id_idx" ON "homepage_gs_next_steps" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "homepage_gs_next_steps";
  DROP TABLE IF EXISTS "homepage_gs_team_members";
  DROP TABLE IF EXISTS "homepage_gs_testimonials";
  DROP TABLE IF EXISTS "homepage_gs_included_items";
  DROP TABLE IF EXISTS "homepage_gs_pillars";
  DROP TABLE IF EXISTS "homepage_gs_funnel_steps";
  DROP TABLE IF EXISTS "homepage_gs_who_criteria";
  DROP TABLE IF EXISTS "homepage_gs_hero_stats";`)
}

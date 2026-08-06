import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_homepage_template" AS ENUM('default', 'growth-system');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "template" "enum_homepage_template" DEFAULT 'default' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_headline_accent" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_subheadline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_primary_cta" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_hero_secondary_cta" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_who_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_who_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_who_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_who_disqualifier" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_funnel_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_funnel_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_funnel_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_funnel_link_label" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_funnel_link_url" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_pillars_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_pillars_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_pillars_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_included_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_included_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_included_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_results_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_results_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_results_placeholder" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_placeholder" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_articles_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_articles_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_articles_link_label" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_next_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_next_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_audit_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_audit_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_audit_button_label" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_audit_button_url" varchar;

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
  DROP TABLE IF EXISTS "homepage_gs_hero_stats";

  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "template";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_headline_accent";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_subheadline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_primary_cta";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_hero_secondary_cta";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_who_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_who_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_who_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_who_disqualifier";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_funnel_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_funnel_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_funnel_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_funnel_link_label";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_funnel_link_url";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_pillars_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_pillars_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_pillars_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_included_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_included_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_included_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_results_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_results_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_results_placeholder";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_placeholder";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_articles_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_articles_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_articles_link_label";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_next_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_next_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_audit_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_audit_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_audit_button_label";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_audit_button_url";

  DROP TYPE IF EXISTS "public"."enum_homepage_template";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_name" varchar;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_location" varchar;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "post_type" varchar DEFAULT 'article';

  CREATE TABLE IF NOT EXISTS "posts_case_study_metrics" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar NOT NULL,
    "value" numeric,
    "prefix" varchar,
    "suffix" varchar,
    "decimals" numeric DEFAULT 0,
    "display_value" varchar,
    "description" varchar NOT NULL,
    "is_highlighted" boolean DEFAULT false,
    "highlight_label" varchar DEFAULT 'Featured Result',
    "span_full" boolean DEFAULT false
  );

  DO $$ BEGIN
    ALTER TABLE "posts_case_study_metrics" ADD CONSTRAINT "posts_case_study_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "case_study_eyebrow" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "case_study_headline" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "case_study_featured_post_id" integer;

  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_case_study_featured_post_id_posts_id_fk" FOREIGN KEY ("case_study_featured_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "posts_case_study_metrics_order_idx" ON "posts_case_study_metrics" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "posts_case_study_metrics_parent_id_idx" ON "posts_case_study_metrics" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_case_study_featured_post_idx" ON "homepage" USING btree ("case_study_featured_post_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_case_study_featured_post_id_posts_id_fk";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "case_study_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "case_study_headline";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "case_study_featured_post_id";
  DROP TABLE IF EXISTS "posts_case_study_metrics";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_name";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_location";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "post_type";`)
}

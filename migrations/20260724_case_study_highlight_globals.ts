import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "case_study_eyebrow" varchar;
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "case_study_headline" varchar;
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "case_study_featured_post_id" integer;

  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "case_study_eyebrow" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "case_study_headline" varchar;
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "case_study_featured_post_id" integer;

  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_case_study_featured_post_id_posts_id_fk" FOREIGN KEY ("case_study_featured_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "services_page" ADD CONSTRAINT "services_page_case_study_featured_post_id_posts_id_fk" FOREIGN KEY ("case_study_featured_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "about_case_study_featured_post_idx" ON "about" USING btree ("case_study_featured_post_id");
  CREATE INDEX IF NOT EXISTS "services_page_case_study_featured_post_idx" ON "services_page" USING btree ("case_study_featured_post_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_case_study_featured_post_id_posts_id_fk";
  ALTER TABLE "services_page" DROP CONSTRAINT IF EXISTS "services_page_case_study_featured_post_id_posts_id_fk";

  ALTER TABLE "about" DROP COLUMN IF EXISTS "case_study_eyebrow";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "case_study_headline";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "case_study_featured_post_id";

  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "case_study_eyebrow";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "case_study_headline";
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "case_study_featured_post_id";`)
}

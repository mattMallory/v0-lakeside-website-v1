import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "hero_background_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "vision_mission_background_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "case_study_background_id" integer;`)

  await db.execute(sql`
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_background_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "about_background_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "case_study_background_id" integer;`)

  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "case_study_background_id" integer;`)

  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_hero_background_id_media_id_fk"
      FOREIGN KEY ("hero_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_vision_mission_background_id_media_id_fk"
      FOREIGN KEY ("vision_mission_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_case_study_background_id_media_id_fk"
      FOREIGN KEY ("case_study_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_background_id_media_id_fk"
      FOREIGN KEY ("hero_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "services_page" ADD CONSTRAINT "services_page_about_background_id_media_id_fk"
      FOREIGN KEY ("about_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "services_page" ADD CONSTRAINT "services_page_case_study_background_id_media_id_fk"
      FOREIGN KEY ("case_study_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_case_study_background_id_media_id_fk"
      FOREIGN KEY ("case_study_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "about_hero_background_idx" ON "about" USING btree ("hero_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "about_vision_mission_background_idx" ON "about" USING btree ("vision_mission_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "about_case_study_background_idx" ON "about" USING btree ("case_study_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "services_page_hero_background_idx" ON "services_page" USING btree ("hero_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "services_page_about_background_idx" ON "services_page" USING btree ("about_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "services_page_case_study_background_idx" ON "services_page" USING btree ("case_study_background_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "homepage_case_study_background_idx" ON "homepage" USING btree ("case_study_background_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_hero_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_vision_mission_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_case_study_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP CONSTRAINT IF EXISTS "services_page_hero_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP CONSTRAINT IF EXISTS "services_page_about_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP CONSTRAINT IF EXISTS "services_page_case_study_background_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_case_study_background_id_media_id_fk";`)

  await db.execute(sql`
  DROP INDEX IF EXISTS "about_hero_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "about_vision_mission_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "about_case_study_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "services_page_hero_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "services_page_about_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "services_page_case_study_background_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "homepage_case_study_background_idx";`)

  await db.execute(sql`
  ALTER TABLE "about" DROP COLUMN IF EXISTS "hero_background_id";`)
  await db.execute(sql`
  ALTER TABLE "about" DROP COLUMN IF EXISTS "vision_mission_background_id";`)
  await db.execute(sql`
  ALTER TABLE "about" DROP COLUMN IF EXISTS "case_study_background_id";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "hero_background_id";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "about_background_id";`)
  await db.execute(sql`
  ALTER TABLE "services_page" DROP COLUMN IF EXISTS "case_study_background_id";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "case_study_background_id";`)
}

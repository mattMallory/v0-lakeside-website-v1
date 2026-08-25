import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_bg_hero_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_bg_who_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_bg_pillars_id" integer;`)
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_bg_included_id" integer;`)

  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gs_bg_hero_id_media_id_fk"
      FOREIGN KEY ("gs_bg_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gs_bg_who_id_media_id_fk"
      FOREIGN KEY ("gs_bg_who_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gs_bg_pillars_id_media_id_fk"
      FOREIGN KEY ("gs_bg_pillars_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gs_bg_included_id_media_id_fk"
      FOREIGN KEY ("gs_bg_included_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "homepage_gs_bg_hero_idx" ON "homepage" USING btree ("gs_bg_hero_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "homepage_gs_bg_who_idx" ON "homepage" USING btree ("gs_bg_who_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "homepage_gs_bg_pillars_idx" ON "homepage" USING btree ("gs_bg_pillars_id");`)
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "homepage_gs_bg_included_idx" ON "homepage" USING btree ("gs_bg_included_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_gs_bg_hero_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_gs_bg_who_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_gs_bg_pillars_id_media_id_fk";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_gs_bg_included_id_media_id_fk";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "homepage_gs_bg_hero_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "homepage_gs_bg_who_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "homepage_gs_bg_pillars_idx";`)
  await db.execute(sql`
  DROP INDEX IF EXISTS "homepage_gs_bg_included_idx";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_bg_hero_id";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_bg_who_id";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_bg_pillars_id";`)
  await db.execute(sql`
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_bg_included_id";`)
}

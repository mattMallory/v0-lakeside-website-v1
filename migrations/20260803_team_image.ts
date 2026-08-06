import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_image_url" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gs_team_image_alt" varchar;

  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_gs_team_image_id_media_id_fk" FOREIGN KEY ("gs_team_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "homepage_gs_team_image_idx" ON "homepage" USING btree ("gs_team_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_gs_team_image_id_media_id_fk";
  DROP INDEX IF EXISTS "homepage_gs_team_image_idx";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_image_id";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_image_url";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gs_team_image_alt";`)
}

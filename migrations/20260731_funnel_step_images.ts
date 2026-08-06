import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_gs_funnel_steps" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "homepage_gs_funnel_steps" ADD COLUMN IF NOT EXISTS "image_url" varchar;
  ALTER TABLE "homepage_gs_funnel_steps" ADD COLUMN IF NOT EXISTS "image_alt" varchar;

  DO $$ BEGIN
    ALTER TABLE "homepage_gs_funnel_steps" ADD CONSTRAINT "homepage_gs_funnel_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "homepage_gs_funnel_steps_image_idx" ON "homepage_gs_funnel_steps" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_gs_funnel_steps" DROP CONSTRAINT IF EXISTS "homepage_gs_funnel_steps_image_id_media_id_fk";
  DROP INDEX IF EXISTS "homepage_gs_funnel_steps_image_idx";
  ALTER TABLE "homepage_gs_funnel_steps" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "homepage_gs_funnel_steps" DROP COLUMN IF EXISTS "image_url";
  ALTER TABLE "homepage_gs_funnel_steps" DROP COLUMN IF EXISTS "image_alt";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_gs_testimonials" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "homepage_gs_testimonials" ADD COLUMN IF NOT EXISTS "photo_url" varchar;
  ALTER TABLE "homepage_gs_testimonials" ADD COLUMN IF NOT EXISTS "photo_alt" varchar;

  DO $$ BEGIN
    ALTER TABLE "homepage_gs_testimonials" ADD CONSTRAINT "homepage_gs_testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "homepage_gs_testimonials_photo_idx" ON "homepage_gs_testimonials" USING btree ("photo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage_gs_testimonials" DROP CONSTRAINT IF EXISTS "homepage_gs_testimonials_photo_id_media_id_fk";
  DROP INDEX IF EXISTS "homepage_gs_testimonials_photo_idx";
  ALTER TABLE "homepage_gs_testimonials" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "homepage_gs_testimonials" DROP COLUMN IF EXISTS "photo_url";
  ALTER TABLE "homepage_gs_testimonials" DROP COLUMN IF EXISTS "photo_alt";`)
}

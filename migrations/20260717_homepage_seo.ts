import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;

  DO $$ BEGIN
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "homepage_meta_meta_image_idx" ON "homepage" USING btree ("meta_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_meta_image_id_media_id_fk";
  DROP INDEX IF EXISTS "homepage_meta_meta_image_idx";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_title";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_description";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_image_id";`)
}

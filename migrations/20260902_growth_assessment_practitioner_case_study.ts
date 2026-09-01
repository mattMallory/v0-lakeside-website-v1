import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "growth_assessment_practitioners"
    ADD COLUMN IF NOT EXISTS "case_study_url" varchar;
  ALTER TABLE "growth_assessment_practitioners"
    ADD COLUMN IF NOT EXISTS "case_study_label" varchar;

  UPDATE "growth_assessment_practitioners"
  SET
    "case_study_url" = '/blog/tuscola-pain-wellness-center-case-study',
    "case_study_label" = 'Read case study'
  WHERE "name" ILIKE '%Bill Hemmer%'
    AND ("case_study_url" IS NULL OR "case_study_url" = '');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "growth_assessment_practitioners" DROP COLUMN IF EXISTS "case_study_url";
  ALTER TABLE "growth_assessment_practitioners" DROP COLUMN IF EXISTS "case_study_label";`)
}

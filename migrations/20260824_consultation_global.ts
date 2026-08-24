import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "consultation" (
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar DEFAULT 'Get Started',
    "title" varchar DEFAULT 'Let''s Grow Your Practice',
    "description" varchar,
    "seo_title" varchar DEFAULT 'Schedule a Consultation | Lakeside',
    "seo_description" varchar,
    "sms_non_marketing_consent_label" varchar,
    "sms_marketing_consent_label" varchar,
    "privacy_link_label" varchar DEFAULT 'Privacy Policy',
    "terms_link_label" varchar DEFAULT 'Terms and Conditions',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );`)

  // If the table already existed from an earlier draft of this migration, add missing columns.
  await db.execute(sql`
  ALTER TABLE "consultation" ADD COLUMN IF NOT EXISTS "sms_non_marketing_consent_label" varchar;
  ALTER TABLE "consultation" ADD COLUMN IF NOT EXISTS "sms_marketing_consent_label" varchar;
  ALTER TABLE "consultation" ADD COLUMN IF NOT EXISTS "privacy_link_label" varchar DEFAULT 'Privacy Policy';
  ALTER TABLE "consultation" ADD COLUMN IF NOT EXISTS "terms_link_label" varchar DEFAULT 'Terms and Conditions';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "consultation";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "demo_system" (
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar DEFAULT 'Demo The System',
    "title" varchar DEFAULT 'Coming soon',
    "description" varchar,
    "form_title" varchar DEFAULT 'Get early access',
    "form_description" varchar,
    "form_button_label" varchar DEFAULT 'Join the list',
    "success_title" varchar DEFAULT 'You''re on the list.',
    "success_message" varchar,
    "seo_title" varchar DEFAULT 'Demo The System | Lakeside',
    "seo_description" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "demo_system";`)
}

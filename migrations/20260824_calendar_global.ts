import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "calendar" (
    "id" serial PRIMARY KEY NOT NULL,
    "eyebrow" varchar DEFAULT 'Schedule',
    "title" varchar DEFAULT 'Book a time that works for you',
    "description" varchar,
    "embed_code" varchar,
    "seo_title" varchar DEFAULT 'Schedule | Lakeside',
    "seo_description" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "calendar";`)
}

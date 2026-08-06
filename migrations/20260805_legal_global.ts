import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "legal" (
    "id" serial PRIMARY KEY NOT NULL,
    "privacy_eyebrow" varchar,
    "privacy_title" varchar,
    "privacy_last_updated" varchar,
    "privacy_intro" varchar,
    "privacy_seo_title" varchar,
    "privacy_seo_description" varchar,
    "terms_eyebrow" varchar,
    "terms_title" varchar,
    "terms_last_updated" varchar,
    "terms_intro" varchar,
    "terms_seo_title" varchar,
    "terms_seo_description" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "legal_privacy_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "legal_terms_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "body" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "legal_privacy_sections" ADD CONSTRAINT "legal_privacy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "legal_terms_sections" ADD CONSTRAINT "legal_terms_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "legal_privacy_sections_order_idx" ON "legal_privacy_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "legal_privacy_sections_parent_id_idx" ON "legal_privacy_sections" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "legal_terms_sections_order_idx" ON "legal_terms_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "legal_terms_sections_parent_id_idx" ON "legal_terms_sections" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "legal_terms_sections";
  DROP TABLE IF EXISTS "legal_privacy_sections";
  DROP TABLE IF EXISTS "legal";`)
}

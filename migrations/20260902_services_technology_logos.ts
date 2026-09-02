import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_services_page_technology_logos_logo_id" AS ENUM(
      'google',
      'youtube',
      'meta',
      'microsoft',
      'highlevel',
      'payload'
    );
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "services_page_technology_logos" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "logo_id" "enum_services_page_technology_logos_logo_id" NOT NULL,
    "name" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "services_page_technology_logos"
      ADD CONSTRAINT "services_page_technology_logos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id")
      ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "services_page_technology_logos_order_idx"
    ON "services_page_technology_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_page_technology_logos_parent_id_idx"
    ON "services_page_technology_logos" USING btree ("_parent_id");

  INSERT INTO "services_page_technology_logos" ("_order", "_parent_id", "id", "logo_id", "name")
  SELECT
    logos.ord,
    sp.id,
    md5(random()::text || clock_timestamp()::text || logos.ord::text),
    logos.logo_id::"enum_services_page_technology_logos_logo_id",
    logos.name
  FROM "services_page" sp
  CROSS JOIN (
    VALUES
      (1, 'google', 'Google'),
      (2, 'youtube', 'YouTube'),
      (3, 'meta', 'Meta'),
      (4, 'microsoft', 'Microsoft'),
      (5, 'highlevel', 'Go High Level'),
      (6, 'payload', 'Payload')
  ) AS logos(ord, logo_id, name)
  WHERE NOT EXISTS (
    SELECT 1 FROM "services_page_technology_logos" existing
    WHERE existing."_parent_id" = sp.id
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "services_page_technology_logos";
  DROP TYPE IF EXISTS "public"."enum_services_page_technology_logos_logo_id";`)
}

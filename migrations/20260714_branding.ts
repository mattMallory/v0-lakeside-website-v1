import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Full Branding global schema for production Postgres.
 * Safe to re-run column adds via IF NOT EXISTS in the companion colors migration
 * for environments that received an earlier partial branding table.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_branding_heading_font" AS ENUM('Lexend Deca', 'Geist', 'Inter', 'DM Sans', 'Manrope', 'Outfit', 'Plus Jakarta Sans', 'Poppins', 'Montserrat', 'Nunito Sans', 'Source Sans 3', 'IBM Plex Sans', 'Lato', 'Open Sans', 'Roboto', 'Playfair Display', 'Fraunces', 'Merriweather', 'Libre Baskerville', 'Space Grotesk');
  CREATE TYPE "public"."enum_branding_body_font" AS ENUM('Lexend Deca', 'Geist', 'Inter', 'DM Sans', 'Manrope', 'Outfit', 'Plus Jakarta Sans', 'Poppins', 'Montserrat', 'Nunito Sans', 'Source Sans 3', 'IBM Plex Sans', 'Lato', 'Open Sans', 'Roboto', 'Playfair Display', 'Fraunces', 'Merriweather', 'Libre Baskerville', 'Space Grotesk');
  CREATE TABLE "branding" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_alt" varchar DEFAULT 'Lakeside',
  	"primary_color" varchar DEFAULT '#3B6FD8',
  	"icon_color" varchar DEFAULT '#3B6FD8',
  	"button_color" varchar DEFAULT '#3B6FD8',
  	"button_text_color" varchar DEFAULT '#FFFFFF',
  	"secondary_button_color" varchar DEFAULT '#3B6FD8',
  	"secondary_button_text_color" varchar DEFAULT '#3B6FD8',
  	"secondary_color" varchar DEFAULT '#E8EEF9',
  	"accent_color" varchar DEFAULT '#D7E4F8',
  	"background_color" varchar DEFAULT '#F7F9FC',
  	"heading_color" varchar DEFAULT '#1B2433',
  	"text_color" varchar DEFAULT '#1B2433',
  	"muted_text_color" varchar DEFAULT '#6B7A90',
  	"border_color" varchar DEFAULT '#D9E1EE',
  	"focus_ring_color" varchar DEFAULT '#3B6FD8',
  	"heading_font" "enum_branding_heading_font" DEFAULT 'Lexend Deca' NOT NULL,
  	"body_font" "enum_branding_body_font" DEFAULT 'Geist' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "branding" ADD CONSTRAINT "branding_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "branding_logo_idx" ON "branding" USING btree ("logo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branding" DROP CONSTRAINT IF EXISTS "branding_logo_id_media_id_fk";
  DROP TABLE IF EXISTS "branding" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_branding_heading_font";
  DROP TYPE IF EXISTS "public"."enum_branding_body_font";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "surface_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "muted_surface_color" varchar DEFAULT '#F3F4F6';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "button_hover_color" varchar DEFAULT '#1D4F8A';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "button_active_color" varchar DEFAULT '#163D6E';
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "ink_color" varchar DEFAULT '#0E1726';

  ALTER TABLE "branding" DROP COLUMN IF EXISTS "heading_font";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "body_font";
  DROP TYPE IF EXISTS "public"."enum_branding_heading_font";
  DROP TYPE IF EXISTS "public"."enum_branding_body_font";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
   CREATE TYPE "public"."enum_branding_heading_font" AS ENUM('Satoshi', 'Lexend Deca', 'Geist', 'Inter', 'DM Sans', 'Manrope', 'Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'Poppins', 'Montserrat', 'Nunito Sans', 'Source Sans 3', 'IBM Plex Sans', 'Lato', 'Open Sans', 'Roboto', 'Playfair Display', 'Fraunces', 'Merriweather', 'Libre Baskerville');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
   CREATE TYPE "public"."enum_branding_body_font" AS ENUM('Satoshi', 'Lexend Deca', 'Geist', 'Inter', 'DM Sans', 'Manrope', 'Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'Poppins', 'Montserrat', 'Nunito Sans', 'Source Sans 3', 'IBM Plex Sans', 'Lato', 'Open Sans', 'Roboto', 'Playfair Display', 'Fraunces', 'Merriweather', 'Libre Baskerville');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "heading_font" "enum_branding_heading_font" DEFAULT 'Satoshi' NOT NULL;
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "body_font" "enum_branding_body_font" DEFAULT 'Manrope' NOT NULL;

  ALTER TABLE "branding" DROP COLUMN IF EXISTS "surface_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "muted_surface_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "button_hover_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "button_active_color";
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "ink_color";`)
}

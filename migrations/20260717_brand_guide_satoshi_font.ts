import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Add Satoshi to branding font enums (must commit before use). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    ALTER TYPE "public"."enum_branding_heading_font" ADD VALUE IF NOT EXISTS 'Satoshi';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  `)

  await db.execute(sql`
  DO $$ BEGIN
    ALTER TYPE "public"."enum_branding_body_font" ADD VALUE IF NOT EXISTS 'Satoshi';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Enum values cannot be removed safely in Postgres.
}

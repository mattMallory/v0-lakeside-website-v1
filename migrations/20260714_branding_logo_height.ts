import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" ADD COLUMN IF NOT EXISTS "logo_height" numeric DEFAULT 44;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branding" DROP COLUMN IF EXISTS "logo_height";`)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_practice_type" varchar;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_services" varchar;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_engagement_focus" varchar;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "client_market_reach" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_practice_type";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_services";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_engagement_focus";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "client_market_reach";`)
}

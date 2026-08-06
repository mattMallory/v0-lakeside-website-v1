import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "about" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_eyebrow" varchar DEFAULT 'About Lakeside',
    "hero_title" varchar DEFAULT 'Where Growth Comes Naturally' NOT NULL,
    "hero_description" varchar DEFAULT 'We are committed to helping natural healthcare and service organizations in the Chicago suburbs achieve their goals with innovative marketing strategies — blending a friendly approach with a serious focus on results.',
    "hero_image_id" integer,
    "hero_image_alt" varchar DEFAULT 'The Lakeside Marketing team collaborating',
    "hero_image_position" varchar DEFAULT 'center',
    "vision_mission_headline" varchar DEFAULT 'Marketing strategies built to weather any storm.',
    "vision_label" varchar DEFAULT 'Our Vision',
    "vision_text" varchar DEFAULT 'To build a company that delivers effective, lasting marketing strategies — helping businesses grow quickly and steadily no matter the economic conditions.',
    "mission_label" varchar DEFAULT 'Our Mission',
    "mission_text" varchar DEFAULT 'To help natural healthcare and service organizations achieve their dreams through innovative marketing — so every client feels cared for, listened to, and confident on their journey to success.',
    "process_eyebrow" varchar DEFAULT 'Our Process',
    "process_title" varchar DEFAULT 'How we work with every client',
    "process_description" varchar DEFAULT 'Lakeside isn''t just a creative studio — we''re your trusted partner, delivering strategies that consistently exceed expectations.',
    "process_center_subtitle" varchar DEFAULT 'Tap any step to learn how we help your practice grow.',
    "process_center_title" varchar DEFAULT 'Our Process',
    "team_eyebrow" varchar DEFAULT 'Our Team',
    "team_title" varchar DEFAULT 'Meet Our Leadership',
    "team_description" varchar DEFAULT 'Behind every campaign is a team of experts dedicated to your growth.',
    "cta_headline" varchar DEFAULT 'Ready to grow with a team you can trust?',
    "cta_description" varchar DEFAULT 'Book a free consultation and let''s talk about how Lakeside can help your clinic or organization thrive.',
    "cta_button" varchar DEFAULT 'Schedule a Consultation',
    "meta_title" varchar,
    "meta_description" varchar,
    "meta_image_id" integer,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "about_team_members" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "role" varchar NOT NULL,
    "bio" varchar NOT NULL,
    "photo_id" integer,
    "initials" varchar,
    "photo_position" varchar DEFAULT 'center',
    "linkedin_url" varchar,
    "youtube_url" varchar,
    "instagram_url" varchar,
    "x_url" varchar,
    "facebook_url" varchar
  );

  CREATE TABLE IF NOT EXISTS "about_process_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE INDEX IF NOT EXISTS "about_hero_image_idx" ON "about" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "about_meta_image_idx" ON "about" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "about_team_members_order_idx" ON "about_team_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "about_team_members_parent_id_idx" ON "about_team_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "about_team_members_photo_idx" ON "about_team_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "about_process_items_order_idx" ON "about_process_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "about_process_items_parent_id_idx" ON "about_process_items" USING btree ("_parent_id");

  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about_team_members" ADD CONSTRAINT "about_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about_team_members" ADD CONSTRAINT "about_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about_process_items" ADD CONSTRAINT "about_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "about_process_items";
  DROP TABLE IF EXISTS "about_team_members";
  DROP TABLE IF EXISTS "about";`)
}

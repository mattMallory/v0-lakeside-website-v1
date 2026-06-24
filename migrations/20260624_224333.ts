import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_homepage_problem_items_icon" AS ENUM('line-chart', 'trending-down', 'compass', 'bar-chart-3', 'megaphone', 'layout-template', 'users', 'gauge', 'activity', 'bone', 'flask-conical', 'leaf', 'heart-pulse', 'sparkles');
  CREATE TYPE "public"."enum_homepage_services_items_icon" AS ENUM('line-chart', 'trending-down', 'compass', 'bar-chart-3', 'megaphone', 'layout-template', 'users', 'gauge', 'activity', 'bone', 'flask-conical', 'leaf', 'heart-pulse', 'sparkles');
  CREATE TYPE "public"."enum_homepage_who_we_help_practices_icon" AS ENUM('line-chart', 'trending-down', 'compass', 'bar-chart-3', 'megaphone', 'layout-template', 'users', 'gauge', 'activity', 'bone', 'flask-conical', 'leaf', 'heart-pulse', 'sparkles');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_problem_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_problem_items_icon" NOT NULL,
  	"image_url" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_solution_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_services_items_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_choose_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"base_image" varchar NOT NULL,
  	"base_alt" varchar NOT NULL,
  	"overlay_image" varchar NOT NULL,
  	"overlay_alt" varchar NOT NULL,
  	"overlay_width_class" varchar NOT NULL,
  	"overlay_position_class_mobile" varchar NOT NULL,
  	"overlay_position_class" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_who_we_help_practices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_who_we_help_practices_icon" NOT NULL,
  	"name" varchar NOT NULL,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Patient Acquisition For Natural Wellness Clinics',
  	"hero_headline" varchar DEFAULT 'More Patient Appointments For Your Clinic' NOT NULL,
  	"hero_subheadline" varchar DEFAULT 'We help natural healthcare clinics generate qualified patient inquiries through proven lead generation systems so you can focus on patient care.',
  	"hero_primary_cta" varchar DEFAULT 'Schedule a Consultation',
  	"hero_secondary_cta" varchar DEFAULT 'See How It Works',
  	"problem_headline" varchar DEFAULT 'Problems We Can Help You Solve',
  	"problem_subheadline" varchar DEFAULT 'If referrals slow down, does your schedule slow down too? Many clinic owners struggle with the same challenges.',
  	"solution_eyebrow" varchar DEFAULT 'The Lakeside System',
  	"solution_headline" varchar DEFAULT 'A Complete Patient Acquisition System',
  	"solution_description" varchar DEFAULT 'Lakeside combines four proven pillars into one streamlined system designed to generate qualified patient inquiries, predictably and on repeat.',
  	"solution_cta" varchar DEFAULT 'Schedule a Consultation',
  	"how_it_works_headline" varchar DEFAULT 'How It Works',
  	"how_it_works_subheadline" varchar DEFAULT 'A simple, proven path from first conversation to a fuller appointment book.',
  	"how_it_works_button" varchar DEFAULT 'Learn More',
  	"services_eyebrow" varchar DEFAULT 'Our New Patient System',
  	"services_headline" varchar DEFAULT 'Everything Needed To Fill Your Schedule',
  	"why_choose_headline" varchar DEFAULT 'Why Clinics Choose Lakeside',
  	"why_choose_description" varchar DEFAULT 'Since day one, Lakeside has focused on one thing: helping natural wellness clinics attract more of the right patients. We know your industry, and we build patient acquisition systems around the way real practices grow. Here''s why clinics trust us.',
  	"why_choose_cta" varchar DEFAULT 'Schedule a Consultation',
  	"who_we_help_headline" varchar DEFAULT 'Who We Help',
  	"who_we_help_subheadline" varchar DEFAULT 'We partner with natural healthcare practices across the wellness spectrum.',
  	"story_eyebrow" varchar DEFAULT 'Why Lakeside',
  	"story_headline" varchar DEFAULT 'Focus On Your Patients, Not Marketing',
  	"story_description" varchar DEFAULT 'We started Lakeside because too many clinic owners are forced to become marketers when they should be focused on helping patients. Our goal is simple: build reliable patient acquisition systems so clinic owners can spend less time worrying about where the next patient is coming from.',
  	"story_primary_cta" varchar DEFAULT 'Learn About Our System',
  	"story_secondary_cta" varchar DEFAULT 'View Case Studies',
  	"story_image_url" varchar DEFAULT '/story/therapy-session-clean.jpg',
  	"story_image_alt" varchar DEFAULT 'A clinician treating a patient during a therapy session',
  	"story_notification_title" varchar DEFAULT 'New Message',
  	"story_notification_heading" varchar DEFAULT 'Consultation Booked',
  	"story_notification_body" varchar DEFAULT 'John S. has scheduled with you.',
  	"cta_headline" varchar DEFAULT 'Ready To Generate More Patient Appointments?',
  	"cta_subheadline" varchar DEFAULT 'Book a free growth consultation and we''ll map out a patient acquisition system tailored to your clinic.',
  	"cta_button" varchar DEFAULT 'Schedule Your Growth Consultation',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_problem_items" ADD CONSTRAINT "homepage_problem_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_solution_pillars" ADD CONSTRAINT "homepage_solution_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_how_it_works_steps" ADD CONSTRAINT "homepage_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_choose_cards" ADD CONSTRAINT "homepage_why_choose_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_who_we_help_practices" ADD CONSTRAINT "homepage_who_we_help_practices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_problem_items_order_idx" ON "homepage_problem_items" USING btree ("_order");
  CREATE INDEX "homepage_problem_items_parent_id_idx" ON "homepage_problem_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_solution_pillars_order_idx" ON "homepage_solution_pillars" USING btree ("_order");
  CREATE INDEX "homepage_solution_pillars_parent_id_idx" ON "homepage_solution_pillars" USING btree ("_parent_id");
  CREATE INDEX "homepage_how_it_works_steps_order_idx" ON "homepage_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "homepage_how_it_works_steps_parent_id_idx" ON "homepage_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_items_order_idx" ON "homepage_services_items" USING btree ("_order");
  CREATE INDEX "homepage_services_items_parent_id_idx" ON "homepage_services_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_choose_cards_order_idx" ON "homepage_why_choose_cards" USING btree ("_order");
  CREATE INDEX "homepage_why_choose_cards_parent_id_idx" ON "homepage_why_choose_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_who_we_help_practices_order_idx" ON "homepage_who_we_help_practices" USING btree ("_order");
  CREATE INDEX "homepage_who_we_help_practices_parent_id_idx" ON "homepage_who_we_help_practices" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_problem_items" CASCADE;
  DROP TABLE "homepage_solution_pillars" CASCADE;
  DROP TABLE "homepage_how_it_works_steps" CASCADE;
  DROP TABLE "homepage_services_items" CASCADE;
  DROP TABLE "homepage_why_choose_cards" CASCADE;
  DROP TABLE "homepage_who_we_help_practices" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TYPE "public"."enum_homepage_problem_items_icon";
  DROP TYPE "public"."enum_homepage_services_items_icon";
  DROP TYPE "public"."enum_homepage_who_we_help_practices_icon";`)
}

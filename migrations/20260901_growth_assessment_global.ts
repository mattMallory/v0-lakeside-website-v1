import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "growth_assessment" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_eyebrow" varchar,
    "hero_headline" varchar NOT NULL,
    "hero_description" varchar,
    "hero_primary_cta" varchar,
    "hero_secondary_cta" varchar,
    "hero_note" varchar,
    "hero_sample_practice" varchar,
    "hero_sample_score" numeric,
    "hero_top_opportunity" varchar,
    "hero_suggested_range" varchar,
    "problem_eyebrow" varchar,
    "problem_headline" varchar,
    "problem_description" varchar,
    "problem_highlight_stage" varchar,
    "problem_footnote" varchar,
    "assess_eyebrow" varchar,
    "assess_headline" varchar,
    "assess_description" varchar,
    "data_eyebrow" varchar,
    "data_headline" varchar,
    "data_description" varchar,
    "data_credibility_line" varchar,
    "data_human_review_label" varchar,
    "data_sources_note" varchar,
    "data_bridge_line" varchar,
    "use_cases_headline" varchar,
    "use_cases_description" varchar,
    "how_eyebrow" varchar,
    "how_headline" varchar,
    "how_note" varchar,
    "report_eyebrow" varchar,
    "report_headline" varchar,
    "report_description" varchar,
    "report_sample_plan_label" varchar,
    "report_sample_plan_url" varchar,
    "financial_eyebrow" varchar,
    "financial_headline" varchar,
    "financial_description" varchar,
    "financial_disclaimer" varchar,
    "who_eyebrow" varchar,
    "who_headline" varchar,
    "who_not_fit_note" varchar,
    "why_eyebrow" varchar,
    "why_headline" varchar,
    "why_description" varchar,
    "findings_eyebrow" varchar,
    "findings_headline" varchar,
    "faq_eyebrow" varchar,
    "faq_headline" varchar,
    "practitioners_eyebrow" varchar,
    "practitioners_headline" varchar,
    "practitioners_description" varchar,
    "form_eyebrow" varchar,
    "form_headline" varchar,
    "form_description" varchar,
    "form_quote" varchar,
    "form_cta_label" varchar,
    "section_cta_label" varchar,
    "form_show_investment_step" boolean DEFAULT false,
    "seo_title" varchar,
    "seo_description" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_hero_priority_actions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_problem_stages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_assess_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_data_sources" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "icon" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_data_flow_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_use_cases" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "number" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_how_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_report_checklist" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_financial_scenarios" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "featured" boolean DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_financial_scenarios_rows" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_who_fit_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_who_not_fit_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_why_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_findings_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "consequence" varchar NOT NULL,
    "action" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_practitioners" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "specialty" varchar NOT NULL,
    "quote" varchar NOT NULL,
    "photo_id" integer,
    "initials" varchar
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_form_bullets" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_form_investment_options" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "growth_assessment_form_processing_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "growth_assessment_hero_priority_actions" ADD CONSTRAINT "growth_assessment_hero_priority_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_problem_stages" ADD CONSTRAINT "growth_assessment_problem_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_assess_items" ADD CONSTRAINT "growth_assessment_assess_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_data_sources" ADD CONSTRAINT "growth_assessment_data_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_data_flow_steps" ADD CONSTRAINT "growth_assessment_data_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_use_cases" ADD CONSTRAINT "growth_assessment_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_how_steps" ADD CONSTRAINT "growth_assessment_how_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_report_checklist" ADD CONSTRAINT "growth_assessment_report_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_financial_scenarios" ADD CONSTRAINT "growth_assessment_financial_scenarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_who_fit_items" ADD CONSTRAINT "growth_assessment_who_fit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_who_not_fit_items" ADD CONSTRAINT "growth_assessment_who_not_fit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_why_items" ADD CONSTRAINT "growth_assessment_why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_findings_items" ADD CONSTRAINT "growth_assessment_findings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_faq_items" ADD CONSTRAINT "growth_assessment_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_practitioners" ADD CONSTRAINT "growth_assessment_practitioners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_form_bullets" ADD CONSTRAINT "growth_assessment_form_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_form_investment_options" ADD CONSTRAINT "growth_assessment_form_investment_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_form_processing_steps" ADD CONSTRAINT "growth_assessment_form_processing_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_financial_scenarios_rows" ADD CONSTRAINT "growth_assessment_financial_scenarios_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."growth_assessment_financial_scenarios"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "growth_assessment_practitioners" ADD CONSTRAINT "growth_assessment_practitioners_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "growth_assessment_hero_priority_actions_order_idx" ON "growth_assessment_hero_priority_actions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_hero_priority_actions_parent_id_idx" ON "growth_assessment_hero_priority_actions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_problem_stages_order_idx" ON "growth_assessment_problem_stages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_problem_stages_parent_id_idx" ON "growth_assessment_problem_stages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_assess_items_order_idx" ON "growth_assessment_assess_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_assess_items_parent_id_idx" ON "growth_assessment_assess_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_data_sources_order_idx" ON "growth_assessment_data_sources" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_data_sources_parent_id_idx" ON "growth_assessment_data_sources" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_data_flow_steps_order_idx" ON "growth_assessment_data_flow_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_data_flow_steps_parent_id_idx" ON "growth_assessment_data_flow_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_use_cases_order_idx" ON "growth_assessment_use_cases" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_use_cases_parent_id_idx" ON "growth_assessment_use_cases" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_how_steps_order_idx" ON "growth_assessment_how_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_how_steps_parent_id_idx" ON "growth_assessment_how_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_report_checklist_order_idx" ON "growth_assessment_report_checklist" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_report_checklist_parent_id_idx" ON "growth_assessment_report_checklist" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_financial_scenarios_order_idx" ON "growth_assessment_financial_scenarios" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_financial_scenarios_parent_id_idx" ON "growth_assessment_financial_scenarios" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_financial_scenarios_rows_order_idx" ON "growth_assessment_financial_scenarios_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_financial_scenarios_rows_parent_id_idx" ON "growth_assessment_financial_scenarios_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_who_fit_items_order_idx" ON "growth_assessment_who_fit_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_who_fit_items_parent_id_idx" ON "growth_assessment_who_fit_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_who_not_fit_items_order_idx" ON "growth_assessment_who_not_fit_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_who_not_fit_items_parent_id_idx" ON "growth_assessment_who_not_fit_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_why_items_order_idx" ON "growth_assessment_why_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_why_items_parent_id_idx" ON "growth_assessment_why_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_findings_items_order_idx" ON "growth_assessment_findings_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_findings_items_parent_id_idx" ON "growth_assessment_findings_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_faq_items_order_idx" ON "growth_assessment_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_faq_items_parent_id_idx" ON "growth_assessment_faq_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_practitioners_order_idx" ON "growth_assessment_practitioners" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_practitioners_parent_id_idx" ON "growth_assessment_practitioners" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_practitioners_photo_idx" ON "growth_assessment_practitioners" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_bullets_order_idx" ON "growth_assessment_form_bullets" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_bullets_parent_id_idx" ON "growth_assessment_form_bullets" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_investment_options_order_idx" ON "growth_assessment_form_investment_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_investment_options_parent_id_idx" ON "growth_assessment_form_investment_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_processing_steps_order_idx" ON "growth_assessment_form_processing_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "growth_assessment_form_processing_steps_parent_id_idx" ON "growth_assessment_form_processing_steps" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "growth_assessment_form_processing_steps";
  DROP TABLE IF EXISTS "growth_assessment_form_investment_options";
  DROP TABLE IF EXISTS "growth_assessment_form_bullets";
  DROP TABLE IF EXISTS "growth_assessment_practitioners";
  DROP TABLE IF EXISTS "growth_assessment_faq_items";
  DROP TABLE IF EXISTS "growth_assessment_findings_items";
  DROP TABLE IF EXISTS "growth_assessment_why_items";
  DROP TABLE IF EXISTS "growth_assessment_who_not_fit_items";
  DROP TABLE IF EXISTS "growth_assessment_who_fit_items";
  DROP TABLE IF EXISTS "growth_assessment_financial_scenarios_rows";
  DROP TABLE IF EXISTS "growth_assessment_financial_scenarios";
  DROP TABLE IF EXISTS "growth_assessment_report_checklist";
  DROP TABLE IF EXISTS "growth_assessment_how_steps";
  DROP TABLE IF EXISTS "growth_assessment_use_cases";
  DROP TABLE IF EXISTS "growth_assessment_data_flow_steps";
  DROP TABLE IF EXISTS "growth_assessment_data_sources";
  DROP TABLE IF EXISTS "growth_assessment_assess_items";
  DROP TABLE IF EXISTS "growth_assessment_problem_stages";
  DROP TABLE IF EXISTS "growth_assessment_hero_priority_actions";
  DROP TABLE IF EXISTS "growth_assessment";`)
}

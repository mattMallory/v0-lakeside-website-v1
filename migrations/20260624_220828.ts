import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`homepage_problem_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`image_url\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_problem_items_order_idx\` ON \`homepage_problem_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_problem_items_parent_id_idx\` ON \`homepage_problem_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_solution_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_solution_pillars_order_idx\` ON \`homepage_solution_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_solution_pillars_parent_id_idx\` ON \`homepage_solution_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_how_it_works_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_how_it_works_steps_order_idx\` ON \`homepage_how_it_works_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_how_it_works_steps_parent_id_idx\` ON \`homepage_how_it_works_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_services_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_services_items_order_idx\` ON \`homepage_services_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_services_items_parent_id_idx\` ON \`homepage_services_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_why_choose_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`base_image\` text NOT NULL,
  	\`base_alt\` text NOT NULL,
  	\`overlay_image\` text NOT NULL,
  	\`overlay_alt\` text NOT NULL,
  	\`overlay_width_class\` text NOT NULL,
  	\`overlay_position_class_mobile\` text NOT NULL,
  	\`overlay_position_class\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_why_choose_cards_order_idx\` ON \`homepage_why_choose_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_why_choose_cards_parent_id_idx\` ON \`homepage_why_choose_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_who_we_help_practices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`image_url\` text,
  	\`image_alt\` text,
  	\`detail\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_who_we_help_practices_order_idx\` ON \`homepage_who_we_help_practices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_who_we_help_practices_parent_id_idx\` ON \`homepage_who_we_help_practices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text DEFAULT 'Patient Acquisition For Natural Wellness Clinics',
  	\`hero_headline\` text DEFAULT 'More Patient Appointments For Your Clinic' NOT NULL,
  	\`hero_subheadline\` text DEFAULT 'We help natural healthcare clinics generate qualified patient inquiries through proven lead generation systems so you can focus on patient care.',
  	\`hero_primary_cta\` text DEFAULT 'Schedule a Consultation',
  	\`hero_secondary_cta\` text DEFAULT 'See How It Works',
  	\`problem_headline\` text DEFAULT 'Problems We Can Help You Solve',
  	\`problem_subheadline\` text DEFAULT 'If referrals slow down, does your schedule slow down too? Many clinic owners struggle with the same challenges.',
  	\`solution_eyebrow\` text DEFAULT 'The Lakeside System',
  	\`solution_headline\` text DEFAULT 'A Complete Patient Acquisition System',
  	\`solution_description\` text DEFAULT 'Lakeside combines four proven pillars into one streamlined system designed to generate qualified patient inquiries, predictably and on repeat.',
  	\`solution_cta\` text DEFAULT 'Schedule a Consultation',
  	\`how_it_works_headline\` text DEFAULT 'How It Works',
  	\`how_it_works_subheadline\` text DEFAULT 'A simple, proven path from first conversation to a fuller appointment book.',
  	\`how_it_works_button\` text DEFAULT 'Learn More',
  	\`services_eyebrow\` text DEFAULT 'Our New Patient System',
  	\`services_headline\` text DEFAULT 'Everything Needed To Fill Your Schedule',
  	\`why_choose_headline\` text DEFAULT 'Why Clinics Choose Lakeside',
  	\`why_choose_description\` text DEFAULT 'Since day one, Lakeside has focused on one thing: helping natural wellness clinics attract more of the right patients. We know your industry, and we build patient acquisition systems around the way real practices grow. Here''s why clinics trust us.',
  	\`why_choose_cta\` text DEFAULT 'Schedule a Consultation',
  	\`who_we_help_headline\` text DEFAULT 'Who We Help',
  	\`who_we_help_subheadline\` text DEFAULT 'We partner with natural healthcare practices across the wellness spectrum.',
  	\`story_eyebrow\` text DEFAULT 'Why Lakeside',
  	\`story_headline\` text DEFAULT 'Focus On Your Patients, Not Marketing',
  	\`story_description\` text DEFAULT 'We started Lakeside because too many clinic owners are forced to become marketers when they should be focused on helping patients. Our goal is simple: build reliable patient acquisition systems so clinic owners can spend less time worrying about where the next patient is coming from.',
  	\`story_primary_cta\` text DEFAULT 'Learn About Our System',
  	\`story_secondary_cta\` text DEFAULT 'View Case Studies',
  	\`story_image_url\` text DEFAULT '/story/therapy-session-clean.jpg',
  	\`story_image_alt\` text DEFAULT 'A clinician treating a patient during a therapy session',
  	\`story_notification_title\` text DEFAULT 'New Message',
  	\`story_notification_heading\` text DEFAULT 'Consultation Booked',
  	\`story_notification_body\` text DEFAULT 'John S. has scheduled with you.',
  	\`cta_headline\` text DEFAULT 'Ready To Generate More Patient Appointments?',
  	\`cta_subheadline\` text DEFAULT 'Book a free growth consultation and we''ll map out a patient acquisition system tailored to your clinic.',
  	\`cta_button\` text DEFAULT 'Schedule Your Growth Consultation',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`homepage_problem_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_solution_pillars\`;`)
  await db.run(sql`DROP TABLE \`homepage_how_it_works_steps\`;`)
  await db.run(sql`DROP TABLE \`homepage_services_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_why_choose_cards\`;`)
  await db.run(sql`DROP TABLE \`homepage_who_we_help_practices\`;`)
  await db.run(sql`DROP TABLE \`homepage\`;`)
}

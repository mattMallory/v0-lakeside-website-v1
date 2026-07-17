import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Sync Brand Guide v20 color + type tokens into the branding global. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "branding" SET
    "primary_color" = '#2563A8',
    "icon_color" = '#2563A8',
    "button_color" = '#2563A8',
    "button_text_color" = '#FFFFFF',
    "secondary_button_color" = '#D5D7DB',
    "secondary_button_text_color" = '#374151',
    "secondary_color" = '#EFF6FF',
    "accent_color" = '#DBEAFE',
    "background_color" = '#F9F7F4',
    "heading_color" = '#111827',
    "text_color" = '#111827',
    "muted_text_color" = '#6B7280',
    "border_color" = '#E8E9EB',
    "focus_ring_color" = '#2563A8',
    "heading_font" = 'Satoshi',
    "body_font" = 'Manrope';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "branding" SET
    "primary_color" = '#3B6FD8',
    "icon_color" = '#3B6FD8',
    "button_color" = '#3B6FD8',
    "button_text_color" = '#FFFFFF',
    "secondary_button_color" = '#3B6FD8',
    "secondary_button_text_color" = '#3B6FD8',
    "secondary_color" = '#E8EEF9',
    "accent_color" = '#D7E4F8',
    "background_color" = '#F7F9FC',
    "heading_color" = '#1B2433',
    "text_color" = '#1B2433',
    "muted_text_color" = '#6B7A90',
    "border_color" = '#D9E1EE',
    "focus_ring_color" = '#3B6FD8',
    "heading_font" = 'Lexend Deca',
    "body_font" = 'Geist';
  `)
}

import * as migration_20260624_224333 from './20260624_224333';
import * as migration_20260714_branding from './20260714_branding';
import * as migration_20260714_branding_colors from './20260714_branding_colors';
import * as migration_20260714_branding_logo_height from './20260714_branding_logo_height';
import * as migration_20260717_homepage_seo from './20260717_homepage_seo';
import * as migration_20260717_brand_guide_satoshi_font from './20260717_brand_guide_satoshi_font';
import * as migration_20260717_brand_guide_v20 from './20260717_brand_guide_v20';
import * as migration_20260723_why_choose_card_images from './20260723_why_choose_card_images';
import * as migration_20260723_services_global from './20260723_services_global';

import * as migration_20260724_services_page_content from './20260724_services_page_content';
import * as migration_20260724_blog_collections from './20260724_blog_collections';
import * as migration_20260724_case_study_fields from './20260724_case_study_fields';
import * as migration_20260724_case_study_practice_info from './20260724_case_study_practice_info';
import * as migration_20260724_about_global from './20260724_about_global';
import * as migration_20260724_case_study_highlight_globals from './20260724_case_study_highlight_globals';
import * as migration_20260730_homepage_growth_system_tables from './20260730_homepage_growth_system_tables';
import * as migration_20260731_homepage_growth_system from './20260731_homepage_growth_system';
import * as migration_20260731_funnel_step_images from './20260731_funnel_step_images';
import * as migration_20260803_testimonial_photo from './20260803_testimonial_photo';
import * as migration_20260803_team_image from './20260803_team_image';
import * as migration_20260805_legal_global from './20260805_legal_global';
import * as migration_20260805_navigation_global from './20260805_navigation_global';
import * as migration_20260824_calendar_global from './20260824_calendar_global';
import * as migration_20260824_consultation_global from './20260824_consultation_global';
import * as migration_20260825_navigation_footer_description from './20260825_navigation_footer_description';
import * as migration_20260825_navigation_footer_contact from './20260825_navigation_footer_contact';
import * as migration_20260825_fix_navigation_footer_address_columns from './20260825_fix_navigation_footer_address_columns';
import * as migration_20260825_homepage_section_backgrounds from './20260825_homepage_section_backgrounds';
import * as migration_20260825_page_section_backgrounds from './20260825_page_section_backgrounds';
import * as migration_20260827_demo_system_global from './20260827_demo_system_global';
import * as migration_20260901_growth_assessment_global from './20260901_growth_assessment_global';

export const migrations = [
  {
    up: migration_20260624_224333.up,
    down: migration_20260624_224333.down,
    name: '20260624_224333'
  },
  {
    up: migration_20260714_branding.up,
    down: migration_20260714_branding.down,
    name: '20260714_branding'
  },
  {
    up: migration_20260714_branding_colors.up,
    down: migration_20260714_branding_colors.down,
    name: '20260714_branding_colors'
  },
  {
    up: migration_20260714_branding_logo_height.up,
    down: migration_20260714_branding_logo_height.down,
    name: '20260714_branding_logo_height'
  },
  {
    up: migration_20260717_homepage_seo.up,
    down: migration_20260717_homepage_seo.down,
    name: '20260717_homepage_seo'
  },
  {
    up: migration_20260717_brand_guide_satoshi_font.up,
    down: migration_20260717_brand_guide_satoshi_font.down,
    name: '20260717_brand_guide_satoshi_font'
  },
  {
    up: migration_20260717_brand_guide_v20.up,
    down: migration_20260717_brand_guide_v20.down,
    name: '20260717_brand_guide_v20'
  },
  {
    up: migration_20260723_why_choose_card_images.up,
    down: migration_20260723_why_choose_card_images.down,
    name: '20260723_why_choose_card_images'
  },
  {
    up: migration_20260723_services_global.up,
    down: migration_20260723_services_global.down,
    name: '20260723_services_global'
  },
  {
    up: migration_20260724_services_page_content.up,
    down: migration_20260724_services_page_content.down,
    name: '20260724_services_page_content'
  },
  {
    up: migration_20260724_blog_collections.up,
    down: migration_20260724_blog_collections.down,
    name: '20260724_blog_collections'
  },
  {
    up: migration_20260724_case_study_fields.up,
    down: migration_20260724_case_study_fields.down,
    name: '20260724_case_study_fields'
  },
  {
    up: migration_20260724_case_study_practice_info.up,
    down: migration_20260724_case_study_practice_info.down,
    name: '20260724_case_study_practice_info'
  },
  {
    up: migration_20260724_about_global.up,
    down: migration_20260724_about_global.down,
    name: '20260724_about_global'
  },
  {
    up: migration_20260724_case_study_highlight_globals.up,
    down: migration_20260724_case_study_highlight_globals.down,
    name: '20260724_case_study_highlight_globals'
  },
  {
    up: migration_20260730_homepage_growth_system_tables.up,
    down: migration_20260730_homepage_growth_system_tables.down,
    name: '20260730_homepage_growth_system_tables'
  },
  {
    up: migration_20260731_homepage_growth_system.up,
    down: migration_20260731_homepage_growth_system.down,
    name: '20260731_homepage_growth_system'
  },
  {
    up: migration_20260731_funnel_step_images.up,
    down: migration_20260731_funnel_step_images.down,
    name: '20260731_funnel_step_images'
  },
  {
    up: migration_20260803_testimonial_photo.up,
    down: migration_20260803_testimonial_photo.down,
    name: '20260803_testimonial_photo'
  },
  {
    up: migration_20260803_team_image.up,
    down: migration_20260803_team_image.down,
    name: '20260803_team_image'
  },
  {
    up: migration_20260805_legal_global.up,
    down: migration_20260805_legal_global.down,
    name: '20260805_legal_global'
  },
  {
    up: migration_20260805_navigation_global.up,
    down: migration_20260805_navigation_global.down,
    name: '20260805_navigation_global'
  },
  {
    up: migration_20260824_calendar_global.up,
    down: migration_20260824_calendar_global.down,
    name: '20260824_calendar_global'
  },
  {
    up: migration_20260824_consultation_global.up,
    down: migration_20260824_consultation_global.down,
    name: '20260824_consultation_global'
  },
  {
    up: migration_20260825_navigation_footer_description.up,
    down: migration_20260825_navigation_footer_description.down,
    name: '20260825_navigation_footer_description'
  },
  {
    up: migration_20260825_navigation_footer_contact.up,
    down: migration_20260825_navigation_footer_contact.down,
    name: '20260825_navigation_footer_contact'
  },
  {
    up: migration_20260825_fix_navigation_footer_address_columns.up,
    down: migration_20260825_fix_navigation_footer_address_columns.down,
    name: '20260825_fix_navigation_footer_address_columns'
  },
  {
    up: migration_20260825_homepage_section_backgrounds.up,
    down: migration_20260825_homepage_section_backgrounds.down,
    name: '20260825_homepage_section_backgrounds'
  },
  {
    up: migration_20260825_page_section_backgrounds.up,
    down: migration_20260825_page_section_backgrounds.down,
    name: '20260825_page_section_backgrounds'
  },
  {
    up: migration_20260827_demo_system_global.up,
    down: migration_20260827_demo_system_global.down,
    name: '20260827_demo_system_global'
  },
  {
    up: migration_20260901_growth_assessment_global.up,
    down: migration_20260901_growth_assessment_global.down,
    name: '20260901_growth_assessment_global'
  },
];

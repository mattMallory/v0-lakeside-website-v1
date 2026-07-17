import * as migration_20260624_224333 from './20260624_224333';
import * as migration_20260714_branding from './20260714_branding';
import * as migration_20260714_branding_colors from './20260714_branding_colors';
import * as migration_20260714_branding_logo_height from './20260714_branding_logo_height';
import * as migration_20260717_homepage_seo from './20260717_homepage_seo';
import * as migration_20260717_brand_guide_satoshi_font from './20260717_brand_guide_satoshi_font';
import * as migration_20260717_brand_guide_v20 from './20260717_brand_guide_v20';

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
];

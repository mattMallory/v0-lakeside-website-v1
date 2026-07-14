import * as migration_20260624_224333 from './20260624_224333';
import * as migration_20260714_branding from './20260714_branding';
import * as migration_20260714_branding_colors from './20260714_branding_colors';

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
];

import * as migration_20260624_220828 from './20260624_220828';

export const migrations = [
  {
    up: migration_20260624_220828.up,
    down: migration_20260624_220828.down,
    name: '20260624_220828'
  },
];

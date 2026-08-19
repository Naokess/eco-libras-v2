import webConfig from './apps/web/eslint.config.mjs';
import apiConfig from './apps/api/eslint.config.mjs';
import sharedConfig from './packages/shared/eslint.config.mjs';

export default [
  {
    ignores: ['**/*.config.mjs'],
  },
  ...webConfig,
  ...apiConfig,
  ...sharedConfig,
];

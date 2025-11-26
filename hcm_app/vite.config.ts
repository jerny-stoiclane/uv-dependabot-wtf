import { defineConfig, mergeConfig } from 'vite';

import baseConfig from '../../vite.config.base';

export default defineConfig(() =>
  mergeConfig(baseConfig, {
    server: {
      port: 3200,
    },
  })
);

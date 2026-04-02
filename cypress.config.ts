import { existsSync, unlinkSync } from 'fs';

import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'cypress';

const baseUrl = 'http://localhost:3000';

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      loadEnvConfig(process.cwd());

      on(
        'after:spec',
        (_spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results?.video && results.stats.failures === 0) {
            if (existsSync(results.video)) unlinkSync(results.video);
          }
        },
      );

      config.excludeSpecPattern =
        process.env.LOCAL_E2E === 'true' ? [] : ['cypress/e2e/local/**/*'];

      // Sensitive / standard env (use cy.env() in specs if needed)
      config.env = {
        ...config.env,
        LOCAL_E2E: process.env.LOCAL_E2E,
        E2E_HTTP_MOCKS: process.env.E2E_HTTP_MOCKS,
        HOUSING_REGISTER_KEY: process.env.HOUSING_REGISTER_KEY,
      };

      // Public URLs and test group ids — read with Cypress.expose() in support (not Cypress.env)
      config.expose = {
        ...config.expose,
        ACTIVITY_HISTORY_API: process.env.ACTIVITY_HISTORY_API,
        HOUSING_REGISTER_API: process.env.HOUSING_REGISTER_API,
        LOOKUP_API_URL: process.env.LOOKUP_API_URL,
        AUTHORISED_ADMIN_GROUP: process.env.AUTHORISED_ADMIN_GROUP,
        AUTHORISED_MANAGER_GROUP: process.env.AUTHORISED_MANAGER_GROUP,
        AUTHORISED_OFFICER_GROUP: process.env.AUTHORISED_OFFICER_GROUP,
        AUTHORISED_READONLY_GROUP: process.env.AUTHORISED_READONLY_GROUP,
      };

      return config;
    },
    baseUrl,
    experimentalWebKitSupport: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    video: true,
    videoCompression: true,
  },

  component: {
    allowCypressEnv: false,
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});

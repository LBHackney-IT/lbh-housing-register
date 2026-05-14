import { existsSync, unlinkSync } from 'fs';

import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'cypress';

const baseUrl = 'http://localhost:3000';

// Populate process.env from .env when Cypress loads this file (e2e and component).
loadEnvConfig(process.cwd());

/**
 * Values read via Cypress.expose() / `exposed()` in support/commands.ts.
 * Authorised group names are only used in tests; defaults match README (“value is not important”).
 */
function buildCypressExpose(): Record<string, string | undefined> {
  return {
    LOCAL_E2E: process.env.LOCAL_E2E?.trim() === 'true' ? 'true' : undefined,
    ACTIVITY_HISTORY_API:
      process.env.ACTIVITY_HISTORY_API?.trim() ||
      'http://127.0.0.1:3600/api/v1',
    HOUSING_REGISTER_API:
      process.env.HOUSING_REGISTER_API?.trim() ||
      'http://127.0.0.1:3910/api/v1/',
    LOOKUP_API_URL:
      process.env.LOOKUP_API_URL?.trim() || 'http://127.0.0.1:3920',
    AUTHORISED_ADMIN_GROUP:
      process.env.AUTHORISED_ADMIN_GROUP?.trim() ||
      'cypress-authorised-admin-group',
    AUTHORISED_MANAGER_GROUP:
      process.env.AUTHORISED_MANAGER_GROUP?.trim() ||
      'cypress-authorised-manager-group',
    AUTHORISED_OFFICER_GROUP:
      process.env.AUTHORISED_OFFICER_GROUP?.trim() ||
      'cypress-authorised-officer-group',
    AUTHORISED_READONLY_GROUP:
      process.env.AUTHORISED_READONLY_GROUP?.trim() ||
      'cypress-authorised-readonly-group',
  };
}

function mergeExpose(config: Cypress.PluginConfigOptions): void {
  config.expose = {
    ...config.expose,
    ...buildCypressExpose(),
  };
}

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
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
        HOUSING_REGISTER_KEY: process.env.HOUSING_REGISTER_KEY || 'testing',
      };

      mergeExpose(config);

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
    setupNodeEvents(_on, config) {
      mergeExpose(config);
      return config;
    },
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});

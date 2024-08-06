import { defineConfig } from 'cypress';

type Environment = 'local' | 'development' | 'staging';

const environment: Environment =
  (process.env.APP_ENV as Environment) || 'development';

const baseUrlSites: Record<Environment, string> = {
  local: 'http://localhost:3000',
  development: 'https://housing-register-development.hackney.gov.uk/',
  staging: 'https://housing-register-staging.hackney.gov.uk/',
};

const baseUrl = baseUrlSites[environment];

export default defineConfig({
  e2e: {
    baseUrl,
    blockHosts: ['*.google-analytics.com', '*.sentry.io'],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

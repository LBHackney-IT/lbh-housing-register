import { defineConfig } from 'cypress';
require('dotenv').config();

type Environment = 'localdev' | 'development';

const environment: Environment =
  (process.env.NEXT_PUBLIC_ENV as Environment) || 'development';

const baseUrlSites: Record<Environment, string> = {
  localdev: 'http://localhost:3000',
  development: 'https://housing-register-development.hackney.gov.uk/',
};

const baseUrl = baseUrlSites[environment];

export default defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: true,
    screenshotOnRunFailure: true,
  },
});

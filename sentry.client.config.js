// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.sentry.io/6292602',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  environment: process.env.NEXT_PUBLIC_ENV,
  integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],
  enabled: ENVIRONMENT === 'production' || ENVIRONMENT === 'staging',
});

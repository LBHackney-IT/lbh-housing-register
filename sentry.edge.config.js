// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn:
    'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602',
  tracesSampleRate: 1.0,
  environment: ENVIRONMENT,
  integrations: [Sentry.captureConsoleIntegration()],
  enabled:
    ENVIRONMENT === 'production' ||
    ENVIRONMENT === 'staging' ||
    ENVIRONMENT === 'development',

  // remove cookies from the event before sending
  beforeSend(event) {
    if (event.request?.cookies['hackneyToken']) {
      delete event.request.cookies['hackneyToken'];
    }
    if (event.request?.cookies['housing_user']) {
      delete event.request.cookies['housing_user'];
    }
    return event;
  },
});

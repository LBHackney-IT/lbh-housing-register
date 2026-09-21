// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.SENTRY_ENVIRONMENT;

Sentry.init({
  dsn: 'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602',
  tracesSampler: () => {
    if (ENVIRONMENT === 'production') return 0.1;
    if (ENVIRONMENT === 'staging') return 0.5;
    return 1.0; // development / local
  },
  environment: ENVIRONMENT,
  integrations: [Sentry.captureConsoleIntegration()],
  enabled:
    ENVIRONMENT === 'production' ||
    ENVIRONMENT === 'staging' ||
    ENVIRONMENT === 'development',

  // Never send inbound credentials or request bodies to Sentry.
  beforeSend(event) {
    if (event.request) {
      if (event.request.url) {
        try {
          event.request.url = new URL(
            event.request.url,
            process.env.NEXTAUTH_URL ?? 'https://sentry.local',
          ).pathname;
        } catch {
          event.request.url = event.request.url.split(/[?#]/)[0];
        }
      }
      delete event.request.cookies;
      delete event.request.data;

      for (const header of Object.keys(event.request.headers ?? {})) {
        if (
          ['authorization', 'cookie', 'set-cookie', 'x-api-key'].includes(
            header.toLowerCase(),
          )
        ) {
          delete event.request.headers[header];
        }
      }
    }
    if (event.extra) {
      delete event.extra.arguments;
      delete event.extra.body;
      delete event.extra.request_body;
      delete event.extra.response_body;
    }
    return event;
  },
});

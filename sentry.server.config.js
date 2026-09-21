// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.SENTRY_ENVIRONMENT;

Sentry.init({
  dsn: 'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602',
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps.
  tracesSampler: () => {
    if (ENVIRONMENT === 'production') return 0.1;
    if (ENVIRONMENT === 'staging') return 0.5;
    return 1.0; // development / local
  },
  environment: ENVIRONMENT,
  enabled:
    ENVIRONMENT === 'production' ||
    ENVIRONMENT === 'staging' ||
    ENVIRONMENT === 'development',

  // When a request has a `application/json` Content-Type but a body
  // that isn't valid JSON (or exceeds the size limit) - Next already catches
  // this itself and correctly responds 400/413.
  // Ignore these errors from automated scanners (e.g. Probely) fuzzing endpoints with malformed bodies.
  ignoreErrors: [
    /^Invalid JSON$/,
    /^Invalid body$/,
    /^Body exceeded .* limit$/,
  ],

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

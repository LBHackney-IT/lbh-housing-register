// Client-side Sentry (runs before hydration). Replaces legacy sentry.client.config.js.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV;

// The CI e2e job serves a deploy-targeted build (stage inlined at build time) from
// localhost, which would otherwise switch Sentry on for every test run.
const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

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
    !isLocalHost &&
    (ENVIRONMENT === 'production' ||
      ENVIRONMENT === 'staging' ||
      ENVIRONMENT === 'development'),

  beforeSend(event) {
    for (const cookieName of Object.keys(event.request?.cookies ?? {})) {
      if (cookieName.includes('next-auth')) {
        delete event.request?.cookies?.[cookieName];
      }
    }
    if (event.request?.cookies?.['hackneyToken']) {
      // Pre-migration staff cookie. Strip it if a leftover copy is still sent.
      delete event.request.cookies['hackneyToken'];
    }
    if (event.request?.cookies?.['housing_user']) {
      delete event.request.cookies['housing_user'];
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

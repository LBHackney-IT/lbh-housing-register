// Client-side Sentry (runs before hydration). Replaces legacy sentry.client.config.js.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn: 'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602',
  tracesSampleRate: 1.0,
  environment: ENVIRONMENT,
  integrations: [Sentry.captureConsoleIntegration()],
  enabled:
    ENVIRONMENT === 'production' ||
    ENVIRONMENT === 'staging' ||
    ENVIRONMENT === 'development',

  beforeSend(event) {
    if (event.request?.cookies?.['hackneyToken']) {
      delete event.request.cookies['hackneyToken'];
    }
    if (event.request?.cookies?.['housing_user']) {
      delete event.request.cookies['housing_user'];
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// Client-side Sentry (runs before hydration). Replaces legacy sentry.client.config.js.
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';
import {
  sanitiseSentryBreadcrumb,
  sanitiseSentryEvent,
} from './lib/utils/sentry-privacy';

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
  integrations: [
    Sentry.extraErrorDataIntegration({
      depth: 5,
      captureErrorCause: true,
    }),
    Sentry.httpClientIntegration({
      failedRequestStatusCodes: [[500, 599]],
      failedRequestTargets: [/\/api\//],
    }),
  ],
  ignoreErrors: [
    /^ResizeObserver loop limit exceeded$/,
    /^ResizeObserver loop completed with undelivered notifications\.?$/,
  ],
  denyUrls: [
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    /^safari-extension:\/\//,
  ],
  enabled:
    !isLocalHost &&
    (ENVIRONMENT === 'production' ||
      ENVIRONMENT === 'staging' ||
      ENVIRONMENT === 'development'),

  beforeBreadcrumb: sanitiseSentryBreadcrumb,
  beforeSend: sanitiseSentryEvent,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

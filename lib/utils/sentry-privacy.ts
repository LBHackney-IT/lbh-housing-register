import type { Breadcrumb, Event } from '@sentry/nextjs';
import { normaliseApiRoute } from './sentry';

const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
]);

const HTTP_OPERATIONS: Record<string, string> = {
  'GET /api/applications': 'load_application',
  'POST /api/applications': 'create_application',
  'PATCH /api/applications/[applicationId]': 'update_application',
  'PATCH /api/applications/[applicationId]/complete': 'complete_application',
  'POST /api/applications/[applicationId]/evidence': 'create_evidence_request',
  'POST /api/applications/[applicationId]/note': 'add_application_note',
  'GET /api/address/[postcode]': 'look_up_address',
  'POST /api/resident-auth/generate': 'create_verify_code',
  'POST /api/resident-auth/verify': 'confirm_verify_code',
  'POST /api/resident-auth/exit': 'resident_sign_out',
  'POST /api/auth/signout': 'staff_sign_out',
  'GET /api/admin/logout': 'staff_sign_out',
  'POST /api/notify/new-application': 'send_confirmation_email',
  'POST /api/notify/medical': 'send_medical_need_email',
  'POST /api/notify/disqualify': 'send_disqualification_email',
  'POST /api/reports/novalet/generate': 'generate_novalet_export',
  'POST /api/reports/novalet/approve/[fileName]': 'approve_novalet_export',
};

const stripQueryAndFragment = (url: string): string => url.split(/[?#]/)[0];

const sanitiseHeaders = (
  headers: Record<string, string> | undefined,
): Record<string, string> | undefined => {
  if (!headers) return headers;

  return Object.fromEntries(
    Object.entries(headers).filter(
      ([name]) => !SENSITIVE_HEADERS.has(name.toLowerCase()),
    ),
  );
};

const safeRoute = (url: string): string => {
  const withoutQuery = stripQueryAndFragment(url);

  try {
    const parsed = new URL(withoutQuery, 'https://sentry.local');
    return parsed.pathname.startsWith('/api/')
      ? normaliseApiRoute(parsed.pathname)
      : parsed.pathname;
  } catch {
    return withoutQuery;
  }
};

const getHttpStatus = (event: Event): string | undefined => {
  const status = event.contexts?.response?.status_code;
  return typeof status === 'number' || typeof status === 'string'
    ? String(status)
    : undefined;
};

const isHttpClientEvent = (event: Event): boolean =>
  Boolean(
    event.exception?.values?.some((exception) =>
      exception.mechanism?.type?.startsWith('auto.http.client.'),
    ),
  );

const sanitiseExtraErrorContexts = (event: Event): void => {
  for (const exception of event.exception?.values ?? []) {
    const contextName = exception.type;
    if (!contextName || !event.contexts?.[contextName]) continue;

    if (contextName === 'CreateApplicationError') {
      const context = event.contexts[contextName];
      event.contexts[contextName] = {
        status: context.status,
        applicationIds: context.applicationIds,
      };
    } else {
      delete event.contexts[contextName];
    }
  }
};

export const sanitiseSentryEvent = <T extends Event>(event: T): T => {
  if (event.request) {
    event.request.url = event.request.url
      ? safeRoute(event.request.url)
      : event.request.url;
    event.request.headers = sanitiseHeaders(event.request.headers);
    delete event.request.cookies;
    delete event.request.data;
  }

  if (event.extra) {
    delete event.extra.arguments;
    delete event.extra.body;
    delete event.extra.request_body;
    delete event.extra.response_body;
  }

  sanitiseExtraErrorContexts(event);

  if (isHttpClientEvent(event)) {
    const method = event.request?.method ?? 'GET';
    const route = event.request?.url ?? 'unknown';
    const status = getHttpStatus(event) ?? 'unknown';
    const operation =
      HTTP_OPERATIONS[`${method.toUpperCase()} ${route}`] ?? 'http_request';

    event.tags = {
      ...event.tags,
      operation,
      'http.method': method,
      'http.route': route,
      'http.status_code': status,
    };
    event.fingerprint = ['http-client', method, route, status];
  }

  return event;
};

export const sanitiseSentryBreadcrumb = (
  breadcrumb: Breadcrumb,
): Breadcrumb | null => {
  if (!breadcrumb.data) return breadcrumb;

  const data = { ...breadcrumb.data };
  const status = data.status_code ?? data.status;

  if (
    breadcrumb.category === 'fetch' &&
    typeof status === 'number' &&
    status >= 400 &&
    status < 500
  ) {
    // fetchWithSentry adds a single, operation-aware breadcrumb for these.
    return null;
  }

  for (const key of ['url', 'from', 'to']) {
    if (typeof data[key] === 'string') {
      data[key] = safeRoute(data[key]);
    }
  }
  delete data.body;
  delete data.request_body;
  delete data.response_body;
  delete data.arguments;

  if (data.headers && typeof data.headers === 'object') {
    data.headers = sanitiseHeaders(data.headers as Record<string, string>);
  }

  return { ...breadcrumb, data };
};

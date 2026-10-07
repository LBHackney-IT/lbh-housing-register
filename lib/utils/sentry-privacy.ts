import type { SpanJSON, TransactionEvent } from '@sentry/core';
import type { Breadcrumb, Event } from '@sentry/nextjs';
import { getSentrySurface, normaliseApiRoute } from './sentry';

const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
]);

// Setting `dataCollection` at all switches omitted fields onto the SDK defaults,
// which collect query strings and user info. State every field we care about.
export const sentryDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: { request: false, response: false },
  httpBodies: [],
  queryParams: false,
};

const stripQueryAndFragment = (url: string): string => url.split(/[?#]/)[0];

const SECRET_ATTRIBUTE = /cookie|authorization|api[-_]key/i;
const URL_ATTRIBUTE = /url|referer|target/i;
const QUERY_ATTRIBUTE = /(^|\.)(query|fragment)$/i;

// captureConsole joins non-Error arguments into the message. Drop inline
// objects so a response body cannot become the event or breadcrumb text.
const scrubConsoleMessage = (message: string): string => {
  const start = message.indexOf('{');
  const end = message.lastIndexOf('}');
  const withoutObject =
    start >= 0 && end > start
      ? `${message.slice(0, start)}${message.slice(end + 1)}`
      : message;

  return withoutObject.replace(/\s{2,}/g, ' ').trim();
};

const scrubEmbeddedUrls = (value: string): string =>
  value.replace(/https?:\/\/\S+|\/\S+/g, (token) => safeRoute(token));

const sanitiseHeaders = (
  headers: Record<string, string> | undefined,
): Record<string, string> | undefined => {
  if (!headers) return headers;

  return Object.fromEntries(
    Object.entries(headers).flatMap(([name, value]) => {
      const lowerName = name.toLowerCase();
      if (SENSITIVE_HEADERS.has(lowerName)) return [];
      if (lowerName === 'referer' && typeof value === 'string') {
        return [[name, safeRoute(value)]];
      }
      return [[name, value]];
    }),
  );
};

const safeRoute = (url: string): string => {
  try {
    const parsed = new URL(url, 'https://sentry.local');
    const path = parsed.pathname.startsWith('/api/')
      ? normaliseApiRoute(parsed.pathname)
      : parsed.pathname;
    // Relative app URLs have no host. Absolute URLs keep theirs so an
    // external request is not collapsed into a same-origin path.
    return parsed.origin === 'https://sentry.local'
      ? path
      : `${parsed.origin}${path}`;
  } catch {
    return stripQueryAndFragment(url);
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
    delete event.request.query_string;
  }

  if (event.extra) {
    delete event.extra.arguments;
    delete event.extra.body;
    delete event.extra.request_body;
    delete event.extra.response_body;
    if (
      event.extra.notifyRequest &&
      typeof event.extra.notifyRequest === 'object'
    ) {
      const reference = (event.extra.notifyRequest as { reference?: unknown })
        .reference;
      if (typeof reference === 'string') {
        event.extra.notifyRequest = { reference };
      } else {
        delete event.extra.notifyRequest;
      }
    }
  }

  if (event.logger === 'console' && typeof event.message === 'string') {
    event.message = scrubConsoleMessage(event.message);
  }

  // The transaction is the page that produced the event. Prefer it over a
  // scope tag, which can still describe the previous page.
  if (
    typeof event.transaction === 'string' &&
    event.transaction.startsWith('/') &&
    !event.transaction.startsWith('/api/')
  ) {
    event.tags = {
      ...event.tags,
      route: event.transaction,
      surface: getSentrySurface(event.transaction),
    };
  }

  return event;
};

export const sanitiseSentrySpan = (span: SpanJSON): SpanJSON => {
  if (typeof span.description === 'string') {
    span.description = scrubEmbeddedUrls(span.description);
  }

  if (span.data) {
    for (const key of Object.keys(span.data)) {
      if (SECRET_ATTRIBUTE.test(key) || QUERY_ATTRIBUTE.test(key)) {
        delete span.data[key];
        continue;
      }
      const value = span.data[key];
      if (typeof value === 'string' && URL_ATTRIBUTE.test(key)) {
        span.data[key] = scrubEmbeddedUrls(value);
      }
    }
  }

  return span;
};

export const sanitiseSentryTransaction = (
  event: TransactionEvent,
): TransactionEvent => {
  sanitiseSentryEvent(event);
  if (event.spans) {
    event.spans = event.spans.map(sanitiseSentrySpan);
  }
  return event;
};

export const sanitiseSentryBreadcrumb = (
  breadcrumb: Breadcrumb,
): Breadcrumb | null => {
  if (
    breadcrumb.category === 'console' &&
    typeof breadcrumb.message === 'string'
  ) {
    breadcrumb = {
      ...breadcrumb,
      message: scrubConsoleMessage(breadcrumb.message),
    };
  }

  if (!breadcrumb.data) return breadcrumb;

  const data = { ...breadcrumb.data };

  for (const key of ['url', 'from', 'to']) {
    if (typeof data[key] === 'string') {
      data[key] = safeRoute(data[key]);
    }
  }
  delete data.body;
  delete data.request_body;
  delete data.response_body;
  delete data.arguments;
  for (const key of Object.keys(data)) {
    if (QUERY_ATTRIBUTE.test(key)) delete data[key];
  }

  if (data.headers && typeof data.headers === 'object') {
    data.headers = sanitiseHeaders(data.headers as Record<string, string>);
  }

  return { ...breadcrumb, data };
};

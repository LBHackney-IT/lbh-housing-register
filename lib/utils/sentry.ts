import * as Sentry from '@sentry/nextjs';

export const getSentrySurface = (route: string): string => {
  if (route.startsWith('/applications')) return 'staff';
  if (route.startsWith('/apply')) return 'resident';
  return 'public';
};

type FetchContext = {
  operation: string;
  route: string;
};

export const normaliseApiRoute = (url: string): string => {
  const withoutQuery = url.split(/[?#]/)[0];
  let path = withoutQuery;

  try {
    path = new URL(withoutQuery, 'https://sentry.local').pathname;
  } catch {
    // Keep the original value if it is not URL-like.
  }

  return path
    .replace(/\/api\/applications\/[^/]+/, '/api/applications/[id]')
    .replace(/\/api\/address\/[^/]+/, '/api/address/[postcode]')
    .replace(
      /\/api\/reports\/novalet\/(approve|download)\/[^/]+/,
      '/api/reports/novalet/$1/[fileName]',
    );
};

export const getErrorStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }

  const status = (error as { response?: { status?: unknown } }).response
    ?.status;
  return typeof status === 'number' ? status : undefined;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

const pageIsHidden = (): boolean =>
  typeof document !== 'undefined' && document.visibilityState === 'hidden';

const captureHttpFailure = (
  error: unknown,
  method: string,
  context: FetchContext,
  status?: number,
): void => {
  const statusCode = status === undefined ? undefined : String(status);

  Sentry.captureException(error, {
    fingerprint: statusCode
      ? ['http-client', method, context.route, statusCode]
      : ['network-error', context.operation],
    tags: {
      operation: context.operation,
      'http.method': method,
      'http.route': context.route,
      ...(statusCode ? { 'http.status_code': statusCode } : {}),
    },
  });
};

export async function fetchWithSentry(
  url: string,
  init: RequestInit,
  context: FetchContext,
): Promise<Response> {
  const method = init.method ?? 'GET';

  try {
    const response = await fetch(url, init);

    // Call sites name the operation. Capturing here, instead of the HTTP
    // client integration, keeps that name on the event.
    if (response.status >= 500) {
      captureHttpFailure(
        new Error(`${context.operation} failed with status ${response.status}`),
        method,
        context,
        response.status,
      );
    }

    return response;
  } catch (error) {
    // Aborts and background-tab failures are routine on the resident journey.
    if (!isAbortError(error) && !pageIsHidden()) {
      captureHttpFailure(error, method, context);
    }
    throw error;
  }
}

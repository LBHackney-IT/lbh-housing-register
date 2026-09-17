import * as Sentry from '@sentry/nextjs';

type FetchContext = {
  operation: string;
  route: string;
};

const APPLICATION_ID_SEGMENT = '[applicationId]';

export const normaliseApiRoute = (url: string): string => {
  const withoutQuery = url.split(/[?#]/)[0];
  let path = withoutQuery;

  try {
    path = new URL(withoutQuery, 'https://sentry.local').pathname;
  } catch {
    // Keep the original value if it is not URL-like.
  }

  return path
    .replace(
      /\/api\/applications\/[^/]+/,
      `/api/applications/${APPLICATION_ID_SEGMENT}`,
    )
    .replace(/\/api\/address\/[^/]+/, '/api/address/[postcode]')
    .replace(
      /\/api\/reports\/novalet\/(approve|download)\/[^/]+/,
      '/api/reports/novalet/$1/[fileName]',
    );
};

export const createSafeSentryError = (
  error: unknown,
  message: string,
): Error => {
  const safeError = new Error(message);

  if (error instanceof Error) {
    safeError.name = error.name;
    safeError.stack = error.stack;
  }

  return safeError;
};

export async function fetchWithSentry(
  url: string,
  init: RequestInit,
  context: FetchContext,
): Promise<Response> {
  const method = init.method ?? 'GET';

  try {
    const response = await fetch(url, init);

    if (!response.ok && response.status < 500) {
      Sentry.addBreadcrumb({
        category: 'http.client',
        level: 'warning',
        message: `${context.operation} returned an expected client error`,
        data: {
          method,
          route: context.route,
          status: response.status,
        },
      });
    }

    // 5xx responses are captured once by httpClientIntegration. It produces
    // the event before fetch resolves, and beforeSend adds the safe route,
    // method and status tags.
    return response;
  } catch (error) {
    // httpClientIntegration only reports requests with a response. Capture
    // network failures here so offline/DNS/connection errors are not lost.
    Sentry.captureException(error, {
      tags: {
        operation: context.operation,
        'http.method': method,
        'http.route': context.route,
      },
    });
    throw error;
  }
}

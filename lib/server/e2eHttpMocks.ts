import nock from 'nock';

export type E2eNockRegisterPayload = {
  hostname: string;
  method: string;
  path: string;
  statusCode?: number;
  /** Alias used by some Cypress helpers */
  status?: number;
  body?: unknown;
  persist?: boolean;
  delay?: number;
};

export type CapturedE2eRequest = {
  hostname: string;
  method: string;
  path: string;
  body: unknown;
  at: number;
};

function normalizeHostname(hostname: string): string {
  const trimmed = hostname.trim().replaceAll(/^['"]|['"]$/g, '');
  if (!trimmed) {
    throw new TypeError('E2E nock: hostname is required');
  }
  return trimmed;
}

/**
 * Requests matched by any registered mock, most-recent last. Lets tests
 * assert on *what* the server actually sent to a mocked dependency (e.g.
 * GOV.UK Notify) rather than only on the response status. This matters
 * because some callers (see `lib/gateways/notify-api.ts`) deliberately
 * swallow the downstream response/error and always report success upstream,
 * so the caller's HTTP status can't be used to infer what was sent.
 *
 * Note: nock's default behaviour for a request that doesn't match *any*
 * registered interceptor for a mocked host is to fall through to the real
 * network, not to fail loudly - so mocks should match on path only (not on
 * request body) and rely on this capture log for body assertions, rather
 * than on registering a deliberately-non-matching interceptor.
 */
const capturedRequests: CapturedE2eRequest[] = [];

export function getCapturedE2eRequests(
  hostname: string,
  method: string,
  path: string,
): CapturedE2eRequest[] {
  const normalizedHostname = normalizeHostname(hostname);
  const normalizedMethod = method.toLowerCase();
  return capturedRequests.filter(
    (request) =>
      request.hostname === normalizedHostname &&
      request.method === normalizedMethod &&
      request.path === path,
  );
}

/**
 * Registers an HTTP mock in the **Next.js server process** so SSR and API routes
 * see the same interceptors as in-app fetches.
 */
export function registerE2eNockMock(input: E2eNockRegisterPayload): void {
  const hostname = normalizeHostname(input.hostname);
  const method = input.method.toLowerCase();
  const status = input.statusCode ?? input.status ?? 200;
  const delay = input.delay ?? 0;
  const path = input.path;

  if (!nock.isActive()) {
    nock.activate();
  }

  const scope = nock(hostname);
  const verb = method as
    | 'get'
    | 'post'
    | 'patch'
    | 'put'
    | 'delete'
    | 'head'
    | 'options';

  if (
    typeof (scope as unknown as Record<string, unknown>)[verb] !== 'function'
  ) {
    throw new TypeError(`E2E nock: unsupported method "${method}"`);
  }

  const interceptor = (
    scope as unknown as {
      [k: string]: (p: string) => nock.Interceptor;
    }
  )[verb](path);

  interceptor
    .delay(delay)
    .reply(status, (_uri: string, requestBody: unknown) => {
      capturedRequests.push({
        hostname,
        method,
        path,
        body: requestBody,
        at: Date.now(),
      });
      return input.body as nock.Body;
    })
    .persist(!!input.persist);
}

export function clearE2eNockMocks(): void {
  nock.restore();
  nock.cleanAll();
  capturedRequests.length = 0;
}

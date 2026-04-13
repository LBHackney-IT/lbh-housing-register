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

function normalizeHostname(hostname: string): string {
  const trimmed = hostname.trim().replaceAll(/^['"]|['"]$/g, '');
  if (!trimmed) {
    throw new Error('E2E nock: hostname is required');
  }
  return trimmed;
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
    throw new Error(`E2E nock: unsupported method "${method}"`);
  }

  const interceptor = (
    scope as unknown as {
      [k: string]: (p: string) => nock.Interceptor;
    }
  )[verb](path);

  interceptor
    .delay(delay)
    .reply(status, input.body as nock.Body)
    .persist(!!input.persist);
}

export function clearE2eNockMocks(): void {
  nock.restore();
  nock.cleanAll();
}

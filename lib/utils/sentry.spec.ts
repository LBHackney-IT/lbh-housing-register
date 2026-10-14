import * as Sentry from '@sentry/nextjs';
import {
  fetchWithSentry,
  getErrorStatusCode,
  normaliseApiRoute,
} from './sentry';

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

const captureException = Sentry.captureException as jest.Mock;

describe('Sentry fetch instrumentation', () => {
  const originalVisibility = Object.getOwnPropertyDescriptor(
    document,
    'visibilityState',
  );

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    if (originalVisibility) {
      Object.defineProperty(document, 'visibilityState', originalVisibility);
    }
  });

  it.each([
    [
      '/api/applications/abc-123/evidence?token=secret',
      '/api/applications/[id]/evidence',
    ],
    [
      'https://example.test/api/address/E8%201AA?lookup=true',
      '/api/address/[postcode]',
    ],
    [
      '/api/reports/novalet/download/report.csv',
      '/api/reports/novalet/download/[fileName]',
    ],
  ])('normalises %s to %s', (url, expected) => {
    expect(normaliseApiRoute(url)).toBe(expected);
  });

  it('reads an upstream HTTP status without copying the error payload', () => {
    const error = Object.assign(new Error('Request failed'), {
      response: { status: 503 },
      config: {
        headers: { 'x-api-key': 'secret' },
        data: { email: 'resident@example.test' },
      },
    });

    expect(getErrorStatusCode(error)).toBe(503);
    expect(getErrorStatusCode(new Error('no status'))).toBeUndefined();
  });

  it('leaves 4xx responses to breadcrumbs', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
    });

    await fetchWithSentry(
      '/api/applications',
      { method: 'POST', body: 'private application data' },
      {
        operation: 'staff_create_application',
        route: '/api/applications',
      },
    );

    expect(captureException).not.toHaveBeenCalled();
  });

  it('does not treat a 304 as a client error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 304,
    });

    await fetchWithSentry(
      '/api/applications',
      { method: 'GET' },
      {
        operation: 'load_application',
        route: '/api/applications',
      },
    );

    expect(captureException).not.toHaveBeenCalled();
  });

  it('captures 5xx responses once, using the call-site operation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await fetchWithSentry(
      '/api/applications/app-1',
      { method: 'PATCH', body: 'private application data' },
      {
        operation: 'disqualify_application',
        route: '/api/applications/[id]',
      },
    );

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'disqualify_application failed with status 503',
      }),
      {
        fingerprint: ['http-client', 'PATCH', '/api/applications/[id]', '503'],
        tags: {
          operation: 'disqualify_application',
          'http.method': 'PATCH',
          'http.route': '/api/applications/[id]',
          'http.status_code': '503',
        },
      },
    );
    expect(JSON.stringify(captureException.mock.calls[0])).not.toContain(
      'private application data',
    );
  });

  it('captures failures which occur before a response exists', async () => {
    const error = new TypeError('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValue(error);

    await expect(
      fetchWithSentry(
        '/api/applications/app-1',
        { method: 'PATCH', body: 'private application data' },
        {
          operation: 'update_application',
          route: '/api/applications/[id]',
        },
      ),
    ).rejects.toBe(error);

    expect(captureException).toHaveBeenCalledWith(error, {
      fingerprint: ['network-error', 'update_application'],
      tags: {
        operation: 'update_application',
        'http.method': 'PATCH',
        'http.route': '/api/applications/[id]',
      },
    });
    expect(JSON.stringify(captureException.mock.calls[0])).not.toContain(
      'private application data',
    );
  });

  it('skips aborts and requests made while the tab is hidden', async () => {
    const abortError = new DOMException(
      'The operation was aborted',
      'AbortError',
    );
    global.fetch = jest.fn().mockRejectedValue(abortError);

    await expect(
      fetchWithSentry(
        '/api/applications/app-1',
        { method: 'PATCH' },
        {
          operation: 'update_application',
          route: '/api/applications/[id]',
        },
      ),
    ).rejects.toBe(abortError);
    expect(captureException).not.toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    const networkError = new TypeError('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValue(networkError);

    await expect(
      fetchWithSentry(
        '/api/applications/app-1',
        { method: 'PATCH' },
        {
          operation: 'update_application',
          route: '/api/applications/[id]',
        },
      ),
    ).rejects.toBe(networkError);
    expect(captureException).not.toHaveBeenCalled();
  });
});

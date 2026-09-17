import * as Sentry from '@sentry/nextjs';
import {
  createSafeSentryError,
  fetchWithSentry,
  normaliseApiRoute,
} from './sentry';

jest.mock('@sentry/nextjs', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
}));

const addBreadcrumb = Sentry.addBreadcrumb as jest.Mock;
const captureException = Sentry.captureException as jest.Mock;

describe('Sentry fetch instrumentation', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it.each([
    [
      '/api/applications/abc-123/evidence?token=secret',
      '/api/applications/[applicationId]/evidence',
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

  it('retains debugging stack data without copying sensitive error fields', () => {
    const original = Object.assign(new Error('Request failed'), {
      config: {
        headers: { 'x-api-key': 'secret' },
        data: { email: 'resident@example.test' },
      },
    });

    const safeError = createSafeSentryError(
      original,
      'Unable to load staff worktray',
    );

    expect(safeError).toMatchObject({
      name: 'Error',
      message: 'Unable to load staff worktray',
      stack: original.stack,
    });
    expect(safeError).not.toHaveProperty('config');
  });

  it('records expected 4xx responses as breadcrumbs', async () => {
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

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'http.client',
      level: 'warning',
      message: 'staff_create_application returned an expected client error',
      data: {
        method: 'POST',
        route: '/api/applications',
        status: 409,
      },
    });
    expect(captureException).not.toHaveBeenCalled();
  });

  it('leaves 5xx responses to the HTTP integration to avoid duplicates', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await fetchWithSentry(
      '/api/applications/app-1',
      { method: 'PATCH' },
      {
        operation: 'update_application',
        route: '/api/applications/[applicationId]',
      },
    );

    expect(addBreadcrumb).not.toHaveBeenCalled();
    expect(captureException).not.toHaveBeenCalled();
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
          route: '/api/applications/[applicationId]',
        },
      ),
    ).rejects.toBe(error);

    expect(captureException).toHaveBeenCalledWith(error, {
      tags: {
        operation: 'update_application',
        'http.method': 'PATCH',
        'http.route': '/api/applications/[applicationId]',
      },
    });
    expect(captureException.mock.calls[0]).not.toContain(
      'private application data',
    );
  });
});

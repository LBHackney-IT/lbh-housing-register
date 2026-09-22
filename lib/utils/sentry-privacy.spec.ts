import type { Breadcrumb, Event } from '@sentry/nextjs';
import {
  sanitiseSentryBreadcrumb,
  sanitiseSentryEvent,
} from './sentry-privacy';

describe('Sentry privacy filters', () => {
  it('removes secrets and enriches HTTP client errors with safe tags', () => {
    const event: Event = {
      exception: {
        values: [
          {
            mechanism: {
              type: 'auto.http.client.fetch',
              handled: false,
            },
          },
        ],
      },
      request: {
        url: 'https://housing.test/api/applications/app-123/evidence?token=secret',
        method: 'POST',
        cookies: {
          hackneyToken: 'secret',
          housing_user: 'secret',
        },
        headers: {
          Authorization: 'Bearer secret',
          Cookie: 'hackneyToken=secret',
          'Content-Type': 'application/json',
        },
        data: {
          medicalInformation: 'private',
        },
      },
      contexts: {
        response: {
          status_code: 503,
        },
      },
      extra: {
        arguments: ['private application data'],
        body: { medicalInformation: 'private' },
        correlationId: 'safe-id',
      },
    };

    const result = sanitiseSentryEvent(event);

    expect(result.request).toEqual({
      url: '/api/applications/[applicationId]/evidence',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result.tags).toEqual({
      operation: 'create_evidence_request',
      'http.method': 'POST',
      'http.route': '/api/applications/[applicationId]/evidence',
      'http.status_code': '503',
    });
    expect(result.fingerprint).toEqual([
      'http-client',
      'POST',
      '/api/applications/[applicationId]/evidence',
      '503',
    ]);
    expect(result.extra).toEqual({ correlationId: 'safe-id' });
  });

  it('allows only known-safe custom error fields', () => {
    const event: Event = {
      exception: {
        values: [
          { type: 'CreateApplicationError' },
          { type: 'SensitiveFormError' },
        ],
      },
      contexts: {
        CreateApplicationError: {
          status: 409,
          applicationIds: ['app-1'],
          email: 'resident@example.test',
        },
        SensitiveFormError: {
          answers: { medicalNeed: true },
        },
      },
    };

    expect(sanitiseSentryEvent(event).contexts).toEqual({
      CreateApplicationError: {
        status: 409,
        applicationIds: ['app-1'],
      },
    });
  });

  it('removes bodies, arguments and query strings from breadcrumbs', () => {
    const breadcrumb: Breadcrumb = {
      category: 'fetch',
      data: {
        url: '/api/address/E8%201AA?uprn=secret',
        body: 'private',
        request_body: 'private',
        response_body: 'private',
        arguments: ['private'],
        headers: {
          authorization: 'secret',
          Accept: 'application/json',
        },
      },
    };

    expect(sanitiseSentryBreadcrumb(breadcrumb)).toEqual({
      category: 'fetch',
      data: {
        url: '/api/address/[postcode]',
        headers: {
          Accept: 'application/json',
        },
      },
    });
  });

  it('sanitises navigation URLs and removes duplicate 4xx fetch breadcrumbs', () => {
    expect(
      sanitiseSentryBreadcrumb({
        category: 'navigation',
        data: {
          from: '/applications?assignedTo=staff@example.test',
          to: '/applications/view/app-1?search=resident-name',
        },
      }),
    ).toEqual({
      category: 'navigation',
      data: {
        from: '/applications',
        to: '/applications/view/app-1',
      },
    });

    expect(
      sanitiseSentryBreadcrumb({
        category: 'fetch',
        data: {
          url: '/api/resident-auth/verify',
          status_code: 404,
        },
      }),
    ).toBeNull();
  });
});

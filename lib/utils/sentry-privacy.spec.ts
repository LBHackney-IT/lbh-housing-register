import type { TransactionEvent } from '@sentry/core';
import type { Breadcrumb, Event } from '@sentry/nextjs';
import {
  sanitiseSentryBreadcrumb,
  sanitiseSentryEvent,
  sanitiseSentrySpan,
  sanitiseSentryTransaction,
} from './sentry-privacy';

describe('Sentry privacy filters', () => {
  it('removes secrets, query strings and referrers from events', () => {
    const event: Event = {
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
          Referer:
            'https://housing.test/api/auth/callback/cognito?code=secret&state=secret',
          'Content-Type': 'application/json',
        },
        data: {
          medicalInformation: 'private',
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
      url: 'https://housing.test/api/applications/[id]/evidence',
      method: 'POST',
      headers: {
        Referer: 'https://housing.test/api/auth/callback/cognito',
        'Content-Type': 'application/json',
      },
    });
    expect(result.extra).toEqual({ correlationId: 'safe-id' });
  });

  it('removes bodies, arguments and query strings from breadcrumbs', () => {
    const breadcrumb: Breadcrumb = {
      category: 'fetch',
      data: {
        url: '/api/address/E8%201AA?uprn=secret',
        'http.query': '?assignedTo=staff@hackney.gov.uk',
        'http.fragment': '#secret',
        body: 'private',
        request_body: 'private',
        response_body: 'private',
        arguments: ['private'],
        headers: {
          authorization: 'secret',
          Referer: '/apply/overview?token=secret',
          Accept: 'application/json',
        },
      },
    };

    expect(sanitiseSentryBreadcrumb(breadcrumb)).toEqual({
      category: 'fetch',
      data: {
        url: '/api/address/[postcode]',
        headers: {
          Referer: '/apply/overview',
          Accept: 'application/json',
        },
      },
    });
  });

  it('keeps 4xx fetch breadcrumbs and console messages', () => {
    expect(
      sanitiseSentryBreadcrumb({
        category: 'fetch',
        data: {
          url: '/api/auth/session?next=/applications',
          status_code: 401,
        },
      }),
    ).toEqual({
      category: 'fetch',
      data: {
        url: '/api/auth/session',
        status_code: 401,
      },
    });

    expect(
      sanitiseSentryBreadcrumb({
        category: 'console',
        message: 'Unable to save application for resident@example.test',
        data: {
          arguments: ['Unable to save application for resident@example.test'],
        },
      }),
    ).toEqual({
      category: 'console',
      message: 'Unable to save application for resident@example.test',
      data: {},
    });
  });

  it('keeps the host on external urls and labels page events from the transaction', () => {
    expect(
      sanitiseSentryBreadcrumb({
        category: 'fetch',
        data: {
          url: 'https://www.google-analytics.com/collect?tid=UA-1',
        },
      }),
    ).toEqual({
      category: 'fetch',
      data: {
        url: 'https://www.google-analytics.com/collect',
      },
    });

    expect(
      sanitiseSentryEvent({
        transaction: '/applications/view/[id]',
        tags: { application_id: 'staff-app-id' },
      }).tags,
    ).toEqual({
      application_id: 'staff-app-id',
      route: '/applications/view/[id]',
      surface: 'staff',
    });

    const apiEvent: Event = { transaction: '/api/applications/[id]' };
    expect(sanitiseSentryEvent(apiEvent).tags).toBeUndefined();
  });

  it('sanitises navigation URLs', () => {
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
  });

  it('removes resident details from console messages and notify payloads', () => {
    const event: Event = {
      logger: 'console',
      message:
        'Unable to generate export file {"status":500,"data":{"email":"resident@example.test"}}',
      extra: {
        notifyRequest: {
          emailAddress: 'resident@example.test',
          personalisation: { household_members_with_medical_need: 1 },
          reference: 'APP-1',
        },
        correlationId: 'safe-id',
      },
    };

    const result = sanitiseSentryEvent(event);

    expect(result.message).toBe('Unable to generate export file');
    expect(result.extra).toEqual({
      notifyRequest: { reference: 'APP-1' },
      correlationId: 'safe-id',
    });
    expect(JSON.stringify(result)).not.toContain('resident@example.test');
    expect(JSON.stringify(result)).not.toContain('medical');
  });

  it('strips query strings from transactions and span attributes', () => {
    const event: TransactionEvent = {
      type: 'transaction',
      transaction: '/apply/verify',
      request: {
        url: 'https://housing.test/apply/verify?email=resident@example.test',
        query_string: 'email=resident@example.test',
        headers: {
          Referer:
            'https://housing.test/api/auth/callback/cognito?code=secret&state=secret',
        },
      },
      spans: [
        {
          span_id: 'span',
          trace_id: 'trace',
          start_timestamp: 0,
          description: 'GET /apply/verify?email=resident@example.test',
          data: {
            'url.full':
              'https://housing.test/apply/verify?email=resident@example.test',
            'url.query': '?email=resident@example.test',
            'http.query': '?assignedTo=staff@hackney.gov.uk',
            'http.fragment': '#section',
            'http.request.header.referer':
              'https://housing.test/api/auth/callback/cognito?code=secret',
            'http.request.header.cookie': 'housing_user=secret',
          },
        },
      ],
    };

    const result = sanitiseSentryTransaction(event);

    expect(result.request).toEqual({
      url: 'https://housing.test/apply/verify',
      headers: {
        Referer: 'https://housing.test/api/auth/callback/cognito',
      },
    });
    expect(result.spans?.[0]).toMatchObject({
      description: 'GET /apply/verify',
      data: {
        'url.full': 'https://housing.test/apply/verify',
        'http.request.header.referer':
          'https://housing.test/api/auth/callback/cognito',
      },
    });
    expect(
      result.spans?.[0].data?.['http.request.header.cookie'],
    ).toBeUndefined();
    expect(result.spans?.[0].data?.['url.query']).toBeUndefined();
    expect(result.spans?.[0].data?.['http.query']).toBeUndefined();
    expect(result.spans?.[0].data?.['http.fragment']).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain('resident@example.test');
    expect(JSON.stringify(result)).not.toContain('staff@hackney.gov.uk');
    expect(JSON.stringify(result)).not.toContain('code=secret');

    const span = sanitiseSentrySpan({
      span_id: 'span',
      trace_id: 'trace',
      start_timestamp: 0,
      data: {
        'url.full': 'https://www.google-analytics.com/collect?tid=UA-1',
      },
    });
    expect(span.data?.['url.full']).toBe(
      'https://www.google-analytics.com/collect',
    );
  });
});

/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { createMocks } from 'node-mocks-http';

import endpoint from '../../../pages/api/robots';
import { ApiRequest, ApiResponse } from '../../../testUtils/types';

describe('/api/robots', () => {
  const originalEnvironment = process.env;

  afterEach(() => {
    process.env = originalEnvironment;
  });

  const callEndpoint = async (method: 'GET' | 'POST' = 'GET') => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method,
    });

    await endpoint(req, res);

    return res;
  };

  it('disallows crawling outside production', async () => {
    process.env = { ...originalEnvironment, SENTRY_ENVIRONMENT: 'staging' };

    const res = await callEndpoint();

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.getHeader('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(res.getHeader('Cache-Control')).toBe('no-store');
    expect(res._getData()).toBe('User-agent: *\nDisallow: /\n');
  });

  it('allows crawling in production', async () => {
    process.env = { ...originalEnvironment, SENTRY_ENVIRONMENT: 'production' };

    const res = await callEndpoint();

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getData()).toBe('User-agent: *\nAllow: /\n');
  });

  it('returns 405 for methods other than GET', async () => {
    const res = await callEndpoint('POST');

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET');
    expect(res._getJSONData()).toStrictEqual({ message: 'Method not allowed' });
  });
});

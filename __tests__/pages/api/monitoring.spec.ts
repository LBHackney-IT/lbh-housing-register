/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from 'node-mocks-http';

import {
  forwardSentryTunnel,
  SENTRY_DSN,
  SENTRY_TUNNEL_MAX_BODY_BYTES,
} from '../../../lib/server/sentry-tunnel';
import endpoint from '../../../pages/api/monitoring';
import { ApiResponse } from '../../../testUtils/types';

type Rewrite = { source: string; destination: string };

type NextConfigModule = {
  rewrites: () => Promise<Rewrite[]>;
};

type SentryBuildOptions = {
  tunnelRoute?: string;
  webpack?: {
    excludeServerRoutes?: string[];
  };
};

const envelope = (dsn: string) =>
  Buffer.from(
    `${JSON.stringify({ dsn })}\n${JSON.stringify({ type: 'event' })}\n${JSON.stringify({})}\n`,
  );

const call = async (method: string, body?: Buffer | string) => {
  const stream = Readable.from(body ? [body] : []);
  const req = Object.assign(stream, { method }) as unknown as NextApiRequest;
  const res = createResponse() as ApiResponse;

  await endpoint(req, res as NextApiResponse);

  return res;
};

describe('Sentry tunnel', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      new Response('forwarded', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      }),
    );
    global.fetch = fetchMock as typeof fetch;
  });

  it('forwards an envelope for this app DSN', async () => {
    const response = await forwardSentryTunnel(envelope(SENTRY_DSN));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('forwarded');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain(
      'https://o183917.ingest.us.sentry.io/api/6292602/envelope/',
    );
    expect(url).toContain('sentry_key=6fb0dd07e0fc4a75b0ab84b8e1f36460');
  });

  it('rejects an envelope for a different DSN', async () => {
    const response = await forwardSentryTunnel(
      envelope('https://public@o1.ingest.us.sentry.io/1'),
    );

    expect(response.status).toBe(StatusCodes.FORBIDDEN);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a body that is not an envelope', async () => {
    const response = await forwardSentryTunnel(Buffer.from('not-an-envelope'));

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 500 when Sentry cannot be reached', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const response = await forwardSentryTunnel(envelope(SENTRY_DSN));

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('does not accept GET', async () => {
    const res = await call('GET');

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('POST');
    expect(res.getHeader('Cache-Control')).toBe('private, no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards a POST envelope through the route', async () => {
    const res = await call('POST', envelope(SENTRY_DSN));

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.getHeader('Content-Type')).toBe('text/plain');
    expect(res.getHeader('Cache-Control')).toBe('private, no-store');
    expect(res._getData()).toEqual(Buffer.from('forwarded'));
  });

  it('forwards Sentry rate-limit headers to the browser SDK', async () => {
    fetchMock.mockResolvedValue(
      new Response('limited', {
        status: StatusCodes.TOO_MANY_REQUESTS,
        headers: {
          'content-type': 'text/plain',
          'retry-after': '30',
          'x-sentry-rate-limits': '30:error:organization',
        },
      }),
    );

    const res = await call('POST', envelope(SENTRY_DSN));

    expect(res.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);
    expect(res.getHeader('Retry-After')).toBe('30');
    expect(res.getHeader('X-Sentry-Rate-Limits')).toBe('30:error:organization');
  });

  it('rejects a POST that is not an envelope', async () => {
    const res = await call('POST', Buffer.from('not-an-envelope'));

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('reads a string body chunk', async () => {
    const res = await call('POST', 'not-an-envelope');

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('omits content-type when Sentry does not send one', async () => {
    const upstream = new Response('forwarded', { status: 200 });
    upstream.headers.delete('content-type');
    fetchMock.mockResolvedValue(upstream);

    const res = await call('POST', envelope(SENTRY_DSN));

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.getHeader('Content-Type')).toBeUndefined();
  });

  it('rewrites /monitoring to the API route and does not register tunnelRoute', async () => {
    const sentry = jest.requireMock('@sentry/nextjs') as {
      withSentryConfig: (
        config: NextConfigModule,
        options: SentryBuildOptions,
      ) => NextConfigModule;
    };
    sentry.withSentryConfig = (config, options) => {
      expect(options.tunnelRoute).toBeUndefined();
      expect(options.webpack?.excludeServerRoutes).toEqual(['/api/monitoring']);
      return config;
    };

    let loaded: NextConfigModule | undefined;
    jest.isolateModules(() => {
      // next.config.js is CommonJS.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      loaded = require('../../../next.config') as NextConfigModule;
    });

    const rewrites = await loaded!.rewrites();
    expect(rewrites).toEqual(
      expect.arrayContaining([
        { source: '/monitoring', destination: '/api/monitoring' },
      ]),
    );
  });

  it('points the browser SDK at the same-origin tunnel', () => {
    const sentry = jest.requireMock('@sentry/nextjs') as { init: jest.Mock };

    jest.isolateModules(() => {
      // Re-evaluate the client init inside an isolated module registry.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../instrumentation-client');
    });

    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ tunnel: '/monitoring' }),
    );
  });

  it('keeps an event when the navigation recovery flag is not set', () => {
    const sentry = jest.requireMock('@sentry/nextjs') as { init: jest.Mock };

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../instrumentation-client');
    });

    const options = sentry.init.mock.calls.at(-1)?.[0] as {
      beforeSend: (event: { message?: string }) => { message?: string };
    };

    expect(options.beforeSend({ message: 'kept' })).toMatchObject({
      message: 'kept',
    });
  });

  it('rejects a body over the tunnel limit', async () => {
    const res = await call(
      'POST',
      Buffer.alloc(SENTRY_TUNNEL_MAX_BODY_BYTES + 1),
    );

    expect(res.statusCode).toBe(StatusCodes.REQUEST_TOO_LONG);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

jest.mock('@opennextjs/aws/overrides/wrappers/aws-lambda.js', () => ({
  __esModule: true,
  default: {
    wrapper: jest.fn(),
  },
}));

jest.mock('@sentry/aws-serverless', () => ({
  wrapHandler: (handler: unknown) => handler,
}));

import awsLambdaWrapper from '@opennextjs/aws/overrides/wrappers/aws-lambda.js';
import { StatusCodes } from 'http-status-codes';

import sentryWrapper from './open-next-sentry-wrapper';

const baseWrapper = awsLambdaWrapper.wrapper as jest.Mock;

// Same shape as a host header Node cannot parse: template characters, a
// scheme separator, and a fragment marker. The collector host is not included.
const UNPARSEABLE_URL =
  'https://${jndi:ldap://127.0.0.1#invalid.example:1389/a}/';
const PARSEABLE_URL = 'https://housing-register.example/applications';

describe('aws-lambda-sentry wrapper', () => {
  const nextHandler = jest.fn();
  const defaultHandler = jest.fn();
  const convertFrom = jest.fn();
  const converter = {
    name: 'test',
    convertFrom,
    convertTo: jest.fn(),
  };

  beforeEach(() => {
    defaultHandler.mockResolvedValue({ statusCode: 200, body: 'ok' });
    baseWrapper.mockResolvedValue(defaultHandler);
  });

  async function invoke(event: unknown) {
    const handler = await sentryWrapper.wrapper(
      nextHandler,
      converter as never,
    );
    return handler(event as never);
  }

  it('passes the handler and converter to the OpenNext wrapper', async () => {
    convertFrom.mockResolvedValue({ url: PARSEABLE_URL });

    await invoke({ httpMethod: 'GET' });

    expect(baseWrapper).toHaveBeenCalledWith(nextHandler, converter);
  });

  it('returns 400 and does not route when the request URL cannot be parsed', async () => {
    convertFrom.mockResolvedValue({ url: UNPARSEABLE_URL });

    await expect(invoke({ httpMethod: 'GET', path: '/' })).resolves.toEqual({
      statusCode: StatusCodes.BAD_REQUEST,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: 'Bad Request',
      isBase64Encoded: false,
    });
    expect(defaultHandler).not.toHaveBeenCalled();
  });

  it('routes a request whose URL can be parsed', async () => {
    const event = { httpMethod: 'GET', path: '/applications' };
    convertFrom.mockResolvedValue({ url: PARSEABLE_URL });

    await expect(invoke(event)).resolves.toEqual({
      statusCode: 200,
      body: 'ok',
    });
    expect(defaultHandler).toHaveBeenCalledWith(event);
  });

  it('leaves warmer events to the OpenNext wrapper', async () => {
    const event = { type: 'warmer', delay: 1 };

    await invoke(event);

    expect(convertFrom).not.toHaveBeenCalled();
    expect(defaultHandler).toHaveBeenCalledWith(event);
  });

  it('routes when the converted event has no request URL', async () => {
    const event = { httpMethod: 'GET' };
    convertFrom.mockResolvedValue({});

    await invoke(event);

    expect(defaultHandler).toHaveBeenCalledWith(event);
  });

  it('routes when the converted URL is not a string', async () => {
    const event = { httpMethod: 'GET' };
    convertFrom.mockResolvedValue({ url: 1 });

    await invoke(event);

    expect(defaultHandler).toHaveBeenCalledWith(event);
  });

  it('routes when conversion does not return an event', async () => {
    const event = { httpMethod: 'GET' };
    convertFrom.mockResolvedValue(null);

    await invoke(event);

    expect(defaultHandler).toHaveBeenCalledWith(event);
  });

  it('converts a non-object event that is not a warmer', async () => {
    convertFrom.mockResolvedValue({ url: PARSEABLE_URL });

    await invoke('not-an-event');

    expect(convertFrom).toHaveBeenCalledWith('not-an-event');
    expect(defaultHandler).toHaveBeenCalledWith('not-an-event');
  });

  it('converts a null event', async () => {
    convertFrom.mockResolvedValue({ url: PARSEABLE_URL });

    await invoke(null);

    expect(convertFrom).toHaveBeenCalledWith(null);
    expect(defaultHandler).toHaveBeenCalledWith(null);
  });
});

jest.mock('@opennextjs/aws/overrides/converters/aws-apigw-v1.js', () => ({
  __esModule: true,
  default: {
    name: 'aws-apigw-v1',
    convertFrom: jest.fn(),
    convertTo: jest.fn(),
  },
}));

import baseConverter from '@opennextjs/aws/overrides/converters/aws-apigw-v1.js';

import converter from './open-next-apigw-cookie-converter';

const baseConvertFrom = baseConverter.convertFrom as jest.Mock;
const baseConvertTo = baseConverter.convertTo as jest.Mock;

type ApiGatewayResult = {
  statusCode: number;
  headers: Record<string, string>;
  multiValueHeaders: Record<string, string[]>;
};

const convert = async (
  base: Partial<ApiGatewayResult>,
): Promise<ApiGatewayResult> => {
  baseConvertTo.mockResolvedValue({
    statusCode: 200,
    headers: {},
    multiValueHeaders: {},
    ...base,
  });
  return (await converter.convertTo(
    {} as never,
  )) as unknown as ApiGatewayResult;
};

// What OpenNext actually hands the converter: one comma-joined string. The
// state/pkce/nonce cookies carry an `Expires` date that itself contains a
// comma, so a naive split would corrupt them.
const state =
  '__Secure-next-auth.state=state-value; Max-Age=900; Path=/; Expires=Wed, 02 Sep 2026 15:07:18 GMT; HttpOnly; Secure; SameSite=Lax';
const pkce =
  '__Secure-next-auth.pkce.code_verifier=verifier-value; Max-Age=900; Path=/; Expires=Wed, 02 Sep 2026 15:07:18 GMT; HttpOnly; Secure; SameSite=Lax';
const nonce =
  '__Secure-next-auth.nonce=nonce-value; Path=/; Expires=Wed, 02 Sep 2026 15:07:18 GMT; HttpOnly; Secure; SameSite=Lax';
const callbackUrl =
  '__Secure-next-auth.callback-url=https%3A%2F%2Fexample.com%2Fapplications; Path=/; HttpOnly; Secure; SameSite=Lax';

describe('aws-apigw-v1-multi-cookie converter', () => {
  it('splits the joined sign-in cookies onto the multi-value header', async () => {
    const result = await convert({
      headers: {
        'set-cookie': [callbackUrl, state, pkce, nonce].join(','),
      },
    });

    expect(result.multiValueHeaders['set-cookie']).toEqual([
      callbackUrl,
      state,
      pkce,
      nonce,
    ]);
  });

  it('keeps the Expires date intact when splitting', async () => {
    const result = await convert({
      headers: { 'set-cookie': [state, pkce].join(',') },
    });

    for (const cookie of result.multiValueHeaders['set-cookie']) {
      expect(cookie).toContain('Expires=Wed, 02 Sep 2026 15:07:18 GMT');
    }
  });

  it('leaves no cookie on the single-value header for API Gateway to collapse', async () => {
    const result = await convert({
      headers: { 'set-cookie': [state, pkce].join(',') },
    });

    expect(result.headers['set-cookie']).toBeUndefined();
  });

  it('still emits a lone cookie such as the csrf token', async () => {
    const csrf = '__Host-next-auth.csrf-token=abc; Path=/; HttpOnly; Secure';
    const result = await convert({ headers: { 'set-cookie': csrf } });

    expect(result.multiValueHeaders['set-cookie']).toEqual([csrf]);
  });

  it('preserves cookies a future OpenNext leaves unjoined', async () => {
    const result = await convert({
      multiValueHeaders: { 'set-cookie': [state, pkce] },
    });

    expect(result.multiValueHeaders['set-cookie']).toEqual([state, pkce]);
  });

  it('passes other headers through untouched', async () => {
    const result = await convert({
      headers: {
        location: '/applications',
        'cache-control': 'no-store',
        'set-cookie': state,
      },
    });

    expect(result.headers.location).toBe('/applications');
    expect(result.headers['cache-control']).toBe('no-store');
  });

  it('leaves a cookie-free response alone', async () => {
    const result = await convert({ headers: { 'content-type': 'text/html' } });

    expect(result.multiValueHeaders).toEqual({});
  });

  it('delegates request conversion to the base converter', async () => {
    baseConvertFrom.mockResolvedValue({ method: 'GET' });

    await expect(converter.convertFrom({ httpMethod: 'GET' })).resolves.toEqual(
      { method: 'GET' },
    );
  });
});

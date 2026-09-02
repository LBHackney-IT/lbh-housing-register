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

const cookieHeaders = (result: ApiGatewayResult) =>
  Object.entries(result.headers).filter(
    ([name]) => name.toLowerCase() === 'set-cookie',
  );

describe('aws-apigw-v1-multi-cookie converter', () => {
  it('gives every cookie its own header key so none can be collapsed', async () => {
    const cookies = [
      '__Secure-next-auth.state=state-value; Path=/; HttpOnly; Secure; SameSite=Lax',
      '__Secure-next-auth.nonce=nonce-value; Path=/; HttpOnly; Secure; SameSite=Lax',
      '__Secure-next-auth.pkce.code_verifier=verifier; Path=/; HttpOnly; Secure; SameSite=Lax',
      '__Secure-next-auth.callback-url=callback; Path=/; HttpOnly; Secure; SameSite=Lax',
    ];

    const result = await convert({
      multiValueHeaders: { 'set-cookie': cookies },
    });

    const emitted = cookieHeaders(result);
    expect(emitted).toHaveLength(cookies.length);
    expect(new Set(emitted.map(([name]) => name)).size).toBe(cookies.length);
    expect(emitted.map(([, value]) => value).sort()).toEqual(
      [...cookies].sort(),
    );
  });

  it('leaves a single cookie on the canonical lower-case header', async () => {
    const result = await convert({
      multiValueHeaders: { 'set-cookie': ['__Host-next-auth.csrf-token=abc'] },
    });

    expect(result.headers['set-cookie']).toBe(
      '__Host-next-auth.csrf-token=abc',
    );
  });

  it('never leaves cookies on the array header that API Gateway drops', async () => {
    const result = await convert({
      multiValueHeaders: { 'set-cookie': ['a=1', 'b=2'] },
    });

    expect(result.multiValueHeaders['set-cookie']).toBeUndefined();
  });

  it('keeps a cookie already emitted as a plain header', async () => {
    const result = await convert({
      headers: { 'set-cookie': 'only=1' },
    });

    expect(cookieHeaders(result).map(([, value]) => value)).toEqual(['only=1']);
  });

  it('passes other headers through untouched', async () => {
    const result = await convert({
      headers: { location: '/applications', 'cache-control': 'no-store' },
      multiValueHeaders: { 'set-cookie': ['a=1', 'b=2'] },
    });

    expect(result.headers.location).toBe('/applications');
    expect(result.headers['cache-control']).toBe('no-store');
  });

  it('delegates request conversion to the base converter', async () => {
    baseConvertFrom.mockResolvedValue({ method: 'GET' });

    await expect(converter.convertFrom({ httpMethod: 'GET' })).resolves.toEqual(
      { method: 'GET' },
    );
  });
});

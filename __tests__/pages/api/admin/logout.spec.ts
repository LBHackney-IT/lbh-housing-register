/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { createMocks } from 'node-mocks-http';

import endpoint from '../../../../pages/api/admin/logout';
import { ApiRequest, ApiResponse } from '../../../../testUtils/types';

describe('/api/admin/logout', () => {
  it('redirects to Cognito with a fixed allowlisted logout URI', async () => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'GET',
      headers: {
        cookie:
          '__Secure-next-auth.session-token.0=first; __Secure-next-auth.session-token.1=second',
      },
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(302);
    const location = new URL(res._getRedirectUrl());
    expect(`${location.origin}${location.pathname}`).toBe(
      `${process.env.COGNITO_DOMAIN}/logout`,
    );
    expect(location.searchParams.get('client_id')).toBe(
      process.env.COGNITO_CLIENT_ID,
    );
    expect(location.searchParams.get('logout_uri')).toBe(
      `${process.env.NEXTAUTH_URL}/login`,
    );
    const clearedCookies = res.getHeader('Set-Cookie') as string[];
    expect(clearedCookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          '__Secure-next-auth.session-token.0=; Max-Age=0;',
        ),
        expect.stringContaining(
          '__Secure-next-auth.session-token.1=; Max-Age=0;',
        ),
      ]),
    );
    expect(clearedCookies.every((value) => value.includes('HttpOnly'))).toBe(
      true,
    );
    expect(
      clearedCookies.every((value) => value.includes('SameSite=Lax')),
    ).toBe(true);
  });

  it('returns 405 for methods other than GET', async () => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET');
    expect(res._getJSONData()).toStrictEqual({ message: 'Method not allowed' });
  });
});

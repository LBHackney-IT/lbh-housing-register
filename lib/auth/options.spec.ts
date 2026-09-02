import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import jsonwebtoken from 'jsonwebtoken';

import {
  assertStaffAuthEnvironment,
  authOptions,
  staffSessionMaxAgeSeconds,
} from './options';

describe('staff Auth.js configuration', () => {
  it('requires PKCE, state, and nonce for Cognito', () => {
    expect(authOptions.providers[0]).toMatchObject({
      id: 'cognito',
      idToken: true,
      options: {
        checks: ['pkce', 'state', 'nonce'],
        client: { token_endpoint_auth_method: 'client_secret_post' },
      },
    });
  });

  it('keeps the NextAuth session aligned with an 8-hour Cognito ID token', () => {
    expect(staffSessionMaxAgeSeconds).toBe(8 * 60 * 60);
    expect(authOptions.session).toMatchObject({
      strategy: 'jwt',
      maxAge: staffSessionMaxAgeSeconds,
    });
    expect(authOptions.jwt).toMatchObject({
      maxAge: staffSessionMaxAgeSeconds,
    });
  });

  it('does not expose the Cognito ID token or groups as top-level session data', async () => {
    const callback = authOptions.callbacks?.session;
    expect(callback).toBeDefined();

    const session: Session = {
      expires: new Date(Date.now() + 60_000).toISOString(),
      user: { name: 'Officer', email: 'officer@hackney.gov.uk' },
    };
    const token: JWT = {
      cognitoIdToken: 'secret-id-token',
      cognitoSub: 'stable-sub',
      groups: ['officers'],
    };

    const result = await callback!({ session, token } as Parameters<
      NonNullable<typeof callback>
    >[0]);

    expect(result.user).toMatchObject({
      id: 'stable-sub',
      groups: ['officers'],
    });
    expect(result).not.toHaveProperty('cognitoIdToken');
    expect(JSON.stringify(result)).not.toContain('secret-id-token');
  });

  it('logs OAuth error codes without profiles or tokens', () => {
    expect(authOptions.events).toBeUndefined();
    const { error: logError, warn, debug } = authOptions.logger ?? {};
    expect(logError).toBeDefined();
    expect(warn).toBeDefined();
    expect(debug).toBeDefined();

    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    const consoleInfo = jest.spyOn(console, 'info').mockImplementation();
    const consoleDebug = jest.spyOn(console, 'debug').mockImplementation();

    logError?.('OAUTH_CALLBACK_ERROR', {
      error: Object.assign(new Error('nonce mismatch'), {
        error: 'invalid_client',
        error_description: 'client secret rejected',
      }),
      providerId: 'cognito',
      id_token: 'must-not-be-logged',
      profile: { email: 'officer@hackney.gov.uk' },
    });
    warn?.('NEXTAUTH_URL');
    debug?.('PROFILE_DATA', { OAuthProfile: { email: 'x' } });

    const logged = JSON.stringify([
      ...consoleError.mock.calls,
      ...consoleWarn.mock.calls,
    ]);
    expect(logged).toContain('OAUTH_CALLBACK_ERROR');
    expect(logged).toContain('nonce mismatch');
    expect(logged).toContain('invalid_client');
    expect(logged).toContain('client secret rejected');
    expect(logged).toContain('cognito');
    expect(logged).toContain('NEXTAUTH_URL');
    expect(logged).not.toContain('must-not-be-logged');
    expect(logged).not.toContain('officer@hackney.gov.uk');
    expect(consoleInfo).not.toHaveBeenCalled();
    expect(consoleDebug).not.toHaveBeenCalled();

    consoleError.mockRestore();
    consoleWarn.mockRestore();
    consoleInfo.mockRestore();
    consoleDebug.mockRestore();
  });

  it('stores validated Cognito identity and parsed groups in the encrypted token', async () => {
    const callback = authOptions.callbacks?.jwt;
    expect(callback).toBeDefined();
    const idToken = jsonwebtoken.sign(
      {
        sub: 'stable-sub',
        exp: Math.floor(Date.now() / 1000) + 300,
        email: 'officer@hackney.gov.uk',
        name: 'Officer',
        'custom:groups': 'officers;managers',
      },
      'test-secret',
    );

    const result = await callback!({
      token: {},
      account: { id_token: idToken },
      profile: {},
    } as Parameters<NonNullable<typeof callback>>[0]);

    expect(result).toMatchObject({
      cognitoIdToken: idToken,
      cognitoSub: 'stable-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Officer',
      groups: ['officers', 'managers'],
    });
  });

  it('rejects a Cognito callback without a valid ID token', async () => {
    const callback = authOptions.callbacks?.jwt;

    await expect(
      callback!({
        token: {},
        account: {},
        profile: {},
      } as Parameters<NonNullable<typeof callback>>[0]),
    ).rejects.toThrow('Cognito response did not contain a valid ID token');
  });

  it('keeps same-origin redirects and rejects external redirect targets', async () => {
    const callback = authOptions.callbacks?.redirect;
    expect(callback).toBeDefined();

    await expect(
      callback!({
        url: '/applications',
        baseUrl: 'https://housing-register.hackney.gov.uk',
      }),
    ).resolves.toBe('https://housing-register.hackney.gov.uk/applications');
    await expect(
      callback!({
        url: 'https://housing-register.hackney.gov.uk/applications',
        baseUrl: 'https://housing-register.hackney.gov.uk',
      }),
    ).resolves.toBe('https://housing-register.hackney.gov.uk/applications');
    await expect(
      callback!({
        url: 'https://attacker.example',
        baseUrl: 'https://housing-register.hackney.gov.uk',
      }),
    ).resolves.toBe('https://housing-register.hackney.gov.uk');
  });

  it('reports missing required staff authentication configuration', () => {
    const initial = process.env.COGNITO_CLIENT_ID;
    delete process.env.COGNITO_CLIENT_ID;

    expect(assertStaffAuthEnvironment).toThrow(
      'Missing required staff authentication configuration: COGNITO_CLIENT_ID',
    );

    process.env.COGNITO_CLIENT_ID = initial;
  });
});

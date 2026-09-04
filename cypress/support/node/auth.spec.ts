/** @jest-environment node */

import { generateKeyPairSync } from 'node:crypto';

import jsonwebtoken from 'jsonwebtoken';
import { createRequest } from 'node-mocks-http';
import { decode, getToken } from 'next-auth/jwt';

import {
  createCognitoStaffSession,
  createMockStaffSession,
  createResidentSession,
  cypressResidentJwtSecret,
  readResidentApplicationId,
  type CypressStaffUser,
} from './auth';

const staffUser: CypressStaffUser = {
  sub: 'staff-sub',
  email: 'manager@hackney.gov.uk',
  name: 'Test Manager',
  groups: ['managers'],
};

describe('Cypress session creation', () => {
  const originalEnvironment = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnvironment,
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'cypress-nextauth-secret-at-least-32-bytes',
    };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('creates a synthetic staff session without a Cognito ID token', async () => {
    const session = await createMockStaffSession(staffUser);
    const token = await decode({
      secret: process.env.NEXTAUTH_SECRET!,
      token: session.token,
    });

    expect(session.cookies).toEqual([
      { name: 'next-auth.session-token', value: session.token },
    ]);
    expect(session.user).toEqual(staffUser);
    expect(token).toMatchObject({
      e2eStaff: true,
      cognitoSub: staffUser.sub,
      email: staffUser.email,
      groups: staffUser.groups,
    });
    expect(token).not.toHaveProperty('cognitoIdToken');
  });

  it('chunks large staff sessions using NextAuth cookie names', async () => {
    const session = await createMockStaffSession({
      ...staffUser,
      groups: ['group'.repeat(1000)],
    });

    expect(session.cookies.length).toBeGreaterThan(1);
    expect(session.cookies.map(({ name }) => name)).toEqual([
      'next-auth.session-token.0',
      'next-auth.session-token.1',
    ]);
    expect(session.cookies.map(({ value }) => value).join('')).toBe(
      session.token,
    );
    const req = createRequest();
    req.cookies = Object.fromEntries(
      session.cookies.map(({ name, value }) => [name, value]),
    );
    await expect(
      getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
      }),
    ).resolves.toMatchObject({ e2eStaff: true });
  });

  it('creates a resident session signed with the Cypress dummy secret', () => {
    const session = createResidentSession('application-id');

    expect(session.cookies).toEqual([
      { name: 'housing_user', value: session.token },
    ]);
    expect(
      jsonwebtoken.verify(session.token, cypressResidentJwtSecret),
    ).toMatchObject({ application_id: 'application-id' });
    expect(() =>
      jsonwebtoken.verify(session.token, 'not-the-cypress-dummy-secret'),
    ).toThrow();
  });

  it('reads the application id back out of a resident session', () => {
    const session = createResidentSession('backend-application-id');

    expect(readResidentApplicationId(session.token)).toBe(
      'backend-application-id',
    );
  });

  it('rejects a resident session without an application id', () => {
    const token = jsonwebtoken.sign({ sub: 'no-application' }, 'secret');

    expect(() => readResidentApplicationId(token)).toThrow(
      'Resident session does not contain an application ID',
    );
  });

  it('creates a staff session from a verified Cognito password login', async () => {
    const issuer =
      'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_test-pool';
    const clientId = 'e2e-client-id';
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const idToken = jsonwebtoken.sign(
      {
        sub: staffUser.sub,
        email: staffUser.email,
        name: staffUser.name,
        'custom:groups': 'managers;read-only',
      },
      privateKey,
      {
        algorithm: 'RS256',
        audience: clientId,
        issuer,
        expiresIn: 3600,
        keyid: 'e2e-key',
      },
    );
    process.env.COGNITO_ISSUER = issuer;
    process.env.COGNITO_E2E_CLIENT_ID = clientId;
    process.env.COGNITO_E2E_USERNAME = 'e2e-manager';
    process.env.COGNITO_E2E_PASSWORD = 'password';
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ AuthenticationResult: { IdToken: idToken } }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            keys: [
              {
                ...publicKey.export({ format: 'jwk' }),
                kid: 'e2e-key',
                alg: 'RS256',
                use: 'sig',
              },
            ],
          }),
          { status: 200 },
        ),
      );

    const session = await createCognitoStaffSession();
    const token = await decode({
      secret: process.env.NEXTAUTH_SECRET!,
      token: session.token,
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://cognito-idp.eu-west-2.amazonaws.com',
      expect.objectContaining({ method: 'POST' }),
    );
    const authRequest = JSON.parse(
      String((fetchMock.mock.calls[0][1] as RequestInit | undefined)?.body),
    ) as {
      AuthFlow: string;
      AuthParameters: Record<string, string>;
    };
    expect(authRequest.AuthFlow).toBe('USER_PASSWORD_AUTH');
    expect(authRequest.AuthParameters).toEqual({
      USERNAME: 'e2e-manager',
      PASSWORD: 'password',
    });
    expect(session.user).toEqual({
      ...staffUser,
      groups: ['managers', 'read-only'],
    });
    expect(token).toMatchObject({
      cognitoIdToken: idToken,
      cognitoSub: staffUser.sub,
      groups: ['managers', 'read-only'],
    });
    expect(token).not.toHaveProperty('e2eStaff');
  });
});

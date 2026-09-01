import jsonwebtoken from 'jsonwebtoken';
import { encode } from 'next-auth/jwt';

import { parseCognitoGroups } from '../../../lib/auth/groups';
import { authenticateE2eCognitoUser } from './cognitoPasswordLogin';

export type CypressStaffUser = {
  sub: string;
  email: string;
  name: string;
  groups: string[];
};

export type CypressSession = {
  token: string;
  cookies: Array<{ name: string; value: string }>;
  user: CypressStaffUser | { application_id: string };
};

const nextAuthCookieName = 'next-auth.session-token';
const nextAuthCookieChunkSize = 3933;

/** Cypress-only signing key. Never use HACKNEY_JWT_SECRET for test cookies. */
export const cypressResidentJwtSecret = 'aDummySecret';

function nextAuthCookies(token: string): CypressSession['cookies'] {
  if (token.length <= nextAuthCookieChunkSize) {
    return [{ name: nextAuthCookieName, value: token }];
  }

  return Array.from(
    { length: Math.ceil(token.length / nextAuthCookieChunkSize) },
    (_, index) => ({
      name: `${nextAuthCookieName}.${index}`,
      value: token.slice(
        index * nextAuthCookieChunkSize,
        (index + 1) * nextAuthCookieChunkSize,
      ),
    }),
  );
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} for Cypress authentication`);
  return value;
}

function validateStaffUser(user: CypressStaffUser): void {
  if (
    typeof user?.sub !== 'string' ||
    typeof user.email !== 'string' ||
    typeof user.name !== 'string' ||
    !Array.isArray(user.groups) ||
    !user.groups.every((group) => typeof group === 'string')
  ) {
    throw new Error('Valid Cypress staff user required');
  }
}

async function encodeStaffSession(
  user: CypressStaffUser,
  cognito?: { idToken: string; expiresAt: number },
): Promise<CypressSession> {
  validateStaffUser(user);

  const token = await encode({
    secret: requiredEnvironment('NEXTAUTH_SECRET'),
    token: {
      ...(cognito
        ? {
            cognitoIdToken: cognito.idToken,
            cognitoTokenExpiresAt: cognito.expiresAt,
          }
        : { e2eStaff: true }),
      cognitoSub: user.sub,
      email: user.email,
      name: user.name,
      groups: user.groups,
    },
    maxAge: 8 * 60 * 60,
  });

  return { token, cookies: nextAuthCookies(token), user };
}

export async function createMockStaffSession(
  user: CypressStaffUser,
): Promise<CypressSession> {
  return encodeStaffSession(user);
}

/**
 * The real verify step replaces the seeded resident session with one for the
 * application the backend created, so tests must read the id back out.
 */
export function readResidentApplicationId(token: string): string {
  const claims = jsonwebtoken.decode(token);
  if (
    !claims ||
    typeof claims === 'string' ||
    typeof claims.application_id !== 'string'
  ) {
    throw new Error('Resident session does not contain an application ID');
  }
  return claims.application_id;
}

export function createResidentSession(applicationId: string): CypressSession {
  if (!applicationId) throw new Error('Resident application ID required');
  const user = { application_id: applicationId };
  const token = jsonwebtoken.sign(user, cypressResidentJwtSecret);
  return {
    token,
    cookies: [{ name: 'housing_user', value: token }],
    user,
  };
}

export async function createCognitoStaffSession(): Promise<CypressSession> {
  const claims = await authenticateE2eCognitoUser();
  const user: CypressStaffUser = {
    sub: claims.sub,
    email: claims.email,
    name: claims.name,
    groups: parseCognitoGroups(claims.groups),
  };

  return encodeStaffSession(user, {
    idToken: claims.idToken,
    expiresAt: claims.exp,
  });
}

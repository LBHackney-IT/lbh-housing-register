import jsonwebtoken from 'jsonwebtoken';

export type CognitoIdTokenClaims = {
  sub?: string;
  exp?: number;
  email?: string;
  name?: string;
  picture?: string;
  'custom:groups'?: unknown;
};

export function readCognitoIdTokenClaims(
  idToken: string,
): CognitoIdTokenClaims | undefined {
  const decoded = jsonwebtoken.decode(idToken);
  if (!decoded || typeof decoded === 'string') {
    return undefined;
  }

  return decoded as CognitoIdTokenClaims;
}

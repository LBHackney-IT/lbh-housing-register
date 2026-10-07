import jsonwebtoken from 'jsonwebtoken';

import { readCognitoIdTokenClaims } from './idToken';

describe('readCognitoIdTokenClaims', () => {
  it('reads ID token claims without verifying the signature', () => {
    const idToken = jsonwebtoken.sign(
      {
        sub: 'user-1',
        exp: 1_700_000_000,
        email: 'officer@hackney.gov.uk',
        name: 'Officer',
        'custom:groups': '["officers"]',
      },
      'test-secret',
    );

    expect(readCognitoIdTokenClaims(idToken)).toMatchObject({
      sub: 'user-1',
      exp: 1_700_000_000,
      email: 'officer@hackney.gov.uk',
      'custom:groups': '["officers"]',
    });
  });

  it('returns undefined for a malformed token', () => {
    expect(readCognitoIdTokenClaims('not-a-jwt')).toBeUndefined();
  });
});

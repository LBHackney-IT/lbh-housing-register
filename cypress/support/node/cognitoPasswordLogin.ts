import { createPublicKey } from 'node:crypto';

import jsonwebtoken, { type JwtPayload } from 'jsonwebtoken';

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} for Cypress authentication`);
  return value;
}

type CognitoAuthResponse = {
  AuthenticationResult?: { IdToken?: string };
  ChallengeName?: string;
  __type?: string;
};

/**
 * The E2E app client is public, so no SECRET_HASH is sent. A client
 * configured with a secret fails here with NotAuthorizedException.
 */
async function requestCognitoIdToken(): Promise<{
  idToken: string;
  clientId: string;
  issuer: string;
}> {
  const issuer = requiredEnvironment('COGNITO_ISSUER');
  const clientId = requiredEnvironment('COGNITO_E2E_CLIENT_ID');
  const username = requiredEnvironment('COGNITO_E2E_USERNAME');
  const password = requiredEnvironment('COGNITO_E2E_PASSWORD');
  const endpoint = new URL(issuer).origin;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }),
  });
  const result = (await response.json()) as CognitoAuthResponse;

  if (!response.ok) {
    throw new Error(
      `Cognito E2E sign-in failed: ${result.__type ?? response.status}`,
    );
  }
  if (result.ChallengeName) {
    throw new Error(
      `Cognito E2E user requires unsupported challenge: ${result.ChallengeName}`,
    );
  }
  const idToken = result.AuthenticationResult?.IdToken;
  if (!idToken) throw new Error('Cognito E2E sign-in returned no ID token');

  return { idToken, clientId, issuer };
}

async function verifyCognitoIdToken(
  idToken: string,
  issuer: string,
  clientId: string,
): Promise<JwtPayload> {
  const decoded = jsonwebtoken.decode(idToken, { complete: true });
  if (
    !decoded ||
    typeof decoded === 'string' ||
    decoded.header.alg !== 'RS256' ||
    !decoded.header.kid
  ) {
    throw new Error('Cognito E2E sign-in returned an invalid ID token');
  }

  const response = await fetch(`${issuer}/.well-known/jwks.json`);
  if (!response.ok) throw new Error('Unable to load Cognito E2E signing keys');
  const body = (await response.json()) as {
    keys?: Array<JsonWebKey & { kid?: string }>;
  };
  const jwk = body.keys?.find((key) => key.kid === decoded.header.kid);
  if (!jwk) throw new Error('Cognito E2E ID token signing key was not found');

  const claims = jsonwebtoken.verify(
    idToken,
    createPublicKey({ key: jwk, format: 'jwk' }),
    {
      algorithms: ['RS256'],
      audience: clientId,
      issuer,
    },
  );
  if (typeof claims === 'string') {
    throw new Error('Cognito E2E ID token contained invalid claims');
  }
  return claims;
}

export type E2eCognitoStaffClaims = {
  idToken: string;
  sub: string;
  email: string;
  name: string;
  exp: number;
  groups: unknown;
};

export async function authenticateE2eCognitoUser(): Promise<E2eCognitoStaffClaims> {
  const { idToken, issuer, clientId } = await requestCognitoIdToken();
  const claims = await verifyCognitoIdToken(idToken, issuer, clientId);
  if (
    typeof claims.sub !== 'string' ||
    typeof claims.email !== 'string' ||
    typeof claims.name !== 'string' ||
    typeof claims.exp !== 'number'
  ) {
    throw new Error('Cognito E2E ID token is missing required staff claims');
  }

  return {
    idToken,
    sub: claims.sub,
    email: claims.email,
    name: claims.name,
    exp: claims.exp,
    groups: claims['custom:groups'],
  };
}

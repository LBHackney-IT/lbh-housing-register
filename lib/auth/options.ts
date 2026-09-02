import type { NextAuthOptions } from 'next-auth';
import CognitoProvider, {
  type CognitoProfile,
} from 'next-auth/providers/cognito';

import { parseCognitoGroups } from './groups';
import { readCognitoIdTokenClaims } from './idToken';

type StaffCognitoProfile = CognitoProfile & {
  exp?: number;
  'custom:groups'?: unknown;
};

const requiredEnvironmentVariables = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'COGNITO_ISSUER',
  'COGNITO_CLIENT_ID',
  'COGNITO_CLIENT_SECRET',
  'COGNITO_DOMAIN',
] as const;

export function assertStaffAuthEnvironment(): void {
  const missing = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required staff authentication configuration: ${missing.join(
        ', ',
      )}`,
    );
  }
}

// Must match the Cognito app-client ID-token validity. There is no refresh
// token, so staff sign in again when either this cookie or the ID token expires.
export const staffSessionMaxAgeSeconds = 8 * 60 * 60;

type AuthErrorMetadata = {
  error?: unknown;
  error_description?: unknown;
  providerId?: unknown;
};

// NextAuth hands the logger whole OAuth profiles, ID tokens, and provider
// responses. Only these named scalars may be read out of the metadata; the
// metadata object itself must never be passed to console.
function describeAuthError(metadata: unknown): string {
  const container = (metadata ?? {}) as AuthErrorMetadata;
  const cause = (container.error ?? metadata) as
    | (Error & AuthErrorMetadata)
    | undefined;

  const details: string[] = [];

  if (cause instanceof Error) {
    details.push(`${cause.name}: ${cause.message}`);
  }
  if (typeof cause?.error === 'string') {
    details.push(`oauth_error=${cause.error}`);
  }
  const description = container.error_description ?? cause?.error_description;
  if (typeof description === 'string') {
    details.push(`oauth_error_description=${description}`);
  }
  if (typeof container.providerId === 'string') {
    details.push(`provider=${container.providerId}`);
  }

  return details.join(' | ');
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CognitoProvider<StaffCognitoProfile>({
      clientId: process.env.COGNITO_CLIENT_ID ?? '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      checks: ['pkce', 'state', 'nonce'],
      // openid-client defaults to 3.5s, which discovery and the token exchange
      // can exceed on slower connections and fail the whole sign-in.
      httpOptions: { timeout: 10000 },
      client: {
        // Cognito hosted UI token endpoint is more reliable with POST body
        // credentials than HTTP Basic, which often returns invalid_client.
        token_endpoint_auth_method: 'client_secret_post',
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: staffSessionMaxAgeSeconds,
  },
  jwt: {
    maxAge: staffSessionMaxAgeSeconds,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  logger: {
    error(code, metadata) {
      console.error(`NextAuth error ${code}`, describeAuthError(metadata));
    },
    warn(code) {
      console.warn(`NextAuth warning ${code}`);
    },
    debug() {},
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const claims = account.id_token
          ? readCognitoIdTokenClaims(account.id_token)
          : undefined;
        const cognitoProfile = profile as StaffCognitoProfile | undefined;

        if (!account.id_token || !claims?.sub || !claims.exp) {
          throw new Error('Cognito response did not contain a valid ID token');
        }

        token.cognitoIdToken = account.id_token;
        token.cognitoTokenExpiresAt = claims.exp;
        token.cognitoSub = claims.sub;
        token.email = claims.email ?? cognitoProfile?.email;
        token.name = claims.name ?? cognitoProfile?.name;
        token.groups = parseCognitoGroups(
          claims['custom:groups'] ?? cognitoProfile?.['custom:groups'],
        );
      }
      return token;
    },
    async session({ session, token }) {
      // The ID token deliberately remains only in the encrypted, HttpOnly JWT
      // cookie. The browser-facing session contains display and UI state only.
      if (session.user) {
        session.user.id = token.cognitoSub;
        session.user.groups = token.groups;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Invalid URLs fall back to the application root.
      }
      return baseUrl;
    },
  },
};

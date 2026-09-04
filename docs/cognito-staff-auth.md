# Cognito staff authentication

The staff portal uses Amazon Cognito as its OpenID Connect authority. Google
Workspace is federated through Cognito. Resident email-code authentication is
separate and is not changed by this integration.

Staff session reading, group permissions, and ID-token forwarding live in
`lib/auth/staff.ts`. NextAuth configuration is in `lib/auth/options.ts`.

## Cognito app client

Configure one **confidential** user-pool app client per environment:

- generate and securely store a client secret;
- enable only the OAuth 2.0 authorization-code grant;
- disable implicit and client-credentials grants;
- enable the Google identity provider;
- allow only `openid`, `email`, and `profile`;
- do not enable `aws.cognito.signin.user.admin` or resource-server scopes;
- set ID-token expiry to 4 hours, matching `staffSessionMaxAgeSeconds` in
  `lib/auth/options.ts`;
- do not use wildcard callback or logout URLs.

Exact callback URLs:

- `http://localhost:3000/api/auth/callback/cognito`
- `https://housing-register-development.hackney.gov.uk/api/auth/callback/cognito`
- `https://housing-register-staging.hackney.gov.uk/api/auth/callback/cognito`
- `https://housing-register.hackney.gov.uk/api/auth/callback/cognito`

Exact allowed sign-out URLs:

- `http://localhost:3000/login`
- `https://housing-register-development.hackney.gov.uk/login`
- `https://housing-register-staging.hackney.gov.uk/login`
- `https://housing-register.hackney.gov.uk/login`

The Google OAuth client's authorized redirect URI is Cognito's endpoint, not
the application callback:

`https://<cognito-domain>/oauth2/idpresponse`

The existing pre-token-generation Lambda must put the user's trusted Google
Workspace groups in the ID token's `custom:groups` claim. The application
accepts a JSON string array (`["group-a","group-b"]`), a semicolon-delimited
string (`group-a;group-b`, which is what Hackney's trigger produces), or a
comma-delimited string. A semicolon takes precedence, because group names such
as `Here to Help (User Dev)` can contain commas.

`AUTHORISED_*_GROUP` values must match a claim entry exactly, apart from
surrounding whitespace.

## OAuth and session security

NextAuth 4.24.15 uses Cognito discovery at
`<COGNITO_ISSUER>/.well-known/openid-configuration`, including the issuer,
authorization endpoint, token endpoint, and JWKS. It validates the ID token
with `openid-client`.

The flow uses:

- confidential-client authentication with `client_secret_post`;
- authorization code grant;
- PKCE with `S256`;
- OAuth state and OIDC nonce checks;
- exact callback URLs.

The Cognito ID token is retained only inside NextAuth's encrypted (JWE),
HttpOnly session cookie. It is omitted from the browser-readable session and
is forwarded server-to-server only to the Housing Register and Activity
History APIs. Refresh and access tokens are not persisted.

The application rejects the session as soon as the Cognito ID token expires.
The NextAuth session maximum is also 4 hours. Staff then authenticate again.
This intentionally avoids refresh-token storage and refresh races. Keep the
Cognito app-client ID-token validity at 4 hours so the two clocks stay in
sync; whichever expires first ends the session.

Application logout first clears the local NextAuth session using NextAuth's
CSRF-protected sign-out operation, then redirects to Cognito's `/logout`
endpoint with a fixed, configured `logout_uri`. It does not log the user out
of Google Workspace.

## Runtime configuration

Store all values in SSM Parameter Store. None may use a `NEXT_PUBLIC_` prefix.

- `NEXTAUTH_URL`: exact public application origin
- `NEXTAUTH_SECRET`: at least 32 random bytes; rotate through a coordinated
  deployment because rotation invalidates all sessions
- `COGNITO_ISSUER`: `https://cognito-idp.<region>.amazonaws.com/<pool-id>`
- `COGNITO_CLIENT_ID`: confidential app-client ID
- `COGNITO_CLIENT_SECRET`: confidential app-client secret
- `COGNITO_DOMAIN`: full HTTPS managed-login domain

The `logout_uri` sent to Cognito is always `NEXTAUTH_URL` + `/login` and must
match an allowed sign-out URL exactly. Cognito does not report a mismatch: it
redirects to its hosted login page, which then fails with
`Required parameters missing`.

`HACKNEY_JWT_SECRET` remains solely for resident OTP sessions. It must never
be used to create or verify staff sessions. Cypress resident cookies are
signed with a hardcoded dummy secret (`aDummySecret`), not this value.

## Cypress authentication

Mocked Cypress specs create an encrypted NextAuth session in the Cypress Node
process. It is explicitly marked as an E2E session, is accepted only while the
fail-closed `E2E_HTTP_MOCKS` gate is enabled, and contains no Cognito ID token.
Consequently, the application sends no fake bearer token to mocked downstream
APIs. Resident test cookies are signed with a hardcoded dummy secret
(`aDummySecret`), not `HACKNEY_JWT_SECRET`. CI and local keep
`SKIP_VERIFY_TOKEN=true` so the app decodes those cookies instead of verifying
them.

`LOCAL_E2E` specs use a dedicated public Cognito app client with
`USER_PASSWORD_AUTH`. The Cypress Node task authenticates with
`COGNITO_E2E_USERNAME` and `COGNITO_E2E_PASSWORD`, verifies the returned ID
token against the pool JWKS, and stores that real token in the encrypted
NextAuth session. These values are never exposed through `Cypress.expose` or
browser code.

Because that client has no secret, no `SECRET_HASH` is sent. The E2E app client
must stay separate from the production confidential web client.

That dedicated user carries its own test group rather than the real ones, so
local runs also grant manager from `E2E_AUTHORISED_MANAGER_GROUP`. That
allowlist is additive to `AUTHORISED_MANAGER_GROUP`, so real claims continue to
work unchanged, and `areE2eStaffGroupsEnabled` honours it only when `LOCAL_E2E`
is `true` outside a Lambda or named deployment environment. `serverless.yml`
passes only the real `AUTHORISED_*_GROUP` values from SSM, so the test group
cannot reach a deployed build.

## Route separation from resident authentication

`/api/auth/*` belongs entirely to NextAuth, which owns every action under that
prefix (`signin`, `callback`, `csrf`, `session`, `signout`, `error`, `_log`).
Resident email-code endpoints live under `/api/resident-auth/*` so that neither
system can shadow the other's routes as NextAuth adds actions.

## Operational checks

1. Confirm callback and logout URLs exactly match the target environment.
2. Confirm `custom:groups` is present in a test user's Cognito ID token.
3. Confirm the configured `AUTHORISED_*_GROUP` values match those claims.
4. Confirm CloudFront forwards cookies and query strings and does not cache
   authenticated responses (the default behavior has all TTLs set to zero).
5. Confirm `E2E_HTTP_MOCKS`, `LOCAL_E2E`, `SKIP_VERIFY_TOKEN`, and all
   `COGNITO_E2E_*` and `E2E_AUTHORISED_MANAGER_GROUP` variables are
   absent/false in deployments. E2E routes, synthetic staff sessions, and the
   E2E group allowlist also reject every AWS Lambda/named deployment
   environment even if those flags are accidentally enabled.
6. Never log callback query strings, authorization codes, cookies, or tokens.

The migration is a hard cutover. Existing `hackneyToken` cookies are ignored,
and all staff must sign in again.

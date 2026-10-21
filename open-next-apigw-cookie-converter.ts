/**
 * Custom OpenNext converter that makes multiple `Set-Cookie` headers survive
 * the Lambda -> API Gateway (REST) -> CloudFront path.
 *
 * OpenNext collects response cookies as an array, but `convertRes` runs every
 * header through `parseHeaders`, which joins array values with a comma. By the
 * time a converter sees the result, `headers['set-cookie']` is a single joined
 * string, so the `aws-apigw-v1` converter's array branch never fires and
 * nothing is ever written to `multiValueHeaders` — the only mechanism a REST
 * API has for emitting duplicate response headers. The browser then receives
 * one `Set-Cookie` header and keeps only the first cookie in it.
 *
 * NextAuth sets `state`, `nonce`, `pkce.code_verifier` and `callback-url` in a
 * single sign-in response, so sign-in failed with `OAuthCallbackError: State
 * cookie was missing.` (and then `PKCE code_verifier cookie was missing.`)
 * while the single-cookie `/api/auth/csrf` response worked fine.
 *
 * The bundled `aws-apigw-v2` and `aws-cloudfront` converters already work
 * around this by re-splitting the joined string; only the v1 converter is
 * missing the equivalent. This wrapper adds it.
 *
 * https://github.com/nextauthjs/next-auth/issues/12833
 */
import baseConverter from '@opennextjs/aws/overrides/converters/aws-apigw-v1.js';
import type { Converter } from '@opennextjs/aws/types/overrides.js';

const SET_COOKIE = 'set-cookie';

/**
 * Splits a comma-joined `Set-Cookie` string back into individual cookies.
 *
 * Only commas that start a new `name=` pair are separators. An `Expires` date
 * contains a comma of its own ("Expires=Wed, 02 Sep 2026 ..."), and a cookie
 * name cannot contain whitespace, `,`, `;` or `=`, so requiring a bare name
 * followed by `=` after the comma leaves those dates intact.
 */
function splitCookies(joined: string): string[] {
  return joined
    .split(/,(?=\s*[^\s,;=]+=)/)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

type ApiGatewayResult = {
  headers?: Record<string, string | number | boolean>;
  multiValueHeaders?: Record<string, Array<string | number | boolean>>;
};

function moveCookiesToMultiValueHeaders(result: ApiGatewayResult): void {
  const { headers = {}, multiValueHeaders = {} } = result;

  // Already an array when a future OpenNext keeps cookies unjoined.
  const cookies = (multiValueHeaders[SET_COOKIE] ?? []).map(String);

  const joined = headers[SET_COOKIE];
  if (typeof joined === 'string') {
    cookies.push(...splitCookies(joined));
  }

  if (cookies.length === 0) return;

  // API Gateway drops `headers` entries that also appear in
  // `multiValueHeaders`, but be explicit rather than relying on that.
  delete headers[SET_COOKIE];
  multiValueHeaders[SET_COOKIE] = cookies;

  result.headers = headers;
  result.multiValueHeaders = multiValueHeaders;
}

const converter: Converter = {
  name: 'aws-apigw-v1-multi-cookie',
  convertFrom: baseConverter.convertFrom,
  convertTo: async (result, originalRequest) => {
    const converted = await baseConverter.convertTo(result, originalRequest);
    moveCookiesToMultiValueHeaders(converted as ApiGatewayResult);
    return converted;
  },
};

export default converter;

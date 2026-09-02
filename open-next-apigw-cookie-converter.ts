/**
 * Custom OpenNext converter that makes multiple `Set-Cookie` headers survive
 * the Lambda -> API Gateway (REST) -> CloudFront path.
 *
 * The default `aws-apigw-v1` converter returns several cookies as an array
 * under `multiValueHeaders['set-cookie']`. On this stack those extra values do
 * not reach the browser intact: only the first cookie is usable and the rest
 * arrive mangled. NextAuth sets `state`, `nonce`, `pkce.code_verifier` and
 * `callback-url` in a single sign-in response, so sign-in failed with
 * `OAuthCallbackError: State cookie was missing.` while the single-cookie
 * `/api/auth/csrf` response worked fine.
 *
 * A response header map cannot hold duplicate keys, but HTTP header names are
 * case-insensitive, so `Set-Cookie` and `sEt-cookie` are distinct map keys and
 * the same header to any client. Emitting one cookie per casing variant is the
 * long-standing AWS workaround for this limitation.
 *
 * https://stackoverflow.com/questions/39769222
 * https://github.com/nextauthjs/next-auth/issues/12833
 */
import baseConverter from '@opennextjs/aws/overrides/converters/aws-apigw-v1.js';
import type { Converter } from '@opennextjs/aws/types/overrides.js';

const SET_COOKIE = 'set-cookie';

// Indexes of the letters in "set-cookie" (i.e. everything but the hyphen).
// Each can be flipped to upper case independently, giving 2^9 distinct keys.
const letterIndexes = [...SET_COOKIE]
  .map((character, index) => (character === '-' ? -1 : index))
  .filter((index) => index >= 0);

/**
 * Builds a unique casing of "set-cookie" per cookie. Index 0 returns the
 * all-lowercase name, so responses with a single cookie are unchanged.
 */
function cookieHeaderName(index: number): string {
  const characters = [...SET_COOKIE];
  letterIndexes.forEach((characterIndex, bit) => {
    if (index & (1 << bit)) {
      characters[characterIndex] = characters[characterIndex].toUpperCase();
    }
  });
  return characters.join('');
}

const maxCookies = 1 << letterIndexes.length;

type ApiGatewayResult = {
  headers?: Record<string, string | number | boolean>;
  multiValueHeaders?: Record<string, Array<string | number | boolean>>;
};

function spreadCookiesAcrossHeaderCasings(result: ApiGatewayResult): void {
  const { headers = {}, multiValueHeaders = {} } = result;

  const cookies = (multiValueHeaders[SET_COOKIE] ?? []).map(String);
  const single = headers[SET_COOKIE];
  if (typeof single === 'string') {
    cookies.push(single);
  }

  delete multiValueHeaders[SET_COOKIE];
  delete headers[SET_COOKIE];

  if (cookies.length === 0) return;

  // Beyond this the casing variants would collide and silently drop cookies.
  // Leave the overflow on the array header rather than losing it entirely.
  if (cookies.length > maxCookies) {
    multiValueHeaders[SET_COOKIE] = cookies.slice(maxCookies);
  }

  cookies.slice(0, maxCookies).forEach((cookie, index) => {
    headers[cookieHeaderName(index)] = cookie;
  });

  result.headers = headers;
  result.multiValueHeaders = multiValueHeaders;
}

const converter: Converter = {
  name: 'aws-apigw-v1-multi-cookie',
  convertFrom: baseConverter.convertFrom,
  convertTo: async (result, originalRequest) => {
    const converted = await baseConverter.convertTo(result, originalRequest);
    spreadCookiesAcrossHeaderCasings(converted as ApiGatewayResult);
    return converted;
  },
};

export default converter;

import { handleTunnelRequest } from '@sentry/core';

/**
 * The tunnel forwards only envelopes that carry public DSN.
 */
export const SENTRY_DSN =
  'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602';

export const SENTRY_TUNNEL_MAX_BODY_BYTES = 1_000_000;

export function forwardSentryTunnel(body: Uint8Array): Promise<Response> {
  const bytes = new ArrayBuffer(body.byteLength);
  new Uint8Array(bytes).set(body);

  /**
   * This is a dummy URL that is not consumed. Valid URL is required by the Request constructor but the request is not sent.
   */

  const request = new Request('https://sentry-tunnel.invalid', {
    method: 'POST',
    headers: { 'content-type': 'application/x-sentry-envelope' },
    body: bytes,
  });

  return handleTunnelRequest({
    request,
    allowedDsns: [SENTRY_DSN],
  });
}

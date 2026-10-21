import { handleTunnelRequest } from '@sentry/core';

/**
 * Public DSN, same value as the Sentry init files. The tunnel forwards only
 * envelopes that carry this DSN.
 */
export const SENTRY_DSN =
  'https://6fb0dd07e0fc4a75b0ab84b8e1f36460@o183917.ingest.us.sentry.io/6292602';

export const SENTRY_TUNNEL_MAX_BODY_BYTES = 1_000_000;

export async function forwardSentryTunnel(body: Uint8Array): Promise<Response> {
  const bytes = new ArrayBuffer(body.byteLength);
  new Uint8Array(bytes).set(body);

  const request = new Request('https://housing.local/monitoring', {
    method: 'POST',
    headers: { 'content-type': 'application/x-sentry-envelope' },
    body: bytes,
  });

  return handleTunnelRequest({
    request,
    allowedDsns: [SENTRY_DSN],
  });
}

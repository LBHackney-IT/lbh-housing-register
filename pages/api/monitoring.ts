import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest } from 'next';

import {
  forwardSentryTunnel,
  SENTRY_TUNNEL_MAX_BODY_BYTES,
} from '../../lib/server/sentry-tunnel';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readRawBody = async (req: NextApiRequest): Promise<Uint8Array> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    if (
      chunks.reduce((total, part) => total + part.length, 0) >
      SENTRY_TUNNEL_MAX_BODY_BYTES
    ) {
      return new Uint8Array(SENTRY_TUNNEL_MAX_BODY_BYTES + 1);
    }
  }

  return new Uint8Array(Buffer.concat(chunks));
};

const endpoint: NextApiHandler = async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST').status(StatusCodes.METHOD_NOT_ALLOWED).end();
    return;
  }

  const body = await readRawBody(req);
  if (body.byteLength > SENTRY_TUNNEL_MAX_BODY_BYTES) {
    res.status(StatusCodes.REQUEST_TOO_LONG).end();
    return;
  }

  const tunnelResponse = await forwardSentryTunnel(body);
  const responseBody = Buffer.from(await tunnelResponse.arrayBuffer());
  for (const header of [
    'Content-Type',
    'Retry-After',
    'X-Sentry-Rate-Limits',
  ]) {
    const value = tunnelResponse.headers.get(header);
    if (value) {
      res.setHeader(header, value);
    }
  }
  res.status(tunnelResponse.status).send(responseBody);
};

export default endpoint;

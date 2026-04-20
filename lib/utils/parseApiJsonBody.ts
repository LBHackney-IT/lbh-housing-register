import type { NextApiRequest } from 'next';

/**
 * Next may leave `req.body` as a string or parse it to an object when
 * Content-Type is `application/json`. In Node/Lambda, the raw body can
 * also arrive as a Buffer before JSON middleware runs. Support all of these
 * so we never treat bytes or a parsed object incorrectly.
 */
export function parseApiJsonBody<T = unknown>(req: NextApiRequest): T {
  const raw = req.body;
  if (raw === undefined || raw === null) {
    throw new TypeError('Missing request body');
  }
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T;
  }
  if (Buffer.isBuffer(raw)) {
    return JSON.parse(raw.toString('utf8')) as T;
  }
  return raw as T;
}

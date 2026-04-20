import type { NextApiRequest } from 'next';

/**
 * Next may leave `req.body` as a string or parse it to an object when
 * Content-Type is `application/json`. Support both so callers never use
 * JSON.parse on an already-parsed body.
 */
export function parseApiJsonBody<T = unknown>(req: NextApiRequest): T {
  const raw = req.body;
  if (raw === undefined) {
    throw new TypeError('Missing request body');
  }
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T;
}

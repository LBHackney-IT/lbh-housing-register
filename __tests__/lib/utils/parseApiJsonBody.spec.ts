/**
 * @jest-environment node
 */

import type { NextApiRequest } from 'next';

import { parseApiJsonBody } from '../../../lib/utils/parseApiJsonBody';

describe('parseApiJsonBody', () => {
  it('parses a JSON string body', () => {
    const req = { body: '{"a":1}' } as NextApiRequest;
    expect(parseApiJsonBody(req)).toEqual({ a: 1 });
  });

  it('returns an already-parsed object body', () => {
    const payload = { a: 1 };
    const req = { body: payload } as NextApiRequest;
    expect(parseApiJsonBody(req)).toBe(payload);
  });

  it('parses a Buffer body (Node / Lambda raw JSON)', () => {
    const req = {
      body: Buffer.from('{"a":1}', 'utf8'),
    } as NextApiRequest;
    expect(parseApiJsonBody(req)).toEqual({ a: 1 });
  });

  it('throws when body is missing', () => {
    const req = { body: undefined } as NextApiRequest;
    expect(() => parseApiJsonBody(req)).toThrow('Missing request body');
  });
});

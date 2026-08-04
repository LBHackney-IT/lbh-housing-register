/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { createMocks } from 'node-mocks-http';

import endpoint from '../../../../pages/api/admin/logout';
import { ApiRequest, ApiResponse } from '../../../../testUtils/types';

describe('/api/admin/logout', () => {
  it('signs the user out on GET', async () => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'GET',
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toStrictEqual({ message: 'Admin sign out' });
  });

  it('returns 405 for methods other than GET', async () => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET');
    expect(res._getJSONData()).toStrictEqual({ message: 'Method not allowed' });
  });
});

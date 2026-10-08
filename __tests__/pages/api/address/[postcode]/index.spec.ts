/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { createMocks, RequestMethod } from 'node-mocks-http';

import { lookUpAddress } from '../../../../../lib/gateways/address-api';
import { UK_POSTCODE_ERROR } from '../../../../../lib/utils/postcode';
import endpoint from '../../../../../pages/api/address/[postcode]';
import { ApiRequest, ApiResponse } from '../../../../../testUtils/types';

jest.mock('../../../../../lib/gateways/address-api', () => ({
  lookUpAddress: jest.fn(),
}));

const lookUpAddressMock = lookUpAddress as jest.MockedFunction<
  typeof lookUpAddress
>;

const callEndpoint = async (
  postcode?: string,
  method: RequestMethod = 'GET',
) => {
  const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
    method,
    query: postcode === undefined ? {} : { postcode },
  });

  await endpoint(req, res);

  return res;
};

describe('/api/address/[postcode]', () => {
  afterEach(() => {
    lookUpAddressMock.mockReset();
  });

  it('returns 405 for methods other than GET', async () => {
    const res = await callEndpoint('E9 6PT', 'POST');

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET');
    expect(res._getJSONData()).toStrictEqual({ message: 'Method not allowed' });
    expect(lookUpAddressMock).not.toHaveBeenCalled();
  });

  it('returns 400 when the postcode is missing', async () => {
    const res = await callEndpoint();

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual({ message: 'Missing postcode' });
    expect(lookUpAddressMock).not.toHaveBeenCalled();
  });

  it.each(['E8', 'SW1', 'not a UK postcode'])(
    'returns 400 and does not look up %s',
    async (postcode) => {
      const res = await callEndpoint(postcode);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual({ message: UK_POSTCODE_ERROR });
      expect(lookUpAddressMock).not.toHaveBeenCalled();
    },
  );

  it('returns lookup results for a full UK postcode', async () => {
    const addresses = {
      address: [{ UPRN: 1, line1: '1 Test Street' }],
      page_count: 1,
      total_count: 1,
    };
    lookUpAddressMock.mockResolvedValue(addresses);

    const res = await callEndpoint('(e9) 6pt');

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toStrictEqual(addresses);
    expect(lookUpAddressMock).toHaveBeenCalledWith('(e9) 6pt');
  });

  it('returns 500 when the lookup fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    lookUpAddressMock.mockRejectedValue(new Error('lookup timed out'));

    const res = await callEndpoint('E9 6PT');

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to look up address',
    });
    consoleError.mockRestore();
  });
});

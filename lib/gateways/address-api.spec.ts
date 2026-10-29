/**
 * @jest-environment node
 */

import axios from 'axios';

import { lookUpAddress } from './address-api';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const getMock = axios.get as jest.Mock;

describe('lookUpAddress', () => {
  const originalUrl = process.env.LOOKUP_API_URL;
  const originalToken = process.env.LOOKUP_API_TOKEN;

  beforeEach(() => {
    process.env.LOOKUP_API_URL = 'https://lookup.example';
    process.env.LOOKUP_API_TOKEN = 'test-token';
    getMock.mockReset();
    getMock.mockResolvedValue({
      data: {
        data: { address: [], page_count: 0, total_count: 0 },
      },
    });
  });

  afterEach(() => {
    process.env.LOOKUP_API_URL = originalUrl;
    process.env.LOOKUP_API_TOKEN = originalToken;
  });

  it.each([
    ['(e9) 6pt'],
    ['E9-6PT'],
    ['E9#6PT'],
    ['E9&6PT'],
    ['E9\u00A06PT'],
    ['E9 6PT'],
  ])('requests the canonical postcode for %s', async (postcode) => {
    await lookUpAddress(postcode);

    expect(getMock).toHaveBeenCalledWith(
      'https://lookup.example/?postcode=E9%206PT',
      { headers: { Authorization: 'test-token' } },
    );
  });

  it('returns the address payload', async () => {
    const addresses = {
      address: [{ UPRN: 1, line1: '1 Test Street' }],
      page_count: 1,
      total_count: 1,
    };
    getMock.mockResolvedValue({ data: { data: addresses } });

    await expect(lookUpAddress('E9 6PT')).resolves.toEqual(addresses);
  });
});

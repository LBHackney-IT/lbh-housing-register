/** @jest-environment node */

import { createRequest } from 'node-mocks-http';

import { getCognitoIdToken } from '../auth/staff';
import { authenticatedHousingAxios } from './axiosClients';

jest.mock('../auth/staff', () => ({
  getCognitoIdToken: jest.fn(),
}));

const getCognitoIdTokenMock = getCognitoIdToken as jest.MockedFunction<
  typeof getCognitoIdToken
>;

describe('authenticatedHousingAxios', () => {
  beforeEach(() => {
    process.env.HOUSING_REGISTER_API = 'https://housing-api.example/api/';
    process.env.HOUSING_REGISTER_KEY = 'server-api-key';
  });

  it('forwards only the server-recovered Cognito ID token', async () => {
    getCognitoIdTokenMock.mockResolvedValue('cognito-id-token');

    const client = await authenticatedHousingAxios(createRequest());

    expect(client.defaults.headers.common.Authorization).toBe(
      'Bearer cognito-id-token',
    );
  });

  it('does not create an Authorization header without a staff session', async () => {
    getCognitoIdTokenMock.mockResolvedValue(undefined);

    const client = await authenticatedHousingAxios(createRequest());

    expect(client.defaults.headers.common.Authorization).toBeUndefined();
  });
});

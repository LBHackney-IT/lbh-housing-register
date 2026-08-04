/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Application } from 'domain/HousingApi';

import * as applicationApi from '../../../../../lib/gateways/applications-api';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/complete';
import { generateMockRequestResponseWithHackneyToken } from '../../../../../testUtils/apiHelper';
import {
  UserRole,
  generateSignedTokenByRole,
} from '../../../../../testUtils/userHelper';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return { ...actualAxios, isAxiosError: jest.fn() };
});
const mockAxiosInstance = axios as jest.Mocked<typeof axios>;

const applicationId = faker.string.uuid();
const mockApplicationData: Application = {
  id: applicationId,
};

describe('authorization', () => {
  //claims in the token don't matter in these tests, it just need to exist
  const { signedToken } = generateSignedTokenByRole(UserRole.Officer);
  jest
    .spyOn(applicationApi, 'completeApplication')
    .mockResolvedValue({ ...mockApplicationData });

  it('returns status code 403 and error message when canUpdateApplication returns false', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(false);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'PATCH',
    });

    req.query.id = applicationId;

    const expectedErrorMessage = { message: 'Access denied' };

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
  });

  it('returns status code 200 when canUpdateApplication returns true', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'PATCH',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
  });

  it('forwards the backend status and body when completeApplication fails with an axios error', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const axiosErrorStatusCode = StatusCodes.BAD_GATEWAY;
    const axiosErrorData = { message: 'upstream failure' };
    const mockAxiosError = {
      response: { status: axiosErrorStatusCode, data: axiosErrorData },
    } as AxiosError;

    jest
      .spyOn(applicationApi, 'completeApplication')
      .mockImplementationOnce(() => {
        throw mockAxiosError;
      });
    mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'PATCH',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(axiosErrorStatusCode);
    expect(res._getJSONData()).toStrictEqual(axiosErrorData);
  });

  it('returns a 500 when completeApplication fails with a non-axios error', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    jest
      .spyOn(applicationApi, 'completeApplication')
      .mockImplementationOnce(() => {
        throw new Error('boom');
      });

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'PATCH',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to update application',
    });
  });

  it('returns status code 405 when the request method is not PATCH', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('PATCH');
    expect(res._getJSONData()).toStrictEqual({
      message: 'Method not allowed',
    });
  });
});

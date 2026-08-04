/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import * as applicationApi from '../../../../../lib/gateways/applications-api';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/note';
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

describe('authorization', () => {
  //claims in the token don't matter in these tests, it just need to exist
  const { signedToken } = generateSignedTokenByRole(UserRole.Officer);
  jest.spyOn(applicationApi, 'addNoteToHistory').mockResolvedValue(null);

  it('returns status code 403 and error message when canUpdateApplication returns false', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(false);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toStrictEqual({ message: 'Access denied' });
  });

  it('returns status code 200 when canUpdateApplication returns true', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
  });

  it('returns 400 without checking authorisation when the request body cannot be parsed', async () => {
    const canUpdateApplicationSpy = jest.spyOn(
      requestAuth,
      'canUpdateApplication',
    );

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: 'not-json',
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(canUpdateApplicationSpy).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to parse request',
    });
  });

  it('forwards the backend status and body when addNoteToHistory fails with an axios error', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const axiosErrorStatusCode = StatusCodes.BAD_GATEWAY;
    const axiosErrorData = { message: 'upstream failure' };
    const mockAxiosError = {
      response: { status: axiosErrorStatusCode, data: axiosErrorData },
    } as AxiosError;

    jest
      .spyOn(applicationApi, 'addNoteToHistory')
      .mockImplementationOnce(() => {
        throw mockAxiosError;
      });
    mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(axiosErrorStatusCode);
    expect(res._getJSONData()).toStrictEqual(axiosErrorData);
  });

  it('returns 405 for methods other than POST', async () => {
    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      method: 'GET',
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('POST');
    expect(res._getJSONData()).toStrictEqual({ message: 'Method not allowed' });
  });
});

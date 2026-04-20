/**
 * @jest-environment node
 */

import {
  CreateAuthRequest,
  CreateAuthResponse,
} from '../../../../domain/HousingApi';
import { createVerifyCode } from '../../../../lib/gateways/applications-api';
import { generateEmailAddress } from '../../../../testUtils/personHelper';
import endpoint from '../../../../pages/api/auth/generate';
import { ApiRequest, ApiResponse } from '../../../../testUtils/types';
import {
  type Body,
  createMocks,
  RequestMethod,
  RequestOptions,
} from 'node-mocks-http';
import { StatusCodes } from 'http-status-codes';

const email = generateEmailAddress();
const invalidRequestMethods = [
  'CONNECT',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'PUT',
  'TRACE',
];

const mockCreateAuthRequest: CreateAuthRequest = {
  email: email,
};

const mockCreateAuthResponse: CreateAuthResponse = { success: true };

jest.mock('../../../../lib/gateways/applications-api', () => ({
  createVerifyCode: jest.fn(),
}));

describe('POST', () => {
  const jsonParseSpy = jest.spyOn(JSON, 'parse');

  const createVerifyCodeMock = createVerifyCode as jest.Mock;

  beforeEach(() => {
    createVerifyCodeMock.mockRestore();
    jsonParseSpy.mockClear();
  });

  const requestOptions: RequestOptions = {
    method: 'POST',
    body: JSON.stringify(mockCreateAuthRequest) as unknown as Body,
  };

  it('returns status code 200 when JSON.parse succeeds and verify code is created successfully', async () => {
    jsonParseSpy.mockReturnValueOnce(mockCreateAuthRequest);

    createVerifyCodeMock.mockReturnValueOnce(mockCreateAuthResponse);

    const { req, res }: { req: ApiRequest; res: ApiResponse } =
      createMocks(requestOptions);

    await endpoint(req, res);

    expect(jsonParseSpy).toHaveBeenCalledTimes(1);
    expect(jsonParseSpy).toHaveBeenCalledWith(req.body);
    expect(createVerifyCodeMock).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toStrictEqual(mockCreateAuthResponse);
  });

  it('returns status code 400 when JSON.parse fails', async () => {
    jsonParseSpy.mockImplementationOnce(() => {
      throw SyntaxError('Unexpected token');
    });

    createVerifyCodeMock.mockReturnValueOnce(mockCreateAuthResponse);

    const expectedErrorMessage = { message: 'Unable to parse request' };

    const { req, res }: { req: ApiRequest; res: ApiResponse } =
      createMocks(requestOptions);

    await endpoint(req, res);

    expect(jsonParseSpy).toHaveBeenCalledTimes(1);
    expect(jsonParseSpy).toHaveBeenCalledWith(req.body);
    expect(createVerifyCodeMock).toHaveBeenCalledTimes(0);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
  });

  it('returns status code 500 when createVerifyCode fails', async () => {
    jsonParseSpy.mockReturnValueOnce(mockCreateAuthRequest);

    createVerifyCodeMock.mockImplementationOnce(() => {
      throw new Error();
    });

    const reqOptions: RequestOptions = {
      method: 'POST',
      body: JSON.stringify(mockCreateAuthRequest) as unknown as Body,
    };

    const { req, res }: { req: ApiRequest; res: ApiResponse } =
      createMocks(reqOptions);

    await endpoint(req, res);

    expect(jsonParseSpy).toHaveBeenCalledWith(req.body);
    expect(createVerifyCodeMock).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toEqual({
      message: 'Unable to create verify code',
    });
  });

  it.each(invalidRequestMethods)(
    'returns status code 400 when request method is %p',
    async (requestMethod) => {
      const reqOptions: RequestOptions = {
        method: requestMethod as RequestMethod,
        body: mockCreateAuthRequest,
      };

      const { req, res }: { req: ApiRequest; res: ApiResponse } =
        createMocks(reqOptions);

      await endpoint(req, res);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'Invalid request method' });
    },
  );
});

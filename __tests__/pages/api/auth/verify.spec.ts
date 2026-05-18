/**
 * @jest-environment node
 */

import { AxiosError, AxiosHeaders } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { createMocks, RequestMethod, RequestOptions } from 'node-mocks-http';

import {
  VerifyAuthRequest,
  VerifyAuthResponse,
} from '../../../../domain/HousingApi';
import { confirmVerifyCode } from '../../../../lib/gateways/applications-api';
import { setAuthCookie } from '../../../../lib/utils/users';
import endpoint from '../../../../pages/api/auth/verify';
import { generateEmailAddress } from '../../../../testUtils/personHelper';
import { ApiRequest, ApiResponse } from '../../../../testUtils/types';

const email = generateEmailAddress();

const mockVerifyAuthRequest: VerifyAuthRequest = {
  email,
  code: '123456',
};

const mockVerifyAuthResponse: VerifyAuthResponse = {
  accessToken: 'a-jwt-token',
};

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

jest.mock('../../../../lib/gateways/applications-api', () => ({
  confirmVerifyCode: jest.fn(),
}));

jest.mock('../../../../lib/utils/users', () => ({
  setAuthCookie: jest.fn(),
}));

const confirmVerifyCodeMock = confirmVerifyCode as jest.Mock;
const setAuthCookieMock = setAuthCookie as jest.Mock;

describe('POST /api/auth/verify', () => {
  beforeEach(() => {
    confirmVerifyCodeMock.mockReset();
    setAuthCookieMock.mockReset();
  });

  it('returns 200 with the auth response when the body is a JSON string', async () => {
    confirmVerifyCodeMock.mockResolvedValueOnce(mockVerifyAuthResponse);

    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: JSON.stringify(
        mockVerifyAuthRequest,
      ) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(confirmVerifyCodeMock).toHaveBeenCalledWith(mockVerifyAuthRequest);
    expect(setAuthCookieMock).toHaveBeenCalledWith(res, mockVerifyAuthResponse);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toStrictEqual(mockVerifyAuthResponse);
  });

  it('returns 200 when the body is already parsed as an object', async () => {
    confirmVerifyCodeMock.mockResolvedValueOnce(mockVerifyAuthResponse);

    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: mockVerifyAuthRequest,
    });

    await endpoint(req, res);

    expect(confirmVerifyCodeMock).toHaveBeenCalledWith(mockVerifyAuthRequest);
    expect(res.statusCode).toBe(StatusCodes.OK);
  });

  it('does not set the auth cookie when the backend returns no data', async () => {
    confirmVerifyCodeMock.mockResolvedValueOnce(null);

    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: mockVerifyAuthRequest,
    });

    await endpoint(req, res);

    expect(setAuthCookieMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.OK);
  });

  it('returns 400 with "Unable to parse request" when the body is unparseable', async () => {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: 'not-json' as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(confirmVerifyCodeMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to parse request',
    });
  });

  describe.each([
    ['empty object', {}],
    ['missing code', { email }],
    ['missing email', { code: '123456' }],
    ['email is empty', { email: '', code: '123456' }],
    ['code is empty', { email, code: '' }],
    ['email is whitespace', { email: '   ', code: '123456' }],
    ['code is whitespace', { email, code: '   ' }],
    ['email is not a string', { email: 1, code: '123456' }],
    ['code is not a string', { email, code: 123456 }],
  ])('rejects invalid input: %s', (_label, body) => {
    it('returns 400 "Email and code are required" without calling the backend', async () => {
      const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
        method: 'POST',
        body: body as unknown as RequestOptions['body'],
      });

      await endpoint(req, res);

      expect(confirmVerifyCodeMock).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Email and code are required',
      });
    });
  });

  it('forwards the upstream status code when axios reports an error', async () => {
    const axiosError = new AxiosError(
      'Request failed with status code 404',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { title: 'Not Found' },
      },
    );
    confirmVerifyCodeMock.mockRejectedValueOnce(axiosError);

    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: mockVerifyAuthRequest,
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to confirm verify code',
    });
  });

  it('returns 500 when the backend throws a non-axios error', async () => {
    confirmVerifyCodeMock.mockRejectedValueOnce(new Error('boom'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method: 'POST',
      body: mockVerifyAuthRequest,
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to confirm verify code',
    });
    errorSpy.mockRestore();
  });

  it.each(invalidRequestMethods)(
    'returns 400 when the request method is %p',
    async (requestMethod) => {
      const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
        method: requestMethod as RequestMethod,
        body: mockVerifyAuthRequest,
      });

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Invalid request method',
      });
    },
  );
});

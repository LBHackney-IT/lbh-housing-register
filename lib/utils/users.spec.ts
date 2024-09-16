/* eslint-disable import/no-duplicates */
import { faker } from '@faker-js/faker';
import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { createRequest, createResponse } from 'node-mocks-http';

import { VerifyAuthResponse } from '../../domain/HousingApi';
import { envVarsFixture } from '../../testUtils/envVarsHelper';
import { ApiRequest, ApiResponse } from '../../testUtils/types';
import { generateSignedResidentToken } from '../../testUtils/userHelper';
import { getUser, removeAuthCookie, setAuthCookie } from './users';

describe('users', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUser', () => {
    describe('token parse', () => {
      it('calls parse on cookie with cookie header value when provided', () => {
        const parseSpy = jest.spyOn(cookie, 'parse');
        const req: ApiRequest = createRequest();

        const newReq = {
          ...req,
          headers: {
            ...req.headers,
            cookie: `someToken=abc123`,
          },
        };

        getUser(newReq);

        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(parseSpy).toHaveBeenCalledWith(newReq.headers.cookie);
      });

      it('calls parse on cookie with empty string when cookie not present in the header', () => {
        const parseSpy = jest.spyOn(cookie, 'parse');
        const req: ApiRequest = createRequest();

        getUser(req);

        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(parseSpy).toHaveBeenCalledWith('');
      });

      it('returns undefined when housing_user cookie not found in the headers', () => {
        const req: ApiRequest = createRequest();
        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `someToken=abc123`,
          },
        };

        expect(getUser(newReq)).toBeUndefined();
      });
    });

    describe('token verification', () => {
      const secretFixture = envVarsFixture('HACKNEY_JWT_SECRET');
      const skipTokenVerifyFixture = envVarsFixture('SKIP_VERIFY_TOKEN');
      const req: ApiRequest = createRequest();
      const parsedToken = 'abc123';
      const tokenSecret = 'secret';
      const verifyFunctionName = 'verify';
      const decodeFunctionName = 'decode';
      const newReq = {
        ...req,
        headers: {
          ...req.headers,

          cookie: `housing_user=${parsedToken}`,
        },
      };

      beforeEach(() => {
        secretFixture.mock(tokenSecret);
      });

      afterEach(() => {
        secretFixture.restore();
        skipTokenVerifyFixture.restore();
      });

      it('returns undefined when cookie parse throws JsonWebTokenError', () => {
        jest.spyOn(cookie, 'parse').mockImplementationOnce(() => {
          throw new jwt.JsonWebTokenError('token parse error');
        });

        expect(getUser(newReq)).toBeUndefined();
      });

      it('verifies token when SKIP_VERIFY_TOKEN is not set', () => {
        skipTokenVerifyFixture.delete();

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getUser(newReq);

        expect(verifySpy).toHaveBeenCalledTimes(1);
        expect(verifySpy).toHaveBeenCalledWith(parsedToken, tokenSecret);
        expect(decodeSpy).toHaveBeenCalledTimes(0);
      });

      it('verifies token when SKIP_VERIFY_TOKEN is set to false', () => {
        skipTokenVerifyFixture.mock('false');

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getUser(newReq);

        expect(verifySpy).toHaveBeenCalledTimes(1);
        expect(verifySpy).toHaveBeenCalledWith(parsedToken, tokenSecret);
        expect(decodeSpy).toHaveBeenCalledTimes(0);
      });

      it('does not verify token when SKIP_VERIFY_TOKEN is set to true', () => {
        skipTokenVerifyFixture.mock('true');

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getUser(newReq);

        expect(decodeSpy).toHaveBeenCalledTimes(1);
        expect(decodeSpy).toHaveBeenCalledWith(parsedToken);
        expect(verifySpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('resident claims', () => {
      const secretFixture = envVarsFixture('HACKNEY_JWT_SECRET');
      const skipTokenVerifyFixture = envVarsFixture('SKIP_VERIFY_TOKEN');
      const tokenSecret = 'secret';

      beforeEach(() => {
        secretFixture.mock(tokenSecret);
        skipTokenVerifyFixture.mock('false');
      });

      afterEach(() => {
        secretFixture.restore();
        skipTokenVerifyFixture.restore();
      });

      it('returns user with correct claims when valid token is provided', () => {
        const applicationId = faker.string.uuid();
        const { signedToken } = generateSignedResidentToken(applicationId);
        const req: ApiRequest = createRequest();
        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `housing_user=${signedToken}`,
          },
        };

        jest
          .spyOn(cookie, 'parse')
          .mockReturnValueOnce({ housing_user: signedToken });

        const user = getUser(newReq);
        expect(user?.application_id).toBe(applicationId);
      });
    });

    describe('error handling', () => {
      it('throws when error occurs and it is not JsonWebTokenError', () => {
        const errorMessage = 'not JsonWebTokenError';

        const parseSpy = jest
          .spyOn(cookie, 'parse')
          .mockImplementationOnce(() => {
            throw new Error(errorMessage);
          });

        const req: ApiRequest = createRequest();

        expect(() => getUser(req)).toThrow(errorMessage);
        expect(parseSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('setAuthCookie', () => {
    const cookieName = 'housing_user';
    const { signedToken } = generateSignedResidentToken();
    const domain = '.hackney.gov.uk';
    const path = '/';
    const verifyAuthResponse: VerifyAuthResponse = {
      accessToken: signedToken,
    };
    const res: ApiResponse = createResponse();

    it('calls serialize on cookie with correct values', () => {
      const serializeSpy = jest.spyOn(cookie, 'serialize');

      setAuthCookie(res, verifyAuthResponse);

      expect(serializeSpy).toHaveBeenCalledTimes(1);
      expect(serializeSpy).toHaveBeenCalledWith(
        cookieName,
        verifyAuthResponse.accessToken,
        {
          domain,
          path,
        }
      );
    });

    it('sets Set-Cookie header with correct jwt cookie value', () => {
      const expectedJWTToken = cookie.serialize(
        'housing_user',
        verifyAuthResponse.accessToken,
        {
          domain: '.hackney.gov.uk',
          path: '/',
        }
      );
      setAuthCookie(res, verifyAuthResponse);
      expect(res.getHeader('Set-Cookie')).toBe(expectedJWTToken);
    });
  });

  describe('removeAuthCookie', () => {
    it('sets correct Set-cookie header', () => {
      const exp = 'Thu, 01 Jan 1970 00:00:00 GMT';

      const expectedCookie = `housing_user=; Domain=.hackney.gov.uk; Path=/; Expires=${exp}`;
      const res: ApiResponse = createResponse();

      removeAuthCookie(res);

      const newCookieHeader = res.getHeader('Set-Cookie');
      expect(newCookieHeader).toBe(expectedCookie);
    });
  });
});

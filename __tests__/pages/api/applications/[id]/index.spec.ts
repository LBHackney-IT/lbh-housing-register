/**
 * @jest-environment node
 */
import { faker } from '@faker-js/faker';
import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../../../domain/HousingApi';
import * as applicationApi from '../../../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../../../lib/utils/hasStaffPermissions';
import { isStaffAction } from '../../../../../lib/utils/isStaffAction';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/index';
import { generateMockRequestResponseWithHackneyToken } from '../../../../../testUtils/apiHelper';
import {
  UserRole,
  generateSignedTokenByRole,
} from '../../../../../testUtils/userHelper';

const applicationId = faker.string.uuid();
const mockApplicationData: Application = {
  id: applicationId,
};

const { signedToken } = generateSignedTokenByRole(UserRole.Manager);

jest.mock('../../../../../lib/utils/isStaffAction', () => ({
  isStaffAction: jest.fn(),
}));

jest.mock('../../../../../lib/utils/hasStaffPermissions', () => ({
  hasStaffPermissions: jest.fn(),
}));

jest.mock('../../../../../lib/utils/hasReadOnlyStaffPermissions', () => ({
  hasReadOnlyStaffPermissions: jest.fn(),
}));

jest.mock('axios');
const mockAxiosInstance = axios as jest.Mocked<typeof axios>;

describe('PATCH', () => {
  describe('authorization', () => {
    const jsonParseSpy = jest
      .spyOn(JSON, 'parse')
      .mockReturnValue(mockApplicationData);

    const canUpdateApplicationSpy = jest
      .spyOn(requestAuth, 'canUpdateApplication')
      .mockReturnValue(true);

    jest
      .spyOn(applicationApi, 'updateApplication')
      .mockResolvedValue({ ...mockApplicationData });

    const isStaffActionMock = (isStaffAction as jest.Mock).mockReturnValue(
      true
    );
    const hasStaffPermissionsMock = (hasStaffPermissions as jest.Mock).mockReturnValue(
      true
    );
    const hasReadOnlyStaffPermissionsMock = (hasReadOnlyStaffPermissions as jest.Mock).mockReturnValue(
      false
    );

    it('calls parse on JSON with the request body', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        requestBody: undefined,
        method: 'PATCH',
      });

      await endpoint(req, res);

      expect(jsonParseSpy).toHaveBeenCalledTimes(1);
      expect(jsonParseSpy).toHaveBeenCalledWith(req.body);
    });

    it('calls canUpdateApplication with request and application id from the query', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });
      req.query.id = applicationId;

      await endpoint(req, res);

      expect(canUpdateApplicationSpy).toHaveBeenCalledTimes(1);
      expect(canUpdateApplicationSpy).toHaveBeenCalledWith(req, applicationId);
    });

    it('calls isStaffAction with application, hasStaffPermissions and hasReadOnlyStaffPermissions with the request when canUpdateApplication returns false', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });
      canUpdateApplicationSpy.mockReturnValueOnce(false);

      await endpoint(req, res);

      expect(isStaffActionMock).toHaveBeenCalledTimes(1);
      expect(isStaffActionMock).toHaveBeenCalledWith(mockApplicationData);
      expect(hasStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasStaffPermissionsMock).toHaveBeenCalledWith(req);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledWith(req);
    });

    it('returns status code 200 and application data when application is updated is successfully', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res._getJSONData()).toStrictEqual(mockApplicationData);
    });

    it('sets response status code to 403 and json response to correct error message when user is not authorized to update the application', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });
      canUpdateApplicationSpy.mockReturnValue(false);
      isStaffActionMock.mockReturnValue(false);
      const expectedError = { message: 'Unable to update application' };

      //res.status().json() is using the same mock parser as JSON.parse, so need to override the default mock here
      jest.spyOn(JSON, 'parse').mockReturnValue(expectedError);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual(expectedError);
    });

    //staff member with read only permissions
    it('sets response status to 403 when canUpdateApplication returns false and isStaffAction, hasStaffPermissions, hasReadOnlyStaffPermissions return true', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });
      canUpdateApplicationSpy.mockReturnValue(false);
      isStaffActionMock.mockReturnValue(true);
      hasStaffPermissionsMock.mockReturnValue(true);
      hasReadOnlyStaffPermissionsMock.mockReturnValue(true);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('error handing', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    jest.mock('axios', () => ({
      create: jest.fn(),
    }));

    it('sets response status code to 500 and returns correct error message when non AxiosError is thrown', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });
      jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
        throw new Error();
      });

      const expectedErrorMessage = { message: 'Unable to update application' };
      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });

    it('set correct response status and message when axios response error is thrown', async () => {
      const axiosErrorStatusCode = StatusCodes.BAD_GATEWAY;
      const axiosErrorMessage = 'Bad gateway error thrown by axios';

      const mockAxiosError = {
        response: {
          status: axiosErrorStatusCode,
          data: axiosErrorMessage,
        },
      } as AxiosError;

      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });

      //mock json parse to return two different values on consecutive calls. This is because the same parser is used in JSON.parse() and res.status().json()
      const jsonParseSpy = jest
        .spyOn(JSON, 'parse')
        .mockReturnValueOnce(mockApplicationData);

      jest.spyOn(JSON, 'parse').mockReturnValue(axiosErrorMessage);
      jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

      //mock updateApplication to throw axios error. isAxiosError is mocked too separately to ensure correct flow is triggered
      jest
        .spyOn(applicationApi, 'updateApplication')
        .mockImplementationOnce(() => {
          throw mockAxiosError;
        });

      mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

      await endpoint(req, res);

      expect(res.statusCode).toBe(axiosErrorStatusCode);
      expect(res._getJSONData()).toBe(axiosErrorMessage);

      //JSON.parse(req.body) and res.status(error.response.status).json(error.response.data) calls the same JSON parse,
      // so this is to demonstrate that behavior
      expect(jsonParseSpy).toHaveBeenCalledTimes(2);
      expect(jsonParseSpy).toHaveBeenCalledWith(req.body);
      expect(jsonParseSpy).toHaveBeenCalledWith(
        JSON.stringify(axiosErrorMessage)
      );
    });

    it('logs the error when axios request error is thrown', async () => {
      const axiosErrorMessage = 'request error from axios';

      const mockAxiosError = {
        request: {
          data: axiosErrorMessage,
        },
      } as AxiosError;

      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });

      jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockApplicationData);
      jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

      jest
        .spyOn(applicationApi, 'updateApplication')
        .mockImplementationOnce(() => {
          throw mockAxiosError;
        });

      const consoleLogSpy = jest.spyOn(console, 'log');

      mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

      await endpoint(req, res);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(mockAxiosError.request);
    });

    it('logs the error when axios error other than request or resposne is thrown', async () => {
      const mockAxiosError = {
        message: 'error code from axios',
      } as AxiosError;

      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'PATCH',
      });

      jest.spyOn(JSON, 'parse').mockReturnValueOnce(mockApplicationData);
      jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

      jest
        .spyOn(applicationApi, 'updateApplication')
        .mockImplementationOnce(() => {
          throw mockAxiosError;
        });

      const consoleLogSpy = jest.spyOn(console, 'log');

      mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

      await endpoint(req, res);

      //doing assertions this way to avoid issues with escape characters in expected values
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const consoleLogSpyCall = consoleLogSpy.mock.calls.pop();
      expect(consoleLogSpyCall?.[0]).toBe('Error');
      expect(consoleLogSpyCall?.[1]).toBe(mockAxiosError.message);
    });

    it('sets response status to 400 and returns correct error message when wrong request method is used', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken({
        hackneyToken: signedToken,
        method: 'GET',
      });

      await endpoint(req, res);

      const expectedError = { message: 'Invalid request method' };

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual(expectedError);
    });
  });
});

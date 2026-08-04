/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { createMocks, RequestOptions } from 'node-mocks-http';

import { Application } from '../../../../domain/HousingApi';
import * as applicationApi from '../../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../../lib/utils/hasStaffPermissions';
import endpoint from '../../../../pages/api/applications/index';
import {
  MockRequestResponseParams,
  generateMockRequestResponseWithHackneyToken,
} from '../../../../testUtils/apiHelper';
import {
  UserRole,
  generateSignedTokenByRole,
} from '../../../../testUtils/userHelper';

const { signedToken } = generateSignedTokenByRole(UserRole.Manager);
const applicationId = faker.string.uuid();
const mockApplicationData: Application = {
  id: applicationId,
};
const mockApplicationWithAssessment: Application = {
  id: applicationId,
  assessment: { reason: 'test' },
};

const mockRequestResponseParameters: MockRequestResponseParams = {
  hackneyToken: signedToken,
  method: 'POST',
  requestBody: JSON.stringify(mockApplicationData),
};

jest.mock('../../../../lib/utils/hasStaffPermissions', () => ({
  hasStaffPermissions: jest.fn(),
}));

jest.mock('../../../../lib/utils/hasReadOnlyStaffPermissions', () => ({
  hasReadOnlyStaffPermissions: jest.fn(),
}));

const addApplicationSpy = jest
  .spyOn(applicationApi, 'addApplication')
  .mockResolvedValue({ ...mockApplicationData });

describe('POST', () => {
  const parseSpy = jest.spyOn(JSON, 'parse');
  const hasStaffPermissionsMock = hasStaffPermissions as jest.Mock;
  const hasReadOnlyStaffPermissionsMock =
    hasReadOnlyStaffPermissions as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    hasStaffPermissionsMock.mockReset();
    hasReadOnlyStaffPermissionsMock.mockReset();
    hasStaffPermissionsMock.mockReturnValue(true);
    hasReadOnlyStaffPermissionsMock.mockReturnValue(false);
    addApplicationSpy.mockResolvedValue({ ...mockApplicationData });
  });

  describe('authorization', () => {
    it('returns 403 without calling the backend when the caller is not staff', async () => {
      hasStaffPermissionsMock.mockReturnValue(false);

      const { req, res } = createMocks({
        method: 'POST',
        body: mockRequestResponseParameters.requestBody as unknown as RequestOptions['body'],
      });

      await endpoint(req, res);

      expect(addApplicationSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Unable to add application',
      });
    });

    it('returns 403 with the assessment message when the body is a staff action and the caller is not staff', async () => {
      hasStaffPermissionsMock.mockReturnValue(false);

      const { req, res } = createMocks({
        method: 'POST',
        body: JSON.stringify(
          mockApplicationWithAssessment,
        ) as unknown as RequestOptions['body'],
      });

      await endpoint(req, res);

      expect(addApplicationSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Unable to add application with assessment',
      });
    });

    it('returns 403 without calling the backend when the caller is read-only staff', async () => {
      hasStaffPermissionsMock.mockReturnValue(true);
      hasReadOnlyStaffPermissionsMock.mockReturnValue(true);

      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );

      await endpoint(req, res);

      expect(addApplicationSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Unable to add application',
      });
    });

    it('returns 403 with the assessment message when the body is a staff action and the caller is read-only staff', async () => {
      hasStaffPermissionsMock.mockReturnValue(true);
      hasReadOnlyStaffPermissionsMock.mockReturnValue(true);

      const { req, res } = generateMockRequestResponseWithHackneyToken({
        ...mockRequestResponseParameters,
        requestBody: JSON.stringify(mockApplicationWithAssessment),
      });

      await endpoint(req, res);

      expect(addApplicationSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Unable to add application with assessment',
      });
    });

    it('calls parse on JSON with request body', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );

      await endpoint(req, res);

      expect(parseSpy).toHaveBeenCalledTimes(1);
      expect(parseSpy).toHaveBeenCalledWith(req.body);
    });

    it('checks staff permissions once after parsing the body', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );

      await endpoint(req, res);

      expect(hasStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasStaffPermissionsMock).toHaveBeenCalledWith(req);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledWith(req);
    });

    it('calls addApplication with application from the request body when the caller has write access', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );
      const expectedApplication = JSON.parse(req.body);

      await endpoint(req, res);

      expect(addApplicationSpy).toHaveBeenCalledTimes(1);
      expect(addApplicationSpy).toHaveBeenCalledWith(expectedApplication, req);
    });

    it('sets response status code to 200 and returns application data when application was added successfully', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );
      const expectedApplication = JSON.parse(req.body);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res._getJSONData()).toStrictEqual(expectedApplication);
    });

    it('sets response status code to 400 when the request body cannot be parsed', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );
      const expectedErrorMessage = { message: 'Unable to parse request' };
      const mockErrorMessage = 'parse error';

      parseSpy.mockImplementationOnce(() => {
        throw Error(mockErrorMessage);
      });

      await endpoint(req, res);

      expect(addApplicationSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });

    it('sets correct response status code (500) and error message when addApplication throws a non-axios error', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters,
      );
      const expectedErrorMessage = { message: 'Unable to add application' };

      addApplicationSpy.mockImplementationOnce(() => {
        throw new Error('boom');
      });

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe('unsupported request methods', () => {
  it('returns 405 and advertises both supported methods', async () => {
    const { req, res } = generateMockRequestResponseWithHackneyToken({
      ...mockRequestResponseParameters,
      method: 'DELETE',
    });

    await endpoint(req, res);

    expect(addApplicationSpy).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET, POST');
    expect(res._getJSONData()).toStrictEqual({
      message: 'Method not allowed',
    });
  });
});

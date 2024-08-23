/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../../domain/HousingApi';
import * as applicationApi from '../../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../../lib/utils/hasStaffPermissions';
import { isStaffAction } from '../../../../lib/utils/isStaffAction';
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

const mockRequestResponseParameters: MockRequestResponseParams = {
  hackneyToken: signedToken,
  method: 'POST',
  requestBody: JSON.stringify(mockApplicationData),
};

jest.mock('../../../../lib/utils/isStaffAction', () => ({
  isStaffAction: jest.fn(),
}));

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
  const isStaffActionMock = (isStaffAction as jest.Mock).mockReturnValue(true);
  const hasStaffPermissionsMock = (hasStaffPermissions as jest.Mock).mockReturnValue(
    true
  );
  const hasReadOnlyStaffPermissionsMock = (hasReadOnlyStaffPermissions as jest.Mock).mockReturnValue(
    false
  );

  describe('authorization', () => {
    it('calls parse on JSON with request body', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );

      await endpoint(req, res);

      expect(parseSpy).toHaveBeenCalledTimes(1);
      expect(parseSpy).toHaveBeenCalledWith(req.body);
    });

    it('calls isStaffAction with application from request body, hasStaffPermissions and hasReadOnlyStaffPermissions with request when isStaffAction returns true', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedApplication = JSON.parse(req.body);

      await endpoint(req, res);

      expect(isStaffActionMock).toHaveBeenCalledWith(expectedApplication);
      expect(hasStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasStaffPermissionsMock).toHaveBeenCalledWith(req);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledTimes(1);
      expect(hasReadOnlyStaffPermissionsMock).toHaveBeenCalledWith(req);
    });

    it('sets response status code to 403 and adds an error message to the response when isStaffAction returns true and hasStaffPermissions returns false', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedErrorMessage = {
        message: 'Unable to add application with assessment',
      };

      isStaffActionMock.mockReturnValue(true);
      hasStaffPermissionsMock.mockReturnValue(false);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });

    it('sets response status code to 403 and adds an error message to the response when isStaffAction returns true and hasReadOnlyStaffPermissions returns true', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedErrorMessage = {
        message: 'Unable to add application with assessment',
      };

      isStaffActionMock.mockReturnValue(true);
      hasReadOnlyStaffPermissionsMock.mockReturnValue(true);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });

    it('calls addApplication with application from the request body when isStaffAction and hasStaffPermissions return true and hasReadOnlyStaffPermissions returns false', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedApplication = JSON.parse(req.body);

      isStaffActionMock.mockReturnValue(true);
      hasStaffPermissionsMock.mockReturnValue(true);
      hasReadOnlyStaffPermissionsMock.mockReturnValue(false);

      await endpoint(req, res);

      expect(addApplicationSpy).toHaveBeenCalledTimes(1);
      expect(addApplicationSpy).toHaveBeenCalledWith(expectedApplication);
    });

    it('sets response status code to 200 and returns application data when application was added successfully', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedApplication = JSON.parse(req.body);

      isStaffActionMock.mockReturnValue(true);
      hasStaffPermissionsMock.mockReturnValue(true);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res._getJSONData()).toStrictEqual(expectedApplication);
    });

    it('sets correct response status code (500) and error message when exception is thrown', async () => {
      const { req, res } = generateMockRequestResponseWithHackneyToken(
        mockRequestResponseParameters
      );
      const expectedErrorMessage = { message: 'Unable to add application' };
      const mockErrorMessage = 'parse error';

      parseSpy.mockImplementationOnce(() => {
        throw Error(mockErrorMessage);
      });

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
    });
  });
});

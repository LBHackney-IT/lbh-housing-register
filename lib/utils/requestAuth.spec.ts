import { faker } from '@faker-js/faker';
import { createRequest } from 'node-mocks-http';

import { Application } from '../../domain/HousingApi';
import { envVarsFixture } from '../../testUtils/envVarsHelper';
import { ApiRequest } from '../../testUtils/types';
import {
  AUTHORISED_ADMIN_GROUP_TEST,
  AUTHORISED_MANAGER_GROUP_TEST,
  AUTHORISED_OFFICER_GROUP_TEST,
  UserRole,
  generateSignedResidentToken,
  generateSignedTokenByRole,
} from '../../testUtils/userHelper';
import { ApplicationStatus } from '../types/application-status';
import {
  canUpdateApplication,
  hasStaffPermissions,
  isStaffAction,
} from './requestAuth';

const req: ApiRequest = createRequest();
const applicationId = faker.string.uuid();

describe('requestAuth', () => {
  //testing with real implementations since the current requestAuth structure doesn't allow mocking as usual
  // due to functions calling other functions within the module without specific export setup
  const skipTokenVerifyFixture = envVarsFixture('SKIP_VERIFY_TOKEN');
  const adminGroupFixture = envVarsFixture('AUTHORISED_ADMIN_GROUP');
  const managerGroupFixture = envVarsFixture('AUTHORISED_MANAGER_GROUP');
  const officerGroupFixture = envVarsFixture('AUTHORISED_OFFICER_GROUP');

  beforeEach(() => {
    skipTokenVerifyFixture.mock('true');
    adminGroupFixture.mock(AUTHORISED_ADMIN_GROUP_TEST);
    managerGroupFixture.mock(AUTHORISED_MANAGER_GROUP_TEST);
    officerGroupFixture.mock(AUTHORISED_OFFICER_GROUP_TEST);
  });

  afterEach(() => {
    skipTokenVerifyFixture.restore();
    adminGroupFixture.restore();
    managerGroupFixture.restore();
    officerGroupFixture.restore();
  });

  describe('canUpdateApplication', () => {
    //member of staff
    it('returns true when user has staff permissions', () => {
      const { signedToken } = generateSignedTokenByRole(UserRole.Admin);

      req.headers = {
        cookie: `hackneyToken=${signedToken}`,
      };

      expect(canUpdateApplication(req, applicationId)).toBeTruthy();
    });

    //resident
    it('returns true when user does not have staff permissions, but have claims to the application with given id', () => {
      const { signedToken, tokenData } = generateSignedResidentToken();

      req.headers = {
        cookie: `housing_user=${signedToken}`,
      };

      expect(canUpdateApplication(req, tokenData.application_id)).toBeTruthy();
    });

    it('returns false when user does not have staff permissions or correct claims', () => {
      const { signedToken } = generateSignedResidentToken('random-id');

      req.headers = {
        cookie: `housing_user=${signedToken}`,
      };

      expect(canUpdateApplication(req, 'different-id')).toBeFalsy();
    });
  });

  describe('hasStaffPermissions', () => {
    it('returns false when user is not staff member', () => {
      const { signedToken } = generateSignedResidentToken();

      req.headers = {
        cookie: `housing_user=${signedToken}`,
      };

      expect(hasStaffPermissions(req)).toBeFalsy();
    });

    it('returns false when user is staff member but does not have HR permissions', () => {
      const { signedToken } = generateSignedTokenByRole();
      req.headers = {
        cookie: `hackneyToken=${signedToken}`,
      };

      expect(hasStaffPermissions(req)).toBeFalsy();
    });

    it('returns true when user is staff member and has HR permissions', () => {
      const { signedToken } = generateSignedTokenByRole(UserRole.Manager);
      req.headers = {
        cookie: `hackneyToken=${signedToken}`,
      };

      expect(hasStaffPermissions(req)).toBeTruthy();
    });
  });

  describe('isStaffAction', () => {
    it('returns true when application is flagged to contain sensitive data', () => {
      const application: Application = {
        sensitiveData: true,
      };
      expect(isStaffAction(application)).toBeTruthy();
    });

    it('returns true when application has assessment', () => {
      const application: Application = {
        assessment: {
          reason: 'test',
        },
      };
      expect(isStaffAction(application)).toBeTruthy();
    });

    it('returns true when application is assigned to staff member', () => {
      const application: Application = {
        assignedTo: 'member of staff',
      };
      expect(isStaffAction(application)).toBeTruthy();
    });

    it('returns true when application has status and it is not draft', () => {
      const application: Application = {
        status: ApplicationStatus.ACTIVE,
      };
      expect(isStaffAction(application)).toBeTruthy();
    });

    it('returns false when application does not have sensitive data, assessment, assigned to or status set', () => {
      const application: Application = {};
      expect(isStaffAction(application)).toBeFalsy();
    });
  });
});

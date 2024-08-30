import { faker } from '@faker-js/faker';
import { createRequest } from 'node-mocks-http';

import { HackneyResident } from 'domain/HackneyResident';

import { ApiRequest } from '../../testUtils/types';
import { generateHRUserWithPermissions } from '../../testUtils/userHelper';
import { HackneyGoogleUserWithPermissions } from './googleAuth';
import { hasReadOnlyStaffPermissions } from './hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from './hasStaffPermissions';
import { canUpdateApplication } from './requestAuth';
import { getUser } from './users';

const req: ApiRequest = createRequest();
const applicationId = faker.string.uuid();
const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions();
const resident: HackneyResident = {
  application_id: applicationId,
};

jest.mock('../utils/hasStaffPermissions', () => ({
  hasStaffPermissions: jest.fn(),
}));

jest.mock('../utils/hasReadOnlyStaffPermissions', () => ({
  hasReadOnlyStaffPermissions: jest.fn(),
}));

jest.mock('./users', () => ({
  getUser: jest.fn(),
}));

describe('requestAuth', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('canUpdateApplication', () => {
    //staff member
    it('calls hasStaffPermissions with correct request', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(true);

      canUpdateApplication(req, applicationId);

      expect(hasStaffPermissions).toHaveBeenCalledTimes(1);
      expect(hasStaffPermissions).toHaveBeenCalledWith(req);
    });

    it('returns true when hasStaffPermissions returns true', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(true);

      expect(canUpdateApplication(req, applicationId)).toBeTruthy();
    });

    it('calls hasReadOnlyStaffPermission with correct request', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(true);
      (hasReadOnlyStaffPermissions as jest.Mock).mockReturnValueOnce(true);

      canUpdateApplication(req, applicationId);

      expect(hasReadOnlyStaffPermissions).toHaveBeenCalledTimes(1);
      expect(hasReadOnlyStaffPermissions).toHaveBeenCalledWith(req);
    });

    it('returns true when hasStaffPermissions returns true and hasReadOnlyStaffPermissions returns false', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(true);
      (hasReadOnlyStaffPermissions as jest.Mock).mockReturnValueOnce(false);

      expect(canUpdateApplication(req, applicationId)).toBeTruthy();
    });

    it('returns false when hasStaffPermissions returns true and hasReadOnlyStaffPermissions returns true', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(true);
      (hasReadOnlyStaffPermissions as jest.Mock).mockReturnValueOnce(true);

      expect(canUpdateApplication(req, applicationId)).toBeFalsy();
    });

    it('calls getUser with request when hasStaffPermissions returns false', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(false);
      (getUser as jest.Mock).mockReturnValueOnce(user);

      canUpdateApplication(req, applicationId);

      expect(getUser).toHaveBeenCalledTimes(1);
      expect(getUser).toHaveBeenCalledWith(req);
    });

    //resident
    it('returns true when user returned by getUser has claims to the given application id', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(false);
      (getUser as jest.Mock).mockReturnValueOnce(resident);

      expect(canUpdateApplication(req, applicationId)).toBeTruthy();
    });

    it('returns false  when user returned by getUser does not have claims to the given application id', () => {
      (hasStaffPermissions as jest.Mock).mockReturnValueOnce(false);
      (getUser as jest.Mock).mockReturnValueOnce(resident);

      expect(canUpdateApplication(req, 'non-matching-id')).toBeFalsy();
    });
  });
});

import { createRequest } from 'node-mocks-http';

import { ApiRequest } from 'testUtils/types';

import { generateHRUserWithPermissions } from '../../testUtils/userHelper';
import {
  HackneyGoogleUserWithPermissions,
  getSession,
  hasAnyPermissions,
} from './googleAuth';
import { hasStaffPermissions } from './hasStaffPermissions';

const req: ApiRequest = createRequest();

jest.mock('./googleAuth', () => ({
  getSession: jest.fn(),
  hasAnyPermissions: jest.fn(),
}));

describe('hasStaffPermissions', () => {
  const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls getSession with correct request', () => {
    (getSession as jest.Mock).mockReturnValueOnce(undefined);

    hasStaffPermissions(req);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(getSession).toHaveBeenCalledWith(req);
  });

  it('calls hasAnyPermissions with user returned by getSession', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasAnyPermissions as jest.Mock).mockReturnValueOnce(true);

    hasStaffPermissions(req);

    expect(hasAnyPermissions).toHaveBeenCalledTimes(1);
    expect(hasAnyPermissions).toHaveBeenCalledWith(user);
  });

  it('returns false when getSession returns undefined', () => {
    (getSession as jest.Mock).mockReturnValueOnce(undefined);

    expect(hasStaffPermissions(req)).toBeFalsy();
  });

  it('returns false when hasAnyPermissions returns false', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasAnyPermissions as jest.Mock).mockReturnValueOnce(false);

    expect(hasStaffPermissions(req)).toBeFalsy();
  });

  it('returns true when hasAnyPermissions returns true', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasAnyPermissions as jest.Mock).mockReturnValueOnce(true);

    expect(hasStaffPermissions(req)).toBeTruthy();
  });
});

import { createRequest } from 'node-mocks-http';

import { ApiRequest } from '../../testUtils/types';
import { generateHRUserWithPermissions } from '../../testUtils/userHelper';
import {
  HackneyGoogleUserWithPermissions,
  getSession,
  hasReadOnlyPermissions,
} from './googleAuth';
import { hasReadOnlyStaffPermissions } from './hasReadOnlyStaffPermissions';

jest.mock('./googleAuth', () => ({
  getSession: jest.fn(),
  hasReadOnlyPermissions: jest.fn(),
}));

const req: ApiRequest = createRequest();
const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions();

describe('hasReadOnlyStaffPermissions', () => {
  it('calls getSession with correct request', () => {
    (getSession as jest.Mock).mockReturnValueOnce(undefined);
    hasReadOnlyStaffPermissions(req);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(getSession).toHaveBeenCalledWith(req);
  });

  it('returns false when getSession returns undefined', () => {
    (getSession as jest.Mock).mockReturnValueOnce(undefined);

    expect(hasReadOnlyStaffPermissions(req)).toBeFalsy();
  });

  it('calls hasReadOnlyPermissions with the user returned by getSession', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasReadOnlyPermissions as jest.Mock).mockReturnValueOnce(true);

    hasReadOnlyStaffPermissions(req);

    expect(hasReadOnlyPermissions).toHaveBeenCalledTimes(1);
    expect(hasReadOnlyPermissions).toHaveBeenCalledWith(user);
  });

  it('returns false when hasReadOnlyPermissions returns false', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasReadOnlyPermissions as jest.Mock).mockReturnValueOnce(false);

    expect(hasReadOnlyStaffPermissions(req)).toBeFalsy();
  });

  it('returns true when hasReadOnlyPermissions returns true', () => {
    (getSession as jest.Mock).mockReturnValueOnce(user);
    (hasReadOnlyPermissions as jest.Mock).mockReturnValueOnce(true);

    expect(hasReadOnlyStaffPermissions(req)).toBeTruthy();
  });
});

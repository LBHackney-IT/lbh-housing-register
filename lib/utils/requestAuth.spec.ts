/** @jest-environment node */

import { createRequest } from 'node-mocks-http';

import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import { getSession } from '../auth/staff';
import { canUpdateApplication, getApplicationAccess } from './requestAuth';
import { getUser } from './users';

jest.mock('../auth/staff', () => ({
  getSession: jest.fn(),
  hasAnyPermissions: (user: { hasOfficerPermissions?: boolean }) =>
    Boolean(user.hasOfficerPermissions),
  hasReadOnlyPermissionOnly: (user: { hasReadOnlyPermissions?: boolean }) =>
    Boolean(user.hasReadOnlyPermissions),
}));
jest.mock('./users', () => ({ getUser: jest.fn() }));

const getSessionMock = getSession as jest.MockedFunction<typeof getSession>;
const getUserMock = getUser as jest.MockedFunction<typeof getUser>;

describe('getApplicationAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows staff with write permissions', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    expect(await getApplicationAccess(createRequest(), 'app-id')).toBe(
      'allowed',
    );
  });

  it('checks the staff session with the request and skips resident auth for writable staff', async () => {
    const req = createRequest();
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );

    await getApplicationAccess(req, 'app-id');

    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(getSessionMock).toHaveBeenCalledWith(req);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('forbids read-only staff', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );
    expect(await getApplicationAccess(createRequest(), 'app-id')).toBe(
      'forbidden',
    );
  });

  it('checks resident authentication when staff lacks write permission', async () => {
    const req = createRequest();
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );
    getUserMock.mockReturnValue(undefined);

    await getApplicationAccess(req, 'app-id');

    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(getUserMock).toHaveBeenCalledWith(req);
  });

  it('allows a resident to access only their own application', async () => {
    getSessionMock.mockResolvedValue(undefined);
    getUserMock.mockReturnValue({ application_id: 'app-id' });
    expect(await getApplicationAccess(createRequest(), 'app-id')).toBe(
      'allowed',
    );
    expect(await getApplicationAccess(createRequest(), 'another-id')).toBe(
      'forbidden',
    );
  });

  it('distinguishes an unauthenticated request', async () => {
    getSessionMock.mockResolvedValue(undefined);
    getUserMock.mockReturnValue(undefined);
    expect(await getApplicationAccess(createRequest(), 'app-id')).toBe(
      'unauthenticated',
    );
  });

  it.each([
    ['allowed', true],
    ['forbidden', false],
    ['unauthenticated', false],
  ] as const)(
    'maps %s application access to canUpdateApplication=%s',
    async (access, expected) => {
      if (access === 'allowed') {
        getSessionMock.mockResolvedValue(
          generateHRUserWithPermissions(UserRole.Officer),
        );
      } else if (access === 'forbidden') {
        getSessionMock.mockResolvedValue(
          generateHRUserWithPermissions(UserRole.ReadOnly),
        );
      } else {
        getSessionMock.mockResolvedValue(undefined);
      }
      getUserMock.mockReturnValue(undefined);

      await expect(
        canUpdateApplication(createRequest(), 'app-id'),
      ).resolves.toBe(expected);
    },
  );
});

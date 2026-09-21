/** @jest-environment node */

import { StatusCodes } from 'http-status-codes';
import { createMocks } from 'node-mocks-http';

import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import { getSession, hasAnyPermissions, hasUserGroup } from './staff';
import { requireApiStaff, requireApiStaffGroup } from './api';

jest.mock('./staff', () => ({
  getSession: jest.fn(),
  hasAnyPermissions: jest.fn(),
  hasUserGroup: jest.fn(),
}));

const getSessionMock = getSession as jest.MockedFunction<typeof getSession>;
const hasAnyPermissionsMock = hasAnyPermissions as jest.MockedFunction<
  typeof hasAnyPermissions
>;
const hasUserGroupMock = hasUserGroup as jest.MockedFunction<
  typeof hasUserGroup
>;

describe('requireApiStaff', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('checks the staff session using the request', async () => {
    const user = generateHRUserWithPermissions(UserRole.Officer);
    getSessionMock.mockResolvedValue(user);
    hasAnyPermissionsMock.mockReturnValue(true);
    const { req, res } = createMocks();

    await requireApiStaff(req, res);

    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(getSessionMock).toHaveBeenCalledWith(req);
  });

  it('returns 401 when no authenticated staff session exists', async () => {
    getSessionMock.mockResolvedValue(undefined);
    const { req, res } = createMocks();

    await expect(requireApiStaff(req, res)).resolves.toBeUndefined();

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res._getJSONData()).toEqual({ message: 'Unauthorized' });
    expect(hasAnyPermissionsMock).not.toHaveBeenCalled();
  });

  it('returns 403 when staff has none of the configured permissions', async () => {
    const user = generateHRUserWithPermissions();
    getSessionMock.mockResolvedValue(user);
    hasAnyPermissionsMock.mockReturnValue(false);
    const { req, res } = createMocks();

    await expect(requireApiStaff(req, res)).resolves.toBeUndefined();

    expect(hasAnyPermissionsMock).toHaveBeenCalledWith(user);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toEqual({ message: 'Access denied' });
  });

  it('returns authenticated staff with an application permission', async () => {
    const user = generateHRUserWithPermissions(UserRole.Manager);
    getSessionMock.mockResolvedValue(user);
    hasAnyPermissionsMock.mockReturnValue(true);
    const { req, res } = createMocks();

    await expect(requireApiStaff(req, res)).resolves.toBe(user);

    expect(res._isEndCalled()).toBe(false);
  });
});

describe('requireApiStaffGroup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns without checking a group when staff authentication fails', async () => {
    getSessionMock.mockResolvedValue(undefined);
    const { req, res } = createMocks();

    await expect(
      requireApiStaffGroup(req, res, 'required-group'),
    ).resolves.toBeUndefined();

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(hasUserGroupMock).not.toHaveBeenCalled();
  });

  it('returns 403 when authenticated staff lacks the required group', async () => {
    const user = generateHRUserWithPermissions(UserRole.Officer);
    getSessionMock.mockResolvedValue(user);
    hasAnyPermissionsMock.mockReturnValue(true);
    hasUserGroupMock.mockReturnValue(false);
    const { req, res } = createMocks();

    await expect(
      requireApiStaffGroup(req, res, 'required-group'),
    ).resolves.toBeUndefined();

    expect(hasUserGroupMock).toHaveBeenCalledWith('required-group', user);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toEqual({ message: 'Access denied' });
  });

  it('returns staff with the required group', async () => {
    const user = generateHRUserWithPermissions(UserRole.Admin);
    getSessionMock.mockResolvedValue(user);
    hasAnyPermissionsMock.mockReturnValue(true);
    hasUserGroupMock.mockReturnValue(true);
    const { req, res } = createMocks();

    await expect(
      requireApiStaffGroup(req, res, 'required-group'),
    ).resolves.toBe(user);

    expect(hasUserGroupMock).toHaveBeenCalledWith('required-group', user);
    expect(res._isEndCalled()).toBe(false);
  });
});

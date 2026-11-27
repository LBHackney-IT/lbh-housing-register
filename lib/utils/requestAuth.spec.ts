/** @jest-environment node */

import { createRequest } from 'node-mocks-http';

import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import { getSession } from '../auth/staff';
import {
  canUpdateApplication,
  getApplicationAccess,
  getResidentApplicationAccess,
  getStaffWriteAccess,
} from './requestAuth';
import { getUser } from './users';

jest.mock('../auth/staff', () => ({
  ...jest.requireActual('../auth/staff'),
  getSession: jest.fn(),
}));
jest.mock('./users', () => ({ getUser: jest.fn() }));

const getSessionMock = getSession as jest.MockedFunction<typeof getSession>;
const getUserMock = getUser as jest.MockedFunction<typeof getUser>;

describe('getApplicationAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'allows writable staff role %s',
    async (role) => {
      getSessionMock.mockResolvedValue(generateHRUserWithPermissions(role));
      expect(await getApplicationAccess(createRequest(), 'app-id')).toBe(
        'allowed',
      );
    },
  );

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

  it('forbids authenticated staff without an authorised role', async () => {
    getSessionMock.mockResolvedValue(generateHRUserWithPermissions());
    getUserMock.mockReturnValue(undefined);

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

describe('getStaffWriteAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'allows writable staff role %s',
    async (role) => {
      getSessionMock.mockResolvedValue(generateHRUserWithPermissions(role));

      expect(await getStaffWriteAccess(createRequest())).toBe('allowed');
    },
  );

  it('refuses a resident, even for their own application', async () => {
    getSessionMock.mockResolvedValue(undefined);
    getUserMock.mockReturnValue({ application_id: 'app-id' });

    expect(await getStaffWriteAccess(createRequest())).toBe('forbidden');
  });

  it('forbids read-only staff', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );

    expect(await getStaffWriteAccess(createRequest())).toBe('forbidden');
  });

  it('distinguishes an unauthenticated request', async () => {
    getSessionMock.mockResolvedValue(undefined);
    getUserMock.mockReturnValue(undefined);

    expect(await getStaffWriteAccess(createRequest())).toBe('unauthenticated');
  });
});

describe('getResidentApplicationAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows a resident to access only their own application', () => {
    getUserMock.mockReturnValue({ application_id: 'app-id' });

    expect(getResidentApplicationAccess(createRequest(), 'app-id')).toBe(
      'allowed',
    );
    expect(getResidentApplicationAccess(createRequest(), 'another-id')).toBe(
      'forbidden',
    );
  });

  it('refuses staff, even a writable role, who have no resident session', () => {
    getUserMock.mockReturnValue(undefined);

    expect(getResidentApplicationAccess(createRequest(), 'app-id')).toBe(
      'unauthenticated',
    );
    expect(getSessionMock).not.toHaveBeenCalled();
  });

  it('distinguishes an unauthenticated request', () => {
    getUserMock.mockReturnValue(undefined);

    expect(getResidentApplicationAccess(createRequest(), 'app-id')).toBe(
      'unauthenticated',
    );
  });
});

/** @jest-environment node */

import { type AxiosError } from 'axios';
import { createRequest } from 'node-mocks-http';

import { ApplicationStatus } from '../types/application-status';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import { getApplication } from '../gateways/applications-api';
import { getSession } from '../auth/staff';
import { canUpdateApplication, getApplicationAccess } from './requestAuth';
import { getUser } from './users';

jest.mock('../auth/staff', () => ({
  ...jest.requireActual('../auth/staff'),
  getSession: jest.fn(),
}));
jest.mock('./users', () => ({ getUser: jest.fn() }));
jest.mock('../gateways/applications-api', () => ({
  getApplication: jest.fn(),
}));

const getSessionMock = getSession as jest.MockedFunction<typeof getSession>;
const getUserMock = getUser as jest.MockedFunction<typeof getUser>;
const getApplicationMock = getApplication as jest.MockedFunction<
  typeof getApplication
>;

const applicationId = 'app-id';
const editableManualDraft = {
  id: applicationId,
  status: ApplicationStatus.MANUAL_DRAFT,
  sensitiveData: false,
};

describe('getApplicationAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUserMock.mockReturnValue(undefined);
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'allows writable staff role %s to edit a manual draft',
    async (role) => {
      getSessionMock.mockResolvedValue(generateHRUserWithPermissions(role));
      getApplicationMock.mockResolvedValue(editableManualDraft);

      expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
        'allowed',
      );
      expect(getApplicationMock).toHaveBeenCalledWith(applicationId);
    },
  );

  it('allows an officer to edit their assigned submitted application', async () => {
    const officer = generateHRUserWithPermissions(UserRole.Officer);
    getSessionMock.mockResolvedValue(officer);
    getApplicationMock.mockResolvedValue({
      id: applicationId,
      status: ApplicationStatus.SUBMITTED,
      assignedTo: officer.email,
      sensitiveData: false,
    });

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'allowed',
    );
  });

  it('forbids an officer from editing an application assigned to someone else', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockResolvedValue({
      id: applicationId,
      status: ApplicationStatus.SUBMITTED,
      assignedTo: 'someone-else@hackney.gov.uk',
      sensitiveData: false,
    });

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
  });

  it('forbids an officer from accessing a sensitive application assigned to someone else', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockResolvedValue({
      id: applicationId,
      status: ApplicationStatus.SUBMITTED,
      assignedTo: 'someone-else@hackney.gov.uk',
      sensitiveData: true,
    });

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
  });

  it('allows a manager to access a sensitive application', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Manager),
    );
    getApplicationMock.mockResolvedValue({
      id: applicationId,
      status: ApplicationStatus.ACTIVE,
      assignedTo: 'officer@hackney.gov.uk',
      sensitiveData: true,
    });

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'allowed',
    );
  });

  it('forbids staff when the application does not exist', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockResolvedValue(null);

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
  });

  it('forbids staff when the housing API returns 404', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    } as AxiosError);

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
  });

  it('rethrows housing API errors other than 404', async () => {
    const upstreamError = {
      isAxiosError: true,
      response: { status: 502 },
    } as AxiosError;
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockRejectedValue(upstreamError);

    await expect(
      getApplicationAccess(createRequest(), applicationId),
    ).rejects.toBe(upstreamError);
  });

  it('checks the staff session with the request and skips resident auth for writable staff', async () => {
    const req = createRequest();
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );
    getApplicationMock.mockResolvedValue(editableManualDraft);

    await getApplicationAccess(req, applicationId);

    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(getSessionMock).toHaveBeenCalledWith(req);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('forbids read-only staff without loading the application', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );
    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
    expect(getApplicationMock).not.toHaveBeenCalled();
  });

  it('forbids authenticated staff without an authorised role', async () => {
    getSessionMock.mockResolvedValue(generateHRUserWithPermissions());

    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'forbidden',
    );
    expect(getApplicationMock).not.toHaveBeenCalled();
  });

  it('checks resident authentication when staff lacks write permission', async () => {
    const req = createRequest();
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );

    await getApplicationAccess(req, applicationId);

    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(getUserMock).toHaveBeenCalledWith(req);
  });

  it('allows a resident to access only their own application without loading it', async () => {
    getSessionMock.mockResolvedValue(undefined);
    getUserMock.mockReturnValue({ application_id: applicationId });
    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'allowed',
    );
    expect(await getApplicationAccess(createRequest(), 'another-id')).toBe(
      'forbidden',
    );
    expect(getApplicationMock).not.toHaveBeenCalled();
  });

  it('distinguishes an unauthenticated request', async () => {
    getSessionMock.mockResolvedValue(undefined);
    expect(await getApplicationAccess(createRequest(), applicationId)).toBe(
      'unauthenticated',
    );
    expect(getApplicationMock).not.toHaveBeenCalled();
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
        getApplicationMock.mockResolvedValue(editableManualDraft);
      } else if (access === 'forbidden') {
        getSessionMock.mockResolvedValue(
          generateHRUserWithPermissions(UserRole.ReadOnly),
        );
      } else {
        getSessionMock.mockResolvedValue(undefined);
      }

      await expect(
        canUpdateApplication(createRequest(), applicationId),
      ).resolves.toBe(expected);
    },
  );
});

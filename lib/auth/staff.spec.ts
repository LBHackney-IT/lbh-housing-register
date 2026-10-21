import { createRequest } from 'node-mocks-http';
import { getToken } from 'next-auth/jwt';

import { ApplicationStatus } from '../types/application-status';
import { envVarsFixture } from '../../testUtils/envVarsHelper';
import { generateJWTTokenTestData } from '../../testUtils/jwtTokenHelper';
import {
  AUTHORISED_ADMIN_GROUP_TEST,
  AUTHORISED_MANAGER_GROUP_TEST,
  AUTHORISED_OFFICER_GROUP_TEST,
  AUTHORISED_READONLY_GROUP_TEST,
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import {
  areE2eRoutesEnabled,
  areE2eStaffGroupsEnabled,
} from '../server/e2eAccess';
import {
  canEditApplications,
  canViewSensitiveApplication,
  getCognitoIdToken,
  getPermissions,
  getRedirect,
  getSession,
  hasAnyPermissions,
  hasReadOnlyPermissionOnly,
  hasUserGroup,
} from './staff';

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));
jest.mock('../server/e2eAccess', () => ({
  areE2eRoutesEnabled: jest.fn(),
  areE2eStaffGroupsEnabled: jest.fn(),
}));

const getTokenMock = getToken as jest.MockedFunction<typeof getToken>;
const areE2eRoutesEnabledMock = areE2eRoutesEnabled as jest.MockedFunction<
  typeof areE2eRoutesEnabled
>;
const areE2eStaffGroupsEnabledMock =
  areE2eStaffGroupsEnabled as jest.MockedFunction<
    typeof areE2eStaffGroupsEnabled
  >;

describe('Cognito staff authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    areE2eRoutesEnabledMock.mockReturnValue(false);
    areE2eStaffGroupsEnabledMock.mockReturnValue(false);
  });

  it('returns a staff identity and permissions from a valid encrypted session', async () => {
    const officerGroup = envVarsFixture('AUTHORISED_OFFICER_GROUP');
    officerGroup.mock('officers');
    getTokenMock.mockResolvedValue({
      cognitoIdToken: 'verified-id-token',
      cognitoTokenExpiresAt: Math.floor(Date.now() / 1000) + 300,
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: ['officers'],
      iat: 123,
    });

    const user = await getSession(createRequest());

    expect(user).toMatchObject({
      sub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      groups: ['officers'],
      hasOfficerPermissions: true,
    });
    expect(hasAnyPermissions(user!)).toBe(true);
    officerGroup.restore();
  });

  it('rejects an expired Cognito ID token', async () => {
    getTokenMock.mockResolvedValue({
      cognitoIdToken: 'expired-id-token',
      cognitoTokenExpiresAt: Math.floor(Date.now() / 1000) - 1,
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: [],
    });

    await expect(getSession(createRequest())).resolves.toBeUndefined();
    await expect(getCognitoIdToken(createRequest())).resolves.toBeUndefined();
  });

  it('never treats an incomplete session as authenticated', async () => {
    getTokenMock.mockResolvedValue({ cognitoSub: 'cognito-sub' });
    await expect(getSession(createRequest())).resolves.toBeUndefined();
  });

  it('accepts an explicitly marked synthetic session only in mocked E2E mode', async () => {
    areE2eRoutesEnabledMock.mockReturnValue(true);
    getTokenMock.mockResolvedValue({
      e2eStaff: true,
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: ['officers'],
    });

    await expect(getSession(createRequest())).resolves.toMatchObject({
      sub: 'cognito-sub',
      groups: ['officers'],
    });
    await expect(getCognitoIdToken(createRequest())).resolves.toBeUndefined();
  });

  it('rejects a synthetic session outside mocked E2E mode', async () => {
    getTokenMock.mockResolvedValue({
      e2eStaff: true,
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: ['officers'],
    });

    await expect(getSession(createRequest())).resolves.toBeUndefined();
  });

  it('rejects a synthetic session containing a fake Cognito ID token', async () => {
    areE2eRoutesEnabledMock.mockReturnValue(true);
    getTokenMock.mockResolvedValue({
      e2eStaff: true,
      cognitoIdToken: 'fake-token',
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: ['officers'],
    });

    await expect(getSession(createRequest())).resolves.toBeUndefined();
  });

  it('preserves only safe local return paths', () => {
    expect(getRedirect(undefined, false, '/applications/123?tab=history')).toBe(
      '/login?returnTo=%2Fapplications%2F123%3Ftab%3Dhistory',
    );
    expect(getRedirect(undefined, false, 'https://attacker.example')).toBe(
      '/login?returnTo=%2Fapplications',
    );
  });

  it('derives permissions from configured group IDs', () => {
    const adminGroup = envVarsFixture('AUTHORISED_ADMIN_GROUP');
    adminGroup.mock('admins');
    expect(
      getPermissions({
        sub: 'sub',
        email: 'admin@hackney.gov.uk',
        iss: process.env.COGNITO_ISSUER!,
        name: 'Admin',
        groups: ['admins'],
        iat: 1,
      }).hasAdminPermissions,
    ).toBe(true);
    adminGroup.restore();
  });

  describe('E2E group allowlist', () => {
    const testUser = (groups: string[]) => ({
      sub: 'sub',
      email: 'e2e@hackney.gov.uk',
      iss: process.env.COGNITO_ISSUER!,
      name: 'E2E Manager',
      groups,
      iat: 1,
    });
    const realGroup = envVarsFixture('AUTHORISED_MANAGER_GROUP');
    const e2eGroup = envVarsFixture('E2E_AUTHORISED_MANAGER_GROUP');

    beforeEach(() => {
      realGroup.mock('real-managers');
      e2eGroup.mock('e2e-testing-t-and-l');
    });

    afterEach(() => {
      realGroup.restore();
      e2eGroup.restore();
    });

    it('grants the role to the E2E group during local E2E runs', () => {
      areE2eStaffGroupsEnabledMock.mockReturnValue(true);

      expect(
        getPermissions(testUser(['e2e-testing-t-and-l'])).hasManagerPermissions,
      ).toBe(true);
    });

    it('still grants the role to the real group during local E2E runs', () => {
      areE2eStaffGroupsEnabledMock.mockReturnValue(true);

      expect(
        getPermissions(testUser(['real-managers'])).hasManagerPermissions,
      ).toBe(true);
    });

    it('ignores the E2E group outside local E2E runs', () => {
      expect(
        getPermissions(testUser(['e2e-testing-t-and-l'])).hasManagerPermissions,
      ).toBe(false);
      expect(
        getPermissions(testUser(['real-managers'])).hasManagerPermissions,
      ).toBe(true);
    });

    it('grants nothing for an unconfigured E2E group', () => {
      areE2eStaffGroupsEnabledMock.mockReturnValue(true);
      e2eGroup.delete();

      expect(getPermissions(testUser(['']))).toEqual({
        hasAdminPermissions: false,
        hasManagerPermissions: false,
        hasOfficerPermissions: false,
        hasReadOnlyPermissions: false,
      });
    });
  });

  it.each([
    ['missing ID token', { cognitoIdToken: undefined }],
    ['missing Cognito subject', { cognitoSub: undefined }],
    ['missing email', { email: undefined }],
    ['missing name', { name: undefined }],
    ['missing expiry', { cognitoTokenExpiresAt: undefined }],
  ])('rejects a session with %s', async (_description, override) => {
    getTokenMock.mockResolvedValue({
      cognitoIdToken: 'id-token',
      cognitoTokenExpiresAt: Math.floor(Date.now() / 1000) + 300,
      cognitoSub: 'cognito-sub',
      email: 'officer@hackney.gov.uk',
      name: 'Test Officer',
      groups: [],
      ...override,
    });

    await expect(getSession(createRequest())).resolves.toBeUndefined();
  });

  it('passes the request and configured secret to NextAuth token decoding', async () => {
    getTokenMock.mockResolvedValue(null);
    const req = createRequest();

    await getSession(req);

    expect(getTokenMock).toHaveBeenCalledWith({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
  });
});

describe('staff permissions', () => {
  const adminGroup = envVarsFixture('AUTHORISED_ADMIN_GROUP');
  const managerGroup = envVarsFixture('AUTHORISED_MANAGER_GROUP');
  const officerGroup = envVarsFixture('AUTHORISED_OFFICER_GROUP');
  const readOnlyGroup = envVarsFixture('AUTHORISED_READONLY_GROUP');

  beforeEach(() => {
    adminGroup.mock(AUTHORISED_ADMIN_GROUP_TEST);
    managerGroup.mock(AUTHORISED_MANAGER_GROUP_TEST);
    officerGroup.mock(AUTHORISED_OFFICER_GROUP_TEST);
    readOnlyGroup.mock(AUTHORISED_READONLY_GROUP_TEST);
  });

  afterEach(() => {
    adminGroup.restore();
    managerGroup.restore();
    officerGroup.restore();
    readOnlyGroup.restore();
    jest.restoreAllMocks();
  });

  it('derives all permissions from the configured group claims', () => {
    const user = generateJWTTokenTestData([
      AUTHORISED_ADMIN_GROUP_TEST,
      AUTHORISED_MANAGER_GROUP_TEST,
      AUTHORISED_OFFICER_GROUP_TEST,
      AUTHORISED_READONLY_GROUP_TEST,
    ]);

    expect(getPermissions(user)).toEqual({
      hasAdminPermissions: true,
      hasManagerPermissions: true,
      hasOfficerPermissions: true,
      hasReadOnlyPermissions: true,
    });
  });

  it('matches group names exactly while ignoring surrounding whitespace', () => {
    const user = generateJWTTokenTestData([` ${AUTHORISED_ADMIN_GROUP_TEST} `]);

    expect(hasUserGroup(` ${AUTHORISED_ADMIN_GROUP_TEST} `, user)).toBe(true);
    expect(hasUserGroup('another-group', user)).toBe(false);
    expect(hasUserGroup('', user)).toBe(false);
  });

  it.each([
    UserRole.Admin,
    UserRole.Manager,
    UserRole.Officer,
    UserRole.ReadOnly,
  ])('recognises role %s as having an application permission', (role) => {
    expect(hasAnyPermissions(generateHRUserWithPermissions(role))).toBe(true);
  });

  it('returns false when the user has no application permissions', () => {
    expect(hasAnyPermissions(generateHRUserWithPermissions())).toBe(false);
  });

  it.each([
    [UserRole.Admin, true],
    [UserRole.Manager, true],
    [UserRole.Officer, false],
    [UserRole.ReadOnly, false],
  ])(
    'applies role %s when viewing an unassigned sensitive application',
    (role, expected) => {
      expect(
        canViewSensitiveApplication('', generateHRUserWithPermissions(role)),
      ).toBe(expected);
    },
  );

  it('lets an officer view a sensitive application assigned to their email', () => {
    const officer = generateHRUserWithPermissions(UserRole.Officer);
    expect(canViewSensitiveApplication(officer.email, officer)).toBe(true);
  });

  it('redirects unauthenticated users to login with a safe return path', () => {
    expect(getRedirect(undefined, false, '/applications/123')).toBe(
      '/login?returnTo=%2Fapplications%2F123',
    );
  });

  it('redirects users without permissions to access denied', () => {
    expect(getRedirect(generateHRUserWithPermissions())).toBe('/access-denied');
  });

  it('redirects read-only users when write permission is required', () => {
    expect(
      getRedirect(generateHRUserWithPermissions(UserRole.ReadOnly), true),
    ).toBe('/access-denied');
  });

  it('does not redirect users with sufficient permissions', () => {
    expect(
      getRedirect(generateHRUserWithPermissions(UserRole.Officer), true),
    ).toBeUndefined();
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'does not classify role %s as read-only',
    (role) => {
      expect(
        hasReadOnlyPermissionOnly(generateHRUserWithPermissions(role)),
      ).toBe(false);
    },
  );

  it('classifies a user with only read-only permission as read-only', () => {
    expect(
      hasReadOnlyPermissionOnly(
        generateHRUserWithPermissions(UserRole.ReadOnly),
      ),
    ).toBe(true);
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'does not classify role %s plus read-only membership as read-only-only',
    (role) => {
      expect(
        hasReadOnlyPermissionOnly({
          ...generateHRUserWithPermissions(role),
          hasReadOnlyPermissions: true,
        }),
      ).toBe(false);
    },
  );

  it('does not classify a user with all permissions as read-only-only', () => {
    expect(
      hasReadOnlyPermissionOnly({
        ...generateHRUserWithPermissions(UserRole.Officer),
        hasAdminPermissions: true,
        hasManagerPermissions: true,
        hasReadOnlyPermissions: true,
      }),
    ).toBe(false);
  });
});

describe('canEditApplications', () => {
  it('allows a manager to edit any application status', () => {
    expect(
      canEditApplications(generateHRUserWithPermissions(UserRole.Manager), {
        status: ApplicationStatus.ACTIVE,
      }),
    ).toBe(true);
  });

  it.each([
    UserRole.Admin,
    UserRole.Manager,
    UserRole.Officer,
    UserRole.ReadOnly,
  ])('allows permitted role %s to edit a manual draft', (role) => {
    expect(
      canEditApplications(generateHRUserWithPermissions(role), {
        status: ApplicationStatus.MANUAL_DRAFT,
      }),
    ).toBe(true);
  });

  it('does not implicitly give an admin the manager edit-all rule', () => {
    expect(
      canEditApplications(generateHRUserWithPermissions(UserRole.Admin), {
        status: ApplicationStatus.ACTIVE,
      }),
    ).toBe(false);
  });

  it.each([
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.AWAITING_REASSESSMENT,
  ])('allows an officer to edit their assigned %s application', (status) => {
    const officer = generateHRUserWithPermissions(UserRole.Officer);
    expect(
      canEditApplications(officer, {
        status,
        assignedTo: officer.email,
      }),
    ).toBe(true);
  });

  it('rejects edits by staff without permission or assignment', () => {
    expect(
      canEditApplications(generateHRUserWithPermissions(), {
        status: ApplicationStatus.MANUAL_DRAFT,
      }),
    ).toBe(false);
    expect(
      canEditApplications(generateHRUserWithPermissions(UserRole.Officer), {
        status: ApplicationStatus.SUBMITTED,
        assignedTo: 'someone-else@hackney.gov.uk',
      }),
    ).toBe(false);
  });
});

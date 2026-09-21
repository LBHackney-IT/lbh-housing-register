import type { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

import { Application } from '../../domain/HousingApi';
import { StaffUser } from '../../domain/StaffUser';
import {
  areE2eRoutesEnabled,
  areE2eStaffGroupsEnabled,
} from '../server/e2eAccess';
import { ApplicationStatus } from '../types/application-status';
import { assertStaffAuthEnvironment, authOptions } from './options';
import { safeStaffReturnPath } from './redirects';

export type Permissions = {
  hasAdminPermissions: boolean;
  hasManagerPermissions: boolean;
  hasOfficerPermissions: boolean;
  hasReadOnlyPermissions: boolean;
};

export type StaffUserWithPermissions = StaffUser & Permissions;

export const hasUserGroup = (group: string, user: StaffUser): boolean => {
  // Configured group names come from environment variables, where stray
  // whitespace is easy to introduce and impossible to spot in a log.
  const required = group?.trim();
  if (!required) return false;

  return user.groups.some((userGroup) => userGroup.trim() === required);
};

export const getPermissions = (user: StaffUser): Permissions => {
  const {
    AUTHORISED_ADMIN_GROUP,
    AUTHORISED_MANAGER_GROUP,
    AUTHORISED_OFFICER_GROUP,
    AUTHORISED_READONLY_GROUP,
    E2E_AUTHORISED_MANAGER_GROUP,
  } = process.env;

  // Local E2E additionally maps the dedicated Cognito test user onto manager.
  // The real group names stay in AUTHORISED_*_GROUP for staff signing in with
  // their own claims. Only manager is needed: that is the one local staff spec.
  return {
    hasAdminPermissions: hasUserGroup(AUTHORISED_ADMIN_GROUP as string, user),
    hasManagerPermissions:
      hasUserGroup(AUTHORISED_MANAGER_GROUP as string, user) ||
      (areE2eStaffGroupsEnabled() &&
        hasUserGroup(E2E_AUTHORISED_MANAGER_GROUP as string, user)),
    hasOfficerPermissions: hasUserGroup(
      AUTHORISED_OFFICER_GROUP as string,
      user,
    ),
    hasReadOnlyPermissions: hasUserGroup(
      AUTHORISED_READONLY_GROUP as string,
      user,
    ),
  };
};

type StaffRequest = NextApiRequest | GetServerSidePropsContext['req'];

type ValidStaffToken = JWT & {
  cognitoSub: string;
  email: string;
  name: string;
  groups: string[];
  cognitoIdToken?: string;
  cognitoTokenExpiresAt?: number;
};

async function getStaffToken(
  req: StaffRequest,
): Promise<ValidStaffToken | undefined> {
  assertStaffAuthEnvironment();
  const token = await getToken({
    req,
    secret: authOptions.secret,
  });

  const hasIdentity =
    typeof token?.cognitoSub === 'string' &&
    typeof token.email === 'string' &&
    typeof token.name === 'string' &&
    Array.isArray(token.groups) &&
    token.groups.every((group) => typeof group === 'string');
  if (!hasIdentity) return;

  const hasValidCognitoToken =
    token.e2eStaff !== true &&
    typeof token.cognitoIdToken === 'string' &&
    typeof token.cognitoTokenExpiresAt === 'number' &&
    token.cognitoTokenExpiresAt * 1000 > Date.now();
  const hasValidMockedE2eSession =
    token.e2eStaff === true &&
    token.cognitoIdToken === undefined &&
    token.cognitoTokenExpiresAt === undefined &&
    areE2eRoutesEnabled();

  if (!hasValidCognitoToken && !hasValidMockedE2eSession) return;

  return token as ValidStaffToken;
}

export async function getSession(
  req: StaffRequest,
): Promise<StaffUserWithPermissions | undefined> {
  const token = await getStaffToken(req);
  if (!token) return;

  const user: StaffUser = {
    sub: token.cognitoSub,
    email: token.email,
    name: token.name,
    groups: token.groups ?? [],
    iss: process.env.COGNITO_ISSUER as string,
    iat: typeof token.iat === 'number' ? token.iat : 0,
  };

  return {
    ...user,
    ...getPermissions(user),
  };
}

export async function getCognitoIdToken(
  req: StaffRequest,
): Promise<string | undefined> {
  return (await getStaffToken(req))?.cognitoIdToken;
}

export const hasAnyPermissions = (user: StaffUserWithPermissions): boolean => {
  if (!user) {
    return false;
  }
  return (
    user.hasAdminPermissions ||
    user.hasManagerPermissions ||
    user.hasOfficerPermissions ||
    user.hasReadOnlyPermissions
  );
};

export const canViewSensitiveApplication = (
  assignedTo: string,
  user: StaffUserWithPermissions,
): boolean => {
  if (user.hasAdminPermissions || user.hasManagerPermissions) {
    return true;
  }
  return user.hasOfficerPermissions && assignedTo === user.email;
};

export const hasReadOnlyPermissionOnly = (
  user: StaffUserWithPermissions,
): boolean => {
  if (!user) return false;
  return (
    user.hasReadOnlyPermissions &&
    !user.hasAdminPermissions &&
    !user.hasManagerPermissions &&
    !user.hasOfficerPermissions
  );
};

export const getRedirect = (
  user?: StaffUserWithPermissions,
  writePermissionsRequired?: boolean,
  returnTo?: string,
): string | undefined => {
  if (!user) {
    return `/login?returnTo=${encodeURIComponent(
      safeStaffReturnPath(returnTo),
    )}`;
  }
  if (
    !hasAnyPermissions(user) ||
    (writePermissionsRequired && hasReadOnlyPermissionOnly(user))
  ) {
    return '/access-denied';
  }
};

export const canEditApplications = (
  user: StaffUserWithPermissions,
  data: Application,
) => {
  if (!hasAnyPermissions(user)) return false;
  if (user.hasManagerPermissions) return true;
  if (data.status === ApplicationStatus.MANUAL_DRAFT) {
    return true;
  }
  const assignedToCurrentUser = data.assignedTo === user.email;
  if (data.status === ApplicationStatus.SUBMITTED && assignedToCurrentUser) {
    return true;
  }
  if (
    data.status === ApplicationStatus.AWAITING_REASSESSMENT &&
    assignedToCurrentUser
  ) {
    return true;
  }
  return false;
};

import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { HackneyGoogleUser } from '../domain/HackneyGoogleUser';
import { HackneyResident } from '../domain/HackneyResident';
import {
  HackneyGoogleUserWithPermissions,
  Permissions,
} from '../lib/utils/googleAuth';
import { generateJWTTokenTestData } from './jwtTokenHelper';

export const AUTHORISED_OFFICER_GROUP_TEST = 'authorized-officer-group';
export const AUTHORISED_MANAGER_GROUP_TEST = 'authorized-manager-group';
export const AUTHORISED_ADMIN_GROUP_TEST = 'authorized-admin-group';
export const AUTHORISED_READONLY_GROUP_TEST = 'authorized-readonly-group';
export const JWT_TEST_SECRET = 'secret';

const issuedAtInMilliseconds = new Date().getMilliseconds();

export enum UserRole {
  Officer,
  Manager,
  Admin,
  ReadOnly,
}

export const getGroupByRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.ReadOnly: {
      return AUTHORISED_READONLY_GROUP_TEST;
    }
    case UserRole.Officer: {
      return AUTHORISED_OFFICER_GROUP_TEST;
    }
    case UserRole.Manager: {
      return AUTHORISED_MANAGER_GROUP_TEST;
    }
    case UserRole.Admin: {
      return AUTHORISED_ADMIN_GROUP_TEST;
    }
    default:
      return '';
  }
};

export const getClaimsByRole = (role?: UserRole): Permissions => {
  const userPermissions: Permissions = {
    hasAdminPermissions: false,
    hasManagerPermissions: false,
    hasOfficerPermissions: false,
    hasReadOnlyPermissions: false,
  };

  switch (role) {
    case UserRole.ReadOnly: {
      userPermissions.hasReadOnlyPermissions = true;
      break;
    }
    case UserRole.Officer: {
      userPermissions.hasOfficerPermissions = true;
      break;
    }
    case UserRole.Manager: {
      userPermissions.hasManagerPermissions = true;
      break;
    }
    case UserRole.Admin: {
      userPermissions.hasAdminPermissions = true;
      break;
    }
    default:
      break;
  }

  return userPermissions;
};

export const generateHRUserWithPermissions = (
  role?: UserRole
): HackneyGoogleUserWithPermissions => {
  const userRole = role ? getGroupByRole(role) : '';

  return {
    ...generateJWTTokenTestData([userRole]),
    ...getClaimsByRole(role),
  };
};

type SignedTokenWithDetails = {
  signedToken: string;
  tokenData: HackneyGoogleUser;
};

export const generateSignedTokenByRole = (
  role?: UserRole
): SignedTokenWithDetails => {
  switch (role) {
    case UserRole.Admin:
    case UserRole.Manager:
    case UserRole.Officer:
    case UserRole.ReadOnly: {
      const tokenData = generateJWTTokenTestData(
        [getGroupByRole(role)],
        issuedAtInMilliseconds
      );
      const signedToken = jwt.sign(tokenData, JWT_TEST_SECRET);

      return {
        signedToken,
        tokenData,
      };
    }
    default: {
      const tokenData = generateJWTTokenTestData([], issuedAtInMilliseconds);
      const signedToken = jwt.sign(tokenData, JWT_TEST_SECRET);

      return {
        signedToken,
        tokenData,
      };
    }
  }
};

type SignedResidentTokenWithDetails = {
  signedToken: string;
  tokenData: HackneyResident;
};

export const generateSignedResidentToken = (
  applicationId?: string
): SignedResidentTokenWithDetails => {
  const id = applicationId || faker.string.uuid();
  const tokenData: HackneyResident = {
    application_id: id,
  };

  return {
    signedToken: jwt.sign(tokenData, JWT_TEST_SECRET),
    tokenData: {
      application_id: id,
    },
  };
};

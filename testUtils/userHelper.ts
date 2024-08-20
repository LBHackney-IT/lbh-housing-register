import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { HackneyGoogleUser } from '../domain/HackneyGoogleUser';
import { HackneyResident } from '../domain/HackneyResident';
import { HackneyGoogleUserWithPermissions } from '../lib/utils/googleAuth';
import { generateJWTTokenTestData } from './jwtTokenHelper';

export const AUTHORISED_OFFICER_GROUP_TEST = 'authorized-officer-group';
export const AUTHORISED_MANAGER_GROUP_TEST = 'authorized-manager-group';
export const AUTHORISED_ADMIN_GROUP_TEST = 'authorized-admin-group';
export const JWT_TEST_SECRET = 'secret';

const issuedAtInMilliseconds = new Date().getMilliseconds();

export enum UserRole {
  Officer,
  Manager,
  Admin,
}

interface UserClaims {
  hasAdminPermissions: boolean;
  hasManagerPermissions: boolean;
  hasOfficerPermissions: boolean;
}

export const getGroupByRole = (role: UserRole): string => {
  switch (role) {
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

export const getClaimsByRole = (role?: UserRole): UserClaims => {
  switch (role) {
    case UserRole.Officer: {
      return {
        hasAdminPermissions: false,
        hasManagerPermissions: false,
        hasOfficerPermissions: true,
      };
    }
    case UserRole.Manager: {
      return {
        hasAdminPermissions: false,
        hasManagerPermissions: true,
        hasOfficerPermissions: false,
      };
    }
    case UserRole.Admin: {
      return {
        hasAdminPermissions: true,
        hasManagerPermissions: false,
        hasOfficerPermissions: false,
      };
    }
    default:
      return {
        hasAdminPermissions: false,
        hasManagerPermissions: false,
        hasOfficerPermissions: false,
      };
  }
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
    case UserRole.Officer: {
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

/* eslint-disable import/no-duplicates */
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import { createRequest, createResponse } from 'node-mocks-http';

import { envVarsFixture } from '../../testUtils/envVarsHelper';
import { generateJWTTokenTestData } from '../../testUtils/jwtTokenHelper';
import {
  ApiRequest,
  ApiResponse,
  GetAuthTestResponse,
} from '../../testUtils/types';
import {
  AUTHORISED_ADMIN_GROUP_TEST,
  AUTHORISED_MANAGER_GROUP_TEST,
  AUTHORISED_OFFICER_GROUP_TEST,
  AUTHORISED_READONLY_GROUP_TEST,
  UserRole,
  generateHRUserWithPermissions,
  generateSignedTokenByRole,
  getClaimsByRole,
} from '../../testUtils/userHelper';
import {
  HackneyGoogleUserWithPermissions,
  Permissions,
  canViewSensitiveApplication,
  getAuth,
  getPermissions,
  getRedirect,
  getSession,
  hasAnyPermissions,
  hasReadOnlyPermissionOnly,
  hasUserGroup,
  removeHackneyToken,
} from './googleAuth';

const nonHRGroup = 'any-group';
const issuedAt = new Date().getMilliseconds();

describe('googleAuth', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSession', () => {
    describe('headers and cookies', () => {
      it('calls parse with the cookie from the headers when provided', () => {
        const req: ApiRequest = createRequest();
        const parseSpy = jest.spyOn(cookie, 'parse');
        const newReq = {
          ...req,
          headers: {
            ...req.headers,
            cookie: 'abc123',
          },
        };

        getSession(newReq);

        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(parseSpy).toHaveBeenCalledWith(newReq.headers.cookie);
      });

      it('calls parse with empty string when cookie is not provided in the header', () => {
        const req: ApiRequest = createRequest();
        const parseSpy = jest.spyOn(cookie, 'parse');

        getSession(req);

        expect(parseSpy).toHaveBeenCalledTimes(1);
        expect(parseSpy).toHaveBeenCalledWith('');
      });

      it('throws when request not provided', () => {
        const expectedErrorMessage =
          "Cannot read properties of undefined (reading 'headers')";
        expect(getSession).toThrow(expectedErrorMessage);
      });

      it('returns undefined when cookie is not provided', () => {
        const req: ApiRequest = createRequest();
        const response = getSession(req);
        expect(response).toBeUndefined();
      });

      it("returns undefined when cookie is provided but it's not hackneyToken", () => {
        const req: ApiRequest = createRequest();

        const newReq = {
          ...req,
          headers: {
            ...req.headers,
            cookie: 'someToken=123',
          },
        };

        const response = getSession(newReq);
        expect(response).toBeUndefined();
      });
    });

    describe('token verification', () => {
      const secretFixture = envVarsFixture('HACKNEY_JWT_SECRET');
      const skipTokenVerifyFixture = envVarsFixture('SKIP_VERIFY_TOKEN');
      const req: ApiRequest = createRequest();
      const parsedToken = 'abc123';
      const tokenSecret = 'secret';
      const verifyFunctionName = 'verify';
      const decodeFunctionName = 'decode';

      const newReq = {
        ...req,
        headers: {
          ...req.headers,

          cookie: `hackneyToken=${parsedToken}`,
        },
      };

      beforeEach(() => {
        secretFixture.mock(tokenSecret);
      });

      afterEach(() => {
        secretFixture.restore();
        skipTokenVerifyFixture.restore();
      });

      it('returns undefined when cookie parse throws JsonWebTokenError', () => {
        jest.spyOn(cookie, 'parse').mockImplementationOnce(() => {
          throw new jwt.JsonWebTokenError('token parse error');
        });

        expect(getSession(newReq)).toBeUndefined();
      });

      it('verifies token when SKIP_VERIFY_TOKEN is not set', () => {
        skipTokenVerifyFixture.delete();

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getSession(newReq);

        expect(verifySpy).toHaveBeenCalledTimes(1);
        expect(verifySpy).toHaveBeenCalledWith(parsedToken, tokenSecret);
        expect(decodeSpy).toHaveBeenCalledTimes(0);
      });

      it('verifies token when SKIP_VERIFY_TOKEN is set to false', () => {
        skipTokenVerifyFixture.mock('false');

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getSession(newReq);

        expect(verifySpy).toHaveBeenCalledTimes(1);
        expect(verifySpy).toHaveBeenCalledWith(parsedToken, tokenSecret);
        expect(decodeSpy).toHaveBeenCalledTimes(0);
      });

      it('does not verify token when SKIP_VERIFY_TOKEN is set to true', () => {
        skipTokenVerifyFixture.mock('true');

        const verifySpy = jest.spyOn(jsonwebtoken, verifyFunctionName);
        const decodeSpy = jest.spyOn(jsonwebtoken, decodeFunctionName);

        getSession(newReq);

        expect(decodeSpy).toHaveBeenCalledTimes(1);
        expect(decodeSpy).toHaveBeenCalledWith(parsedToken);
        expect(verifySpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('Authorization groups', () => {
      const skipVerifyToken = 'true';
      const jwtSecret = 'secret';

      const skipTokenFixture = envVarsFixture('SKIP_VERIFY_TOKEN');
      const secretFixture = envVarsFixture('HACKNEY_JWT_SECRET');
      const adminGroupFixture = envVarsFixture('AUTHORISED_ADMIN_GROUP');
      const managerGroupFixture = envVarsFixture('AUTHORISED_MANAGER_GROUP');
      const officerGroupFixture = envVarsFixture('AUTHORISED_OFFICER_GROUP');

      //set default environment variables
      beforeEach(() => {
        skipTokenFixture.mock(skipVerifyToken);
        secretFixture.mock(jwtSecret);
        adminGroupFixture.mock(AUTHORISED_ADMIN_GROUP_TEST);
        managerGroupFixture.mock(AUTHORISED_MANAGER_GROUP_TEST);
        officerGroupFixture.mock(AUTHORISED_OFFICER_GROUP_TEST);
      });

      //restore default environment variables
      afterEach(() => {
        secretFixture.restore();
        skipTokenFixture.restore();
        adminGroupFixture.restore();
        managerGroupFixture.restore();
        officerGroupFixture.restore();
      });

      const req: ApiRequest = createRequest();

      it('returns correct session details when valid hackney cookie provided', () => {
        const { signedToken, tokenData } = generateSignedTokenByRole();

        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `hackneyToken=${signedToken}`,
          },
        };

        const session = getSession(newReq);
        const expectedSession: HackneyGoogleUserWithPermissions = {
          ...tokenData,
          ...getClaimsByRole(),
        };
        expect(session).toStrictEqual(expectedSession);
      });

      it('returns matching authorization groups for admin claims', () => {
        const { signedToken, tokenData } = generateSignedTokenByRole(
          UserRole.Admin
        );

        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `hackneyToken=${signedToken}`,
          },
        };

        const session = getSession(newReq);
        const expectedSession: HackneyGoogleUserWithPermissions = {
          ...tokenData,
          ...getClaimsByRole(UserRole.Admin),
        };
        expect(session).toStrictEqual(expectedSession);
      });

      it('returns matching authorization groups for manager claims', () => {
        const { signedToken, tokenData } = generateSignedTokenByRole(
          UserRole.Manager
        );

        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `hackneyToken=${signedToken}`,
          },
        };

        const session = getSession(newReq);
        const expectedSession: HackneyGoogleUserWithPermissions = {
          ...tokenData,
          ...getClaimsByRole(UserRole.Manager),
        };
        expect(session).toEqual(expectedSession);
      });

      it('returns matching authorization groups for officer claims', () => {
        const { signedToken, tokenData } = generateSignedTokenByRole(
          UserRole.Officer
        );

        const newReq = {
          ...req,
          headers: {
            ...req.headers,

            cookie: `hackneyToken=${signedToken}`,
          },
        };

        const session = getSession(newReq);
        const expectedSession: HackneyGoogleUserWithPermissions = {
          ...tokenData,
          ...getClaimsByRole(UserRole.Officer),
        };
        expect(session).toEqual(expectedSession);
      });
    });
  });

  describe('removeHackneyToken', () => {
    it('sets correct Set-Cookie header', () => {
      const expectedCookieHeader =
        'hackneyToken=; Max-Age=-1; Domain=.hackney.gov.uk; Path=/';
      const res: ApiResponse = createResponse();

      removeHackneyToken(res);

      const newCookieHeader = res.getHeader('Set-Cookie');
      expect(newCookieHeader).toBe(expectedCookieHeader);
    });
  });

  describe('getPermissions', () => {
    it("returns permissions based on user's group claims", () => {
      const adminGroupFixture = envVarsFixture('AUTHORISED_ADMIN_GROUP');
      const managerGroupFixture = envVarsFixture('AUTHORISED_MANAGER_GROUP');
      const officerGroupFixture = envVarsFixture('AUTHORISED_OFFICER_GROUP');
      const readOnlyGroupFixture = envVarsFixture('AUTHORISED_READONLY_GROUP');
      adminGroupFixture.mock(AUTHORISED_ADMIN_GROUP_TEST);
      managerGroupFixture.mock(AUTHORISED_MANAGER_GROUP_TEST);
      officerGroupFixture.mock(AUTHORISED_OFFICER_GROUP_TEST);
      readOnlyGroupFixture.mock(AUTHORISED_READONLY_GROUP_TEST);

      const groupClaims = [
        AUTHORISED_ADMIN_GROUP_TEST,
        AUTHORISED_MANAGER_GROUP_TEST,
        AUTHORISED_OFFICER_GROUP_TEST,
        AUTHORISED_READONLY_GROUP_TEST,
      ];

      const user = generateJWTTokenTestData(groupClaims, issuedAt);

      const expectedPermissions: Permissions = {
        hasAdminPermissions: true,
        hasManagerPermissions: true,
        hasOfficerPermissions: true,
        hasReadOnlyPermissions: true,
      };

      expect(getPermissions(user)).toStrictEqual(expectedPermissions);
    });
  });

  describe('hasUserGroup', () => {
    it('returns true when user is in the given group', () => {
      const groupToCheck = AUTHORISED_ADMIN_GROUP_TEST;
      const user = generateJWTTokenTestData(
        [AUTHORISED_ADMIN_GROUP_TEST],
        issuedAt
      );
      expect(hasUserGroup(groupToCheck, user)).toBeTruthy();
    });

    it('returns false when user is not in the given group', () => {
      const groupToCheck = AUTHORISED_ADMIN_GROUP_TEST;
      const user = generateJWTTokenTestData([nonHRGroup], issuedAt);
      expect(hasUserGroup(groupToCheck, user)).toBeFalsy();
    });
  });

  describe('hasAnyPermissions', () => {
    it('returns true when user has read only permissions', () => {
      const tokenData = generateJWTTokenTestData();
      const user: HackneyGoogleUserWithPermissions = {
        ...tokenData,
        ...getClaimsByRole(UserRole.ReadOnly),
      };
      expect(hasAnyPermissions(user)).toBeTruthy();
    });

    it('returns true when user has officer permissions', () => {
      const tokenData = generateJWTTokenTestData();
      const user: HackneyGoogleUserWithPermissions = {
        ...tokenData,
        ...getClaimsByRole(UserRole.Officer),
      };
      expect(hasAnyPermissions(user)).toBeTruthy();
    });

    it('returns true when user has manager permissions', () => {
      const tokenData = generateJWTTokenTestData();
      const user: HackneyGoogleUserWithPermissions = {
        ...tokenData,
        ...getClaimsByRole(UserRole.Manager),
      };
      expect(hasAnyPermissions(user)).toBeTruthy();
    });

    it('returns true when user has admin permissions', () => {
      const tokenData = generateJWTTokenTestData();
      const user: HackneyGoogleUserWithPermissions = {
        ...tokenData,
        ...getClaimsByRole(UserRole.Admin),
      };
      expect(hasAnyPermissions(user)).toBeTruthy();
    });

    it('returns false when user has no officer, manager or admin permissions', () => {
      const tokenData = generateJWTTokenTestData();
      const user: HackneyGoogleUserWithPermissions = {
        ...tokenData,
        ...getClaimsByRole(),
      };
      expect(hasAnyPermissions(user)).toBeFalsy();
    });
  });

  describe('canViewSensitiveApplication', () => {
    it('returns true when user has admin permissions', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.Admin
      );
      expect(canViewSensitiveApplication('', user)).toBeTruthy();
    });

    it('returns true when user has manager permissions', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.Manager
      );
      expect(canViewSensitiveApplication('', user)).toBeTruthy();
    });

    it('returns false when user has officer permissions', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.Officer
      );
      expect(canViewSensitiveApplication('', user)).toBeFalsy();
    });

    it('returns false when user has read only permissions', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.ReadOnly
      );
      expect(canViewSensitiveApplication('', user)).toBeFalsy();
    });

    it('returns true when user has officer permissions and the application is assigned to them', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.Officer
      );
      expect(canViewSensitiveApplication(user.email, user)).toBeTruthy();
    });
  });

  describe('getRedirect', () => {
    it('returns /login when user is not provided', () => {
      const expectedResponse = '/login';
      expect(getRedirect()).toBe(expectedResponse);
    });

    it("returns /access-denied when user is provided but they don't have any HR permissions", () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions();

      const expectedResponse = '/access-denied';
      expect(getRedirect(user)).toBe(expectedResponse);
    });

    it('returns /access-denied when user is provided but they only have read only HR permissions', () => {
      const user: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.ReadOnly
      );
      const expectedResponse = '/access-denied';
      expect(getRedirect(user, true)).toBe(expectedResponse);
    });

    it('returns undefined when user is provided and has HR permissions', () => {
      const officer: HackneyGoogleUserWithPermissions = generateHRUserWithPermissions(
        UserRole.Officer
      );
      expect(getRedirect(officer)).toBeUndefined();
    });
  });

  describe('getAuth', () => {
    it('returns correct login Redirect object when user is not provided', () => {
      const expectedResponse: GetAuthTestResponse = {
        redirect: {
          statusCode: 302,
          destination: '/login',
        },
      };
      expect(getAuth('')).toStrictEqual(expectedResponse);
    });

    it('returns correct access denied Redirect object when user is not in the correct group', () => {
      const expectedResponse: GetAuthTestResponse = {
        redirect: {
          statusCode: 302,
          destination: '/access-denied',
        },
      };

      const tokenData = generateJWTTokenTestData(['user-group']);

      expect(getAuth('required-group', tokenData)).toStrictEqual(
        expectedResponse
      );
    });

    it('returns user when provided and they have access to a given group', () => {
      const requiredGroup = 'user-group';
      const user = generateJWTTokenTestData([requiredGroup]);
      const expectedResponse = { user };

      expect(getAuth(requiredGroup, user)).toStrictEqual(expectedResponse);
    });
  });

  describe('hasReadOnlyPermissionOnly', () => {
    it('return false when user has admin permissions', () => {
      const user = generateHRUserWithPermissions(UserRole.Admin);
      expect(hasReadOnlyPermissionOnly(user)).toBeFalsy();
    });

    it('return false when user has admin permissions and readOnly', () => {
      const user = generateHRUserWithPermissions(UserRole.Admin);
      const userWithReadOnlyAdded = {
        ...user,
        hasReadOnlyPermissions: true,
      };
      expect(hasReadOnlyPermissionOnly(userWithReadOnlyAdded)).toBeFalsy();
    });

    it('return false when user has manager permissions', () => {
      const user = generateHRUserWithPermissions(UserRole.Manager);
      expect(hasReadOnlyPermissionOnly(user)).toBeFalsy();
    });

    it('return false when user has manager permissions and readOnly', () => {
      const user = generateHRUserWithPermissions(UserRole.Manager);
      const userWithReadOnlyAdded = {
        ...user,
        hasReadOnlyPermissions: true,
      };
      expect(hasReadOnlyPermissionOnly(userWithReadOnlyAdded)).toBeFalsy();
    });

    it('return false when user has officer permissions', () => {
      const user = generateHRUserWithPermissions(UserRole.Officer);
      expect(hasReadOnlyPermissionOnly(user)).toBeFalsy();
    });

    it('return false when user has officer permissions and readOnly', () => {
      const user = generateHRUserWithPermissions(UserRole.Officer);
      const userWithReadOnlyAdded = {
        ...user,
        hasReadOnlyPermissions: true,
      };
      expect(hasReadOnlyPermissionOnly(userWithReadOnlyAdded)).toBeFalsy();
    });

    it('return false when user has all permissions', () => {
      const user = generateHRUserWithPermissions(UserRole.Officer);
      const userWithReadOnlyAdded = {
        ...user,
        hasReadOnlyPermissions: true,
        hasAdminPermissions: true,
        hasManagerPermissions: true,
      };
      expect(hasReadOnlyPermissionOnly(userWithReadOnlyAdded)).toBeFalsy();
    });

    it('return true when user has read only permissions', () => {
      const user = generateHRUserWithPermissions(UserRole.ReadOnly);
      expect(hasReadOnlyPermissionOnly(user)).toBeTruthy();
    });
  });
});

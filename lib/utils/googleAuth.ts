import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { Redirect } from 'next';

import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

export type Permissions = {
  hasAdminPermissions: boolean;
  hasManagerPermissions: boolean;
  hasOfficerPermissions: boolean;
  hasReadOnlyPermissions: boolean;
};

export type HackneyGoogleUserWithPermissions = HackneyGoogleUser & Permissions;

export const hasUserGroup = (
  group: string,
  user: HackneyGoogleUser
): boolean => {
  return user.groups.includes(group);
};

export const getPermissions = (user: HackneyGoogleUser): Permissions => {
  const {
    AUTHORISED_ADMIN_GROUP,
    AUTHORISED_MANAGER_GROUP,
    AUTHORISED_OFFICER_GROUP,
    AUTHORISED_READONLY_GROUP,
  } = process.env;

  return {
    hasAdminPermissions: hasUserGroup(AUTHORISED_ADMIN_GROUP as string, user),
    hasManagerPermissions: hasUserGroup(
      AUTHORISED_MANAGER_GROUP as string,
      user
    ),
    hasOfficerPermissions: hasUserGroup(
      AUTHORISED_OFFICER_GROUP as string,
      user
    ),
    hasReadOnlyPermissions: hasUserGroup(
      AUTHORISED_READONLY_GROUP as string,
      user
    ),
  };
};
export function getSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
): HackneyGoogleUserWithPermissions | undefined {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const parsedToken = cookies.hackneyToken;

    if (!parsedToken) return;

    const secret = process.env.HACKNEY_JWT_SECRET as string;
    const user = (process.env.SKIP_VERIFY_TOKEN !== 'true'
      ? jsonwebtoken.verify(parsedToken, secret)
      : jsonwebtoken.decode(parsedToken)) as HackneyGoogleUser | undefined;

    if (user) {
      return {
        ...user,
        ...getPermissions(user),
      };
    }
    return undefined;
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return undefined;
    }

    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeHackneyToken = (res: any): void => {
  const jwtCookie = cookie.serialize('hackneyToken', '', {
    maxAge: -1,
    domain: '.hackney.gov.uk',
    path: '/',
  });

  res.setHeader('Set-Cookie', jwtCookie);
};

export const hasAnyPermissions = (
  user: HackneyGoogleUserWithPermissions
): boolean => {
  return (
    user.hasAdminPermissions ||
    user.hasManagerPermissions ||
    user.hasOfficerPermissions ||
    user.hasReadOnlyPermissions
  );
};

export const canViewSensitiveApplication = (
  assignedTo: string,
  user: HackneyGoogleUserWithPermissions
): boolean => {
  if (user.hasAdminPermissions || user.hasManagerPermissions) {
    // can see everything
    return true;
  }
  // check assigned
  return user.hasOfficerPermissions && assignedTo === user.email;
};

export const canViewWorktray = (
  user: HackneyGoogleUserWithPermissions
): boolean => {
  // is not part of the read only group
  if (
    user.hasAdminPermissions ||
    user.hasManagerPermissions ||
    user.hasOfficerPermissions
  ) {
    return true;
  }
  return false;
};

export const getRedirect = (
  user?: HackneyGoogleUserWithPermissions
): string | undefined => {
  if (!user) {
    return '/login';
  }
  if (!hasAnyPermissions(user)) {
    return '/access-denied';
  }
};

export function getAuth(
  group: string,
  user?: HackneyGoogleUser
): { redirect: Redirect } | { user: HackneyGoogleUser } {
  if (!user) {
    return { redirect: { statusCode: 302, destination: '/login' } };
  }
  if (!hasUserGroup(group, user)) {
    return { redirect: { statusCode: 302, destination: '/access-denied' } };
  }
  return { user };
}

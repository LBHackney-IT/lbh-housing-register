import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { Redirect } from 'next';

import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

type Permissions = {
  hasAdminPermissions: boolean;
  hasManagerPermissions: boolean;
  hasOfficerPermissions: boolean;
};

export type HackneyGoogleUserWithPermissions = HackneyGoogleUser & Permissions;

export function getSession(
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

export const removeHackneyToken = (res: any): void => {
  const jwtCookie = cookie.serialize('hackneyToken', '', {
    maxAge: -1,
    domain: '.hackney.gov.uk',
    path: '/',
  });

  res.setHeader('Set-Cookie', jwtCookie);
};

export const getPermissions = (user: HackneyGoogleUser): Permissions => {
  const {
    AUTHORISED_ADMIN_GROUP,
    AUTHORISED_MANAGER_GROUP,
    AUTHORISED_OFFICER_GROUP,
  } = process.env;

  return {
    hasAdminPermissions: hasUserGroup(AUTHORISED_ADMIN_GROUP!, user),
    hasManagerPermissions: hasUserGroup(AUTHORISED_MANAGER_GROUP!, user),
    hasOfficerPermissions: hasUserGroup(AUTHORISED_OFFICER_GROUP!, user),
  };
};

export const hasUserGroup = (
  group: string,
  user: HackneyGoogleUser
): boolean => {
  return user.groups.includes(group);
};

export const hasAnyPermissions = (
  user: HackneyGoogleUserWithPermissions
): boolean => {
  return (
    user.hasAdminPermissions ||
    user.hasManagerPermissions ||
    user.hasOfficerPermissions
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

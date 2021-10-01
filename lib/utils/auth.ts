import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

type Permissions = {
  hasAnyPermissions: boolean;
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
    const parsedToken = cookies['hackneyToken'];

    if (!parsedToken) return;

    var secret = process.env.HACKNEY_JWT_SECRET as string;
    const user = (
      process.env.SKIP_VERIFY_TOKEN !== 'true'
        ? jsonwebtoken.verify(parsedToken, secret)
        : jsonwebtoken.decode(parsedToken)
    ) as HackneyGoogleUser | undefined;

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

export const signOut = (): void => {
  // TODO: clear cookie
};

export const getPermissions = (user: HackneyGoogleUser): Permissions => {
  const {
    AUTHORISED_ADMIN_GROUP,
    AUTHORISED_MANAGER_GROUP,
    AUTHORISED_OFFICER_GROUP,
  } = process.env;

  return {
    hasAnyPermissions: user.groups.length > 0,
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

export const getRedirect = (
  user?: HackneyGoogleUser & { hasAnyPermissions: boolean }
): string | undefined => {
  if (!user) {
    return '/login';
  }
  if (!user.hasAnyPermissions) {
    return '/access-denied';
  }
};

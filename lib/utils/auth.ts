import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

export function getSession(req: any) {
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
      setPermissions(user);
    }
    return user;
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return;
    }

    throw err;
  }
}

export const signOut = (): void => {
  // TODO: clear cookie
};

export const setPermissions = (user: HackneyGoogleUser): HackneyGoogleUser => {
  const {
    AUTHORISED_ADMIN_GROUP,
    AUTHORISED_MANAGER_GROUP,
    AUTHORISED_OFFICER_GROUP,
  } = process.env;

  user.hasAnyPermissions = user.groups.length > 0;
  user.hasAdminPermissions = hasUserGroup(
    AUTHORISED_ADMIN_GROUP as string,
    user
  );
  user.hasManagerPermissions = hasUserGroup(
    AUTHORISED_MANAGER_GROUP as string,
    user
  );
  user.hasOfficerPermissions = hasUserGroup(
    AUTHORISED_OFFICER_GROUP as string,
    user
  );
  return user;
};

export const hasUserGroup = (
  group: string,
  user: HackneyGoogleUser
): boolean => {
  return user?.groups?.includes(group);
};

export const getRedirect = (user?: HackneyGoogleUser): string | undefined => {
  if (!user) {
    return '/login';
  }
  if (!user.hasAnyPermissions) {
    return '/access-denied';
  }
};

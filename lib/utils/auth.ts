import { IncomingMessage } from 'http';
import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { Redirect } from 'next';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

export function getSession(req: IncomingMessage) {
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
  window.location.href = '/login';
};

export const hasUserGroup = (
  group: string,
  user: HackneyGoogleUser
): boolean => {
  return user?.groups?.includes(group);
};

export const getRedirect = (
  group: string,
  user?: HackneyGoogleUser
): string | undefined => {
  if (!user) {
    return '/login';
  }
  if (!hasUserGroup(group, user)) {
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

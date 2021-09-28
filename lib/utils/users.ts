import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { HackneyResident } from '../../domain/HackneyResident';

export function getUser(req: any) {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const parsedToken = cookies['housing_user'];

    if (!parsedToken) return;

    var secret = process.env.HACKNEY_JWT_SECRET as string;
    const user = (
      process.env.SKIP_VERIFY_TOKEN !== 'true'
        ? jsonwebtoken.verify(parsedToken, secret)
        : jsonwebtoken.decode(parsedToken)
    ) as HackneyResident | undefined;

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
  window.location.href = '/';
};

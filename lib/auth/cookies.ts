import * as cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const sessionCookiePattern =
  /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/;

export function clearStaffSessionCookies(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const requestCookies = cookie.parse(req.headers.cookie ?? '');
  const names = new Set([
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    ...Object.keys(requestCookies).filter((name) =>
      sessionCookiePattern.test(name),
    ),
  ]);

  res.setHeader(
    'Set-Cookie',
    [...names].map((name) =>
      cookie.serialize(name, '', {
        expires: new Date(0),
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure:
          name.startsWith('__Secure-') ||
          process.env.NEXTAUTH_URL?.startsWith('https://') === true,
      }),
    ),
  );
}

import * as cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { HackneyResident } from '../../domain/HackneyResident';
import { VerifyAuthResponse } from '../../domain/HousingApi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUser(req: any) {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const parsedToken = cookies['housing_user'];

    if (!parsedToken) return;

    const secret = process.env.HACKNEY_JWT_SECRET as string;
    const user = (
      process.env.SKIP_VERIFY_TOKEN === 'true'
        ? jsonwebtoken.decode(parsedToken)
        : jsonwebtoken.verify(parsedToken, secret)
    ) as HackneyResident | undefined;

    return user;
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return;
    }

    throw err;
  }
}

function residentCookieOptions(
  extras: cookie.SerializeOptions = {},
): cookie.SerializeOptions {
  const origin = process.env.NEXTAUTH_URL;
  let hostname: string | undefined;
  try {
    hostname = origin ? new URL(origin).hostname : undefined;
  } catch {
    hostname = undefined;
  }

  const isHackneyHost =
    hostname === 'hackney.gov.uk' || hostname?.endsWith('.hackney.gov.uk');

  return {
    path: '/',
    ...(isHackneyHost ? { domain: '.hackney.gov.uk' } : {}),
    ...extras,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setAuthCookie = (res: any, data: VerifyAuthResponse): void => {
  const jwtCookie = cookie.serialize(
    'housing_user',
    data.accessToken,
    residentCookieOptions(),
  );

  res.setHeader('Set-Cookie', jwtCookie);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeAuthCookie = (res: any): void => {
  const jwtCookie = cookie.serialize(
    'housing_user',
    '',
    residentCookieOptions({ expires: new Date(0) }),
  );

  res.setHeader('Set-Cookie', jwtCookie);
};

import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { HackneyResident } from '../../domain/HackneyResident';
import { VerifyAuthResponse } from '../../domain/HousingApi';

export function getUser(req: NextApiRequest) {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const parsedToken = cookies['housing_user'];

    if (!parsedToken) return;

    const secret = process.env.HACKNEY_JWT_SECRET as string;
    const user = (process.env.SKIP_VERIFY_TOKEN !== 'true'
      ? jsonwebtoken.verify(parsedToken, secret)
      : jsonwebtoken.decode(parsedToken)) as HackneyResident | undefined;

    return user;
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return;
    }

    throw err;
  }
}

export const setAuthCookie = (
  res: NextApiResponse,
  data: VerifyAuthResponse
): void => {
  const jwtCookie = cookie.serialize('housing_user', data.accessToken, {
    domain: '.hackney.gov.uk',
    path: '/',
  });

  res.setHeader('Set-Cookie', jwtCookie);
};

export const removeAuthCookie = (res: NextApiResponse): void => {
  const jwtCookie = cookie.serialize('housing_user', '', {
    expires: new Date(0),
    domain: '.hackney.gov.uk',
    path: '/',
  });

  res.setHeader('Set-Cookie', jwtCookie);
};

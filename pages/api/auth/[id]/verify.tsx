import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { confirmVerifyCode } from '../../../../lib/gateways/applications-api';
import cookie from 'cookie';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        const request = JSON.parse(req.body);
        const id = req.query.id as string;
        const data = await confirmVerifyCode(id, request);

        // set cookie with access token (JWT)
        if (data) {
          const jwtCookie = cookie.serialize(
            'housing_user',
            data.accessToken,
            {
              maxAge: (7 * 24 * 60 * 60),
              domain: '.hackney.gov.uk',
              path: '/',
            }
          );

          res.setHeader('Set-Cookie', jwtCookie);
        }

        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to confirm verify code' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;

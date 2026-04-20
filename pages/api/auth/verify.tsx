import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { VerifyAuthRequest } from '../../../domain/HousingApi';
import { confirmVerifyCode } from '../../../lib/gateways/applications-api';
import { parseApiJsonBody } from '../../../lib/utils/parseApiJsonBody';
import { setAuthCookie } from '../../../lib/utils/users';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case 'POST':
      try {
        const request = parseApiJsonBody<VerifyAuthRequest>(req);
        const data = await confirmVerifyCode(request);

        // set cookie with access token (JWT)
        if (data) {
          setAuthCookie(res, data);
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

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/verify');

import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { VerifyAuthRequest } from '../../../domain/HousingApi';
import { confirmVerifyCode } from '../../../lib/gateways/applications-api';
import { setAuthCookie } from '../../../lib/utils/users';

function parseVerifyBody(req: NextApiRequest): VerifyAuthRequest | null {
  try {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body) as VerifyAuthRequest;
    } else if (req.body && typeof req.body === 'object') {
      return req.body as VerifyAuthRequest;
    }
    return null;
  } catch {
    return null;
  }
}

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case 'POST':
      try {
        const request = parseVerifyBody(req);
        if (!request) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Unable to parse request' });
          return;
        }

        const data = await confirmVerifyCode(request);

        // set cookie with access token (JWT)
        if (data) {
          setAuthCookie(res, data);
        }

        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status) {
          res
            .status(error.response.status)
            .json({ message: 'Unable to confirm verify code' });
          return;
        }

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

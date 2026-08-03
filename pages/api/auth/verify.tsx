import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { VerifyAuthRequest } from '../../../domain/HousingApi';
import { confirmVerifyCode } from '../../../lib/gateways/applications-api';
import {
  INVALID_AUTH_EMAIL_MESSAGE,
  isValidAuthEmail,
} from '../../../lib/utils/auth-email-validator';
import { setAuthCookie } from '../../../lib/utils/users';

function parseVerifyBody(req: NextApiRequest): VerifyAuthRequest | null {
  try {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body) as VerifyAuthRequest;
    } else if (Buffer.isBuffer(req.body)) {
      // The body can arrive as a Buffer even when the client sets
      // Content-Type header to application/json, so normalise here.
      return JSON.parse(req.body.toString('utf8')) as VerifyAuthRequest;
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

        // Fail here on missing fields so we don't trigger a backend 500
        if (
          typeof request.email !== 'string' ||
          request.email.trim() === '' ||
          typeof request.code !== 'string' ||
          request.code.trim() === ''
        ) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Email and code are required' });
          return;
        }

        if (!isValidAuthEmail(request.email)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: INVALID_AUTH_EMAIL_MESSAGE });
          return;
        }

        const verifyRequest: VerifyAuthRequest = {
          email: request.email.trim(),
          code: request.code.trim(),
        };

        const data = await confirmVerifyCode(verifyRequest);

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
        .setHeader('Allow', 'POST')
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: 'Method not allowed' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/verify');

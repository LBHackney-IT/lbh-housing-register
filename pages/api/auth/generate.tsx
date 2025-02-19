import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { createVerifyCode } from '../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let request;

  switch (req.method) {
    case 'POST':
      try {
        request = JSON.parse(req.body);
      } catch {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Unable to parse request' });
        break;
      }

      try {
        const data = await createVerifyCode(request);
        res.status(StatusCodes.OK).json(data);
      } catch {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to create verify code' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/generate');

import { StatusCodes } from 'http-status-codes';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { removeAuthCookie } from '../../../lib/utils/users';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        removeAuthCookie(res);

        res
          .status(StatusCodes.OK)
          .json({ message: 'Application form sign out' });
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to sign out' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/exit');

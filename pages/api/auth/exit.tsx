import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';

import { removeAuthCookie } from '../../../lib/utils/users';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        await removeAuthCookie(res);

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

export default withSentry(endpoint);

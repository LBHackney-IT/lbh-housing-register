import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';

import { getSession, removeHackneyToken } from '../../../lib/utils/googleAuth';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const isAdminUser = !!getSession(req);

  switch (req.method) {
    case 'GET':
      try {
        if (isAdminUser) {
          await removeHackneyToken(res);
        }

        res.status(StatusCodes.OK).json({ message: 'Admin sign out' });
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to sign out' });
      }
      break;
  }
};

export default withSentry(endpoint);

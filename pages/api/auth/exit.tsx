import { StatusCodes } from 'http-status-codes';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { removeAuthCookie } from '../../../lib/utils/users';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    res
      .setHeader('Allow', 'POST')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  try {
    removeAuthCookie(res);

    res.status(StatusCodes.OK).json({ message: 'Application form sign out' });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to sign out' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/exit');

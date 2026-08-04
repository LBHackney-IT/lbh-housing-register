import { StatusCodes } from 'http-status-codes';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { removeHackneyToken, getSession } from '../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'GET') {
    res
      .setHeader('Allow', 'GET')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  const isAdminUser = !!getSession(req);

  try {
    if (isAdminUser) {
      removeHackneyToken(res);
    }

    res.status(StatusCodes.OK).json({ message: 'Admin sign out' });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to sign out' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/admin/logout');

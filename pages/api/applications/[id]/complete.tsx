import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { completeApplication } from '../../../../lib/gateways/applications-api';
import { getApplicationAccess } from '../../../../lib/utils/requestAuth';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'PATCH') {
    res
      .setHeader('Allow', 'PATCH')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  try {
    const id = req.query.id as string;

    const access = await getApplicationAccess(req, id);
    if (access === 'allowed') {
      const data = await completeApplication(id, req);
      res.status(StatusCodes.OK).json(data);
    } else {
      res
        .status(
          access === 'unauthenticated'
            ? StatusCodes.UNAUTHORIZED
            : StatusCodes.FORBIDDEN,
        )
        .json({
          message:
            access === 'unauthenticated' ? 'Unauthorized' : 'Access denied',
        });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Unable to update application' });
    }
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/applications/[id]/complete',
);

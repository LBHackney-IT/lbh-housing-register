import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { completeApplication } from '../../../../lib/gateways/applications-api';
import { canUpdateApplication } from '../../../../lib/utils/requestAuth';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case 'PATCH':
      try {
        const id = req.query.id as string;

        if (canUpdateApplication(req, id)) {
          const data = await completeApplication(id, req);
          res.status(StatusCodes.OK).json(data);
        } else {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Unable to update application' });
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
      break;

    default:
      res
        .setHeader('Allow', 'PATCH')
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: 'Method not allowed' });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/applications/[id]/complete',
);

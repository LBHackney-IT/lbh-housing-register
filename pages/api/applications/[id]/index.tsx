/*  eslint-disable @typescript-eslint/no-unused-vars */
/*  eslint-disable @typescript-eslint/no-explicit-any */
// disable unused AxiosError and usage of any until reconfiguration/refactor
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { updateApplication } from '../../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../../lib/utils/hasStaffPermissions';
import { isStaffAction } from '../../../../lib/utils/isStaffAction';
import { canUpdateApplication } from '../../../../lib/utils/requestAuth';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'PATCH':
      try {
        const application = JSON.parse(req.body);
        const id = req.query.id as string;
        if (
          canUpdateApplication(req, id) ||
          (isStaffAction(application) &&
            hasStaffPermissions(req) &&
            !hasReadOnlyStaffPermissions(req))
        ) {
          const data = await updateApplication(application, id, req);
          res.status(StatusCodes.OK).json(data);
        } else {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Unable to update application' });
        }
      } catch (error: any | AxiosError) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // Request made and server responded
            res.status(error.response.status).json(error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Unable to update application' });
        }
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/applications/[id]');

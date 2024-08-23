import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../domain/HousingApi';
import {
  addApplication,
  getApplication,
} from '../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../lib/utils/hasStaffPermissions';
import { isStaffAction } from '../../../lib/utils/isStaffAction';
import { getUser } from '../../../lib/utils/users';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET': {
      try {
        const user = getUser(req);
        const id = user?.application_id;
        if (id) {
          const data = await getApplication(id);
          res.status(StatusCodes.OK).json(data);
        } else {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Unable to get application' });
        }
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to get application' });
      }

      break;
    }
    case 'POST':
      try {
        const application: Application = JSON.parse(req.body);
        if (
          isStaffAction(application) &&
          (!hasStaffPermissions(req) || hasReadOnlyStaffPermissions(req))
        ) {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Unable to add application with assessment' });
        } else {
          const data = await addApplication(application);
          res.status(StatusCodes.OK).json(data);
        }
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to add application' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default withSentry(endpoint);

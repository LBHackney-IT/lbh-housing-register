import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../domain/HousingApi';
import { requireApiStaff } from '../../../lib/auth/api';
import {
  addApplication,
  getApplication,
} from '../../../lib/gateways/applications-api';
import { hasReadOnlyPermissionOnly } from '../../../lib/auth/staff';
import { isStaffAction } from '../../../lib/utils/isStaffAction';
import { getUser } from '../../../lib/utils/users';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
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
            .status(user ? StatusCodes.FORBIDDEN : StatusCodes.UNAUTHORIZED)
            .json({
              message: user ? 'Unable to get application' : 'Unauthorized',
            });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status) {
          res
            .status(error.response.status)
            .json({ message: 'Unable to get application' });
          return;
        }
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to get application' });
      }

      break;
    }
    case 'POST': {
      // Staff-write-only (add-case). Parse first so isStaffAction can pick a
      // more specific 403 message when the body includes privileged fields;
      // it is not a second auth gate.
      let application: Application;
      try {
        application = JSON.parse(req.body);
      } catch (error) {
        console.error('Unable to parse application request body', error);
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Unable to parse request' });
        break;
      }

      const staff = await requireApiStaff(req, res);
      if (!staff) break;

      if (hasReadOnlyPermissionOnly(staff)) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: isStaffAction(application)
            ? 'Unable to add application with assessment'
            : 'Unable to add application',
        });
        break;
      }

      try {
        const data = await addApplication(application, req);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(error);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Unable to add application' });
        }
      }
      break;
    }

    default:
      res
        .setHeader('Allow', 'GET, POST')
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: 'Method not allowed' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/applications');

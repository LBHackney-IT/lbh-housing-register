import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../../domain/HousingApi';
import { updateApplication } from '../../../../lib/gateways/applications-api';
import { hasReadOnlyStaffPermissions } from '../../../../lib/utils/hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from '../../../../lib/utils/hasStaffPermissions';
import { isStaffAction } from '../../../../lib/utils/isStaffAction';
import { canUpdateApplication } from '../../../../lib/utils/requestAuth';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

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

  let application: Application;
  try {
    application = JSON.parse(req.body);
  } catch (error) {
    console.error('Unable to parse application request body', error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Unable to parse request' });
    return;
  }

  const id = req.query.id as string;

  try {
    if (
      canUpdateApplication(req, id) ||
      (isStaffAction(application) &&
        hasStaffPermissions(req) &&
        !hasReadOnlyStaffPermissions(req))
    ) {
      const data = await updateApplication(application, id, req);
      res.status(StatusCodes.OK).json(data);
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
  } catch (error) {
    // Every branch below must write a response - previously the
    // "no response received" / "request setup failed" cases only
    // logged, leaving the request to hang with no status ever sent.
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Unable to update application', error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Unable to update application' });
    }
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/applications/[id]');

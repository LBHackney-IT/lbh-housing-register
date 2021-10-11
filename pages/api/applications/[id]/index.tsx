import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { updateApplication } from '../../../../lib/gateways/applications-api';
import {
  canUpdateApplication,
  hasStaffPermissions,
  isStaffAction,
} from '../../../../lib/utils/requestAuth';

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
          (isStaffAction(application) && hasStaffPermissions(req))
        ) {
          const data = await updateApplication(application, id);
          res.status(StatusCodes.OK).json(data);
        } else {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Unable to update application' });
        }
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to update application' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;

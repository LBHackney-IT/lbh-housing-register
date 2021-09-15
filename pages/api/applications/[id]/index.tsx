import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  getApplication,
  updateApplication,
} from '../../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET': {
      // TODO IMPORTANT we need an access check here. User should pass us a token that we can validate against their application.
      const id = req.query.id as string;
      const data = await getApplication(id);
      res.status(StatusCodes.OK).json(data);

      break;
    }
    case 'PATCH':
      try {
        const application = JSON.parse(req.body);
        const id = req.query.id as string;
        const data = await updateApplication(application, id);
        res.status(StatusCodes.OK).json(data);
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

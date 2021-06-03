import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { updateApplication } from '../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'PATCH':
      try {
        const application = JSON.parse(req.body);
        const id = req.query.id;
        const data = await updateApplication(application, id);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
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
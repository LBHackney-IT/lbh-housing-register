import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { completeApplication } from '../../../../lib/gateways/applications-api';
import { canUpdateApplication } from '../../../../lib/utils/requestAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'PATCH':
      try {
        const id = req.query.id as string;

        if (canUpdateApplication(req, id)) {
          const data = await completeApplication(id);
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

import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import {
  getApplication,
  updateApplication,
} from '../../../lib/gateways/applications-api';
import AccessDeniedPage from '../../access-denied';
import CognitoAuthentication from '../../../lib/security/cognito';
import { OperationCanceledException } from 'typescript';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET': {
      try {
        CognitoAuthentication(req, res);

        if (res === StatusCodes.UNAUTHORIZED) {
          throw new Error(res.statusMessage);
        }

        const id = req.query.id as string;
        const data = await getApplication(id);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Unable to verify credentails' });
      }

      break;
    }
    case 'PATCH':
      try {
        const application = JSON.parse(req.body);
        const id = req.query.id as string;
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

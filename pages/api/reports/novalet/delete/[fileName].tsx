import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { deleteNovaletExport } from '../../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      const user = getSession(req);

      const auth = getAuth(
        process.env.AUTHORISED_MANAGER_GROUP as string,
        user
      );

      if (!('user' in auth)) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
        return;
      }

      try {
        const fileName = req.query.fileName as string;
        const response = await deleteNovaletExport(fileName, req);

        res.status(response.status);

        if (response.status == StatusCodes.OK) {
          res.send({
            message: 'Export file deleted',
          });
        } else {
          res.send({
            message: 'Unable to deleted file',
          });
        }
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error making request', inner: error });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;

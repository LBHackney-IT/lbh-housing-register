import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { approveNovaletExport } from '../../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  switch (req.method) {
    case 'POST':
      {
        const user = getSession(req);

        const auth = getAuth(
          process.env.AUTHORISED_MANAGER_GROUP as string,
          user,
        );

        if (!('user' in auth)) {
          res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
          return;
        }

        try {
          const fileName = req.query.fileName as string;
          const response = await approveNovaletExport(fileName);

          if (response) {
            res.status(response.status);

            if (response.status == StatusCodes.OK) {
              res.send({
                message: 'Export file approved successfully',
              });
            } else {
              res.send({
                message: 'Unable to approve export file',
              });
            }
          } else {
            // Previously fell through here with no response ever written,
            // leaving the caller's request to hang.
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: 'Unable to approve export file' });
          }
        } catch (error) {
          console.error('Unable to approve export file', error);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Unable to approve export file' });
        }
      }

      break;

    default:
      res
        .setHeader('Allow', 'POST')
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: 'Method not allowed' });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/novalet/approve/[fileName]',
);

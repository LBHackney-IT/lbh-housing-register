import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { generateNovaletExport } from '../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      {
        const user = getSession(req);

        const auth = getAuth(
          process.env.AUTHORISED_MANAGER_GROUP as string,
          user
        );

        if (!('user' in auth)) {
          res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
          return;
        }

        const response = await generateNovaletExport();

        res.status(response.status);

        if (response.status == StatusCodes.OK) {
          res.send({
            message: 'Export file generated successfully',
          });
        } else {
          res.send({
            message: 'Unable to generate export file',
          });
        }
      }

      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/novalet/generate'
);

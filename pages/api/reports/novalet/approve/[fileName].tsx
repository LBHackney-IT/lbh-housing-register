import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { approveNovaletExport } from '../../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    res
      .setHeader('Allow', 'POST')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  const user = getSession(req);

  const auth = getAuth(process.env.AUTHORISED_MANAGER_GROUP as string, user);

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
        // Status tells you where to look: 4xx = request/auth, 5xx = upstream.
        console.error('Unable to approve export file', {
          fileName,
          status: response.status,
          data: response.data,
        });
        res.send({
          message: 'Unable to approve export file',
        });
      }
    } else {
      // Previously fell through here with no response ever written,
      // leaving the caller's request to hang.
      console.error('Unable to approve export file: empty response');
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
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/novalet/approve/[fileName]',
);

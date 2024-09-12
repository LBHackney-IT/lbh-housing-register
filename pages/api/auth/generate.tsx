import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';

import { createVerifyCode } from '../../../lib/gateways/applications-api';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        const request = JSON.parse(req.body);
        console.log('auth generate request');
        console.dir(request);
        const data = await createVerifyCode(request);
        console.log('auth generate data');
        console.dir(data);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to create verify code' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default withSentry(endpoint);

import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';

import { lookUpAddress } from '../../../../lib/gateways/address-api';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      try {
        const { postcode } = req.query;
        if (!postcode) {
          res.status(StatusCodes.BAD_REQUEST).send('Missing postcode');
          return;
        }
        const data = await lookUpAddress(postcode);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to look up address' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default withSentry(endpoint);

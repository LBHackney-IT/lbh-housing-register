import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { lookUpAddress } from '../../../../lib/gateways/address-api';
import {
  isUkPostcode,
  UK_POSTCODE_ERROR,
} from '../../../../lib/utils/postcode';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

const readPostcode = (postcode: string | undefined): string | undefined =>
  postcode?.trim() ? postcode : undefined;

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'GET') {
    res
      .setHeader('Allow', 'GET')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  const postcode = readPostcode(
    typeof req.query.postcode === 'string' ? req.query.postcode : undefined,
  );
  if (!postcode) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing postcode' });
    return;
  }

  if (!isUkPostcode(postcode)) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: UK_POSTCODE_ERROR });
    return;
  }

  try {
    const data = await lookUpAddress(postcode);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to look up address' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/address/[postcode]');

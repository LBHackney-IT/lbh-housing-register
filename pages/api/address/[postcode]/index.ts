import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { lookUpAddress } from '../../../../lib/gateways/address-api';
import {
  isUkPostcode,
  UK_POSTCODE_ERROR,
} from '../../../../lib/utils/postcode';
import { getErrorStatusCode } from '../../../../lib/utils/sentry';

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

  const { postcode } = req.query as { postcode?: string };
  if (!postcode?.trim()) {
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
    // The address service uses 400 when it rejects the postcode. That is not
    // a server failure, and reporting it as 500 is what the client sends to Sentry.
    if (getErrorStatusCode(error) === StatusCodes.BAD_REQUEST) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Unable to look up address' });
      return;
    }

    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to look up address' });
  }
};

export default endpoint;

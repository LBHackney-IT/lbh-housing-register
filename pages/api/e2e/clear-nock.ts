import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler } from 'next';

import { clearE2eNockMocks } from '../../../lib/server/e2eHttpMocks';

const endpoint: NextApiHandler = (req, res) => {
  if (process.env.E2E_HTTP_MOCKS !== 'true') {
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  if (req.method !== 'POST') {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  try {
    clearE2eNockMocks();
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    console.error('e2e/clear-nock', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export default endpoint;

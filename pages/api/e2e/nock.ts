import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler } from 'next';

import {
  registerE2eNockMock,
  type E2eNockRegisterPayload,
} from '../../../lib/server/e2eHttpMocks';

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
    const body =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as E2eNockRegisterPayload)
        : (req.body as E2eNockRegisterPayload);

    registerE2eNockMock(body);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (err) {
    console.error('e2e/nock', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err instanceof Error ? err.message : 'nock failed' });
  }
};

export default endpoint;

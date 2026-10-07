import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler } from 'next';

import { areE2eRoutesEnabled } from '../../../lib/server/e2eAccess';
import { getCapturedE2eRequests } from '../../../lib/server/e2eHttpMocks';

interface CapturedRequestsQuery {
  hostname: string;
  method: string;
  path: string;
}

const endpoint: NextApiHandler = (req, res) => {
  if (!areE2eRoutesEnabled()) {
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
    const { hostname, method, path } =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as CapturedRequestsQuery)
        : (req.body as CapturedRequestsQuery);

    const requests = getCapturedE2eRequests(hostname, method, path);
    res.status(StatusCodes.OK).json({ requests });
  } catch (err) {
    console.error('e2e/captured-requests', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err instanceof Error ? err.message : 'failed' });
  }
};

export default endpoint;

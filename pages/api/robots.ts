import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler } from 'next';
import { robotsTxt } from '../../lib/server/searchIndexing';

const endpoint: NextApiHandler = (req, res) => {
  if (req.method !== 'GET') {
    res
      .setHeader('Allow', 'GET')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(StatusCodes.OK).send(robotsTxt());
};

export default endpoint;

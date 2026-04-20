import { StatusCodes } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import type { NextApiHandler } from 'next';

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
    const parsed =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { user, secret } = parsed as { user: object; secret: string };

    if (!user || !secret) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'user and secret required' });
      return;
    }

    const token = sign(user, secret);
    res.status(StatusCodes.OK).json({ token });
  } catch (err) {
    console.error('e2e/generate-token', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to generate token' });
  }
};

export default endpoint;

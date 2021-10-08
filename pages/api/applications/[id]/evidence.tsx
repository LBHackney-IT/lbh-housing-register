import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { createEvidenceRequest } from '../../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        const request = JSON.parse(req.body);
        const id = req.query.id as string;
        const data = await createEvidenceRequest(id, request);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Unable to create evidence request for application',
        });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;

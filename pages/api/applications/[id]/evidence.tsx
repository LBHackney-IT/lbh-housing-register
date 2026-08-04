import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CreateEvidenceRequest } from '../../../../domain/HousingApi';
import { createEvidenceRequest } from '../../../../lib/gateways/applications-api';
import { canUpdateApplication } from '../../../../lib/utils/requestAuth';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    res
      .setHeader('Allow', 'POST')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  let request: CreateEvidenceRequest;
  try {
    request = JSON.parse(req.body);
  } catch (error) {
    console.error('Unable to parse evidence request body', error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Unable to parse request' });
    return;
  }

  const id = req.query.id as string;

  if (!canUpdateApplication(req, id)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    return;
  }

  try {
    const data = await createEvidenceRequest(id, request);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Unable to create evidence request for application',
      });
    }
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/applications/[id]/evidence',
);

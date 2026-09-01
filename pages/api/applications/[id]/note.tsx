import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { AddNoteToHistoryRequest } from '../../../../domain/HousingApi';
import { addNoteToHistory } from '../../../../lib/gateways/applications-api';
import { getApplicationAccess } from '../../../../lib/utils/requestAuth';

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

  let request: AddNoteToHistoryRequest;
  try {
    request = JSON.parse(req.body);
  } catch (error) {
    console.error('Unable to parse note request body', error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Unable to parse request' });
    return;
  }

  const id = req.query.id as string;

  const access = await getApplicationAccess(req, id);
  if (access !== 'allowed') {
    res
      .status(
        access === 'unauthenticated'
          ? StatusCodes.UNAUTHORIZED
          : StatusCodes.FORBIDDEN,
      )
      .json({
        message:
          access === 'unauthenticated' ? 'Unauthorized' : 'Access denied',
      });
    return;
  }

  try {
    const data = await addNoteToHistory(id, request, req);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Unable to add note to activity history',
      });
    }
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/applications/[id]/note',
);

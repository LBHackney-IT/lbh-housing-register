import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CreateEvidenceRequest } from '../../../../domain/HousingApi';
import { createEvidenceRequest } from '../../../../lib/gateways/applications-api';
import { EvidenceType } from '../../../../lib/types/evidence';
import { getResidentApplicationAccess } from '../../../../lib/utils/requestAuth';

const ALLOWED_DOCUMENT_TYPES: readonly string[] = Object.values(EvidenceType);

const toEvidenceRequest = (body: unknown): CreateEvidenceRequest | null => {
  const documentTypes = (body as Partial<CreateEvidenceRequest> | null)
    ?.documentTypes;

  if (
    !Array.isArray(documentTypes) ||
    documentTypes.length === 0 ||
    !documentTypes.every((type) => ALLOWED_DOCUMENT_TYPES.includes(type))
  ) {
    return null;
  }

  return { documentTypes };
};

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

  const access = getResidentApplicationAccess(req, id);
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

  const evidenceRequest = toEvidenceRequest(request);
  if (!evidenceRequest) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid document types' });
    return;
  }

  try {
    const data = await createEvidenceRequest(id, evidenceRequest, req);
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

export default endpoint;

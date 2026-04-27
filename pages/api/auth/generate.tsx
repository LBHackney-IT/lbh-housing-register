import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CreateAuthRequest } from '../../../domain/HousingApi';
import { createVerifyCode } from '../../../lib/gateways/applications-api';
import { getUser } from '../../../lib/utils/users';

/** Verbose API errors for mocked e2e / CI — not during Jest (avoids noise and spy interference). */
function logE2eGenerateError(payload: Record<string, unknown>): void {
  if (
    process.env.E2E_HTTP_MOCKS === 'true' &&
    process.env.JEST_WORKER_ID === undefined
  ) {
    console.error('[api/auth/generate]', payload);
  }
}

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid request method' });
    return;
  }

  let request: CreateAuthRequest;
  try {
    // body is usually an object when Next JSON body parsing runs but it can be a string in some test paths. So make sure both shapes are parsed before request.
    request =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as CreateAuthRequest)
        : (req.body as CreateAuthRequest);
  } catch (parseErr) {
    logE2eGenerateError({
      phase: 'body parse failed',
      bodyType: typeof req.body,
      message: parseErr instanceof Error ? parseErr.message : String(parseErr),
    });
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Unable to parse request' });
    return;
  }

  try {
    // In local Cypress we pre-seed a resident token cookie with application_id.
    // Forward it so API can create/verify against the same application record.
    const cookieApplicationId = getUser(req)?.application_id;
    const requestWithApplicationId: CreateAuthRequest = {
      ...request,
      applicationId: request.applicationId ?? cookieApplicationId,
    };

    const data = await createVerifyCode(requestWithApplicationId);
    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    logE2eGenerateError({
      phase: 'createVerifyCode failed',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      housingRegisterApiSet: Boolean(process.env.HOUSING_REGISTER_API),
      housingRegisterKeySet: Boolean(process.env.HOUSING_REGISTER_KEY),
    });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to create verify code' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/auth/generate');

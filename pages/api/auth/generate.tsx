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

/**
 * Read the raw request body from the stream.
 * Used as a fallback when Next.js body-parser has not already populated
 * req.body (e.g. in the Lambda/serverless-http environment where the parser
 * may not fire for every content-type or runtime combination).
 */
function readRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
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
    // Resolve to a raw string regardless of how the Lambda/serverless-http
    // environment delivered the body:
    //   • object  — Next.js JSON body-parser already ran (normal dev/prod)
    //   • string  — text/plain or test path
    //   • Buffer  — binary Lambda payload not decoded by the framework
    //   • undefined — body-parser did not fire; read from the stream directly
    let rawBodyStr: string | undefined;
    if (typeof req.body === 'string') {
      rawBodyStr = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      rawBodyStr = req.body.toString('utf8');
    } else if (req.body === undefined || req.body === null) {
      rawBodyStr = await readRawBody(req);
    }

    request =
      rawBodyStr !== undefined
        ? (JSON.parse(rawBodyStr) as CreateAuthRequest)
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

  // Backend treats a null email as an unhandled exception (ArgumentNullException
  // in SHA256Helper) and returns a 500 so fail fast here.
  if (
    !request ||
    typeof request.email !== 'string' ||
    request.email.trim() === ''
  ) {
    // Always log — visible in CloudWatch on Lambda deployments, not just E2E.
    if (process.env.JEST_WORKER_ID === undefined) {
      console.error('[api/auth/generate] validation failed', {
        reason: 'missing or invalid email',
        bodyType: typeof req.body,
        requestKeys: request ? Object.keys(request) : null,
      });
    }
    logE2eGenerateError({
      phase: 'validation failed',
      reason: 'missing or invalid email',
      bodyType: typeof req.body,
    });
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
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

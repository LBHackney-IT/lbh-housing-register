import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { downloadNovaletExport } from '../../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../../lib/utils/googleAuth';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'GET') {
    res
      .setHeader('Allow', 'GET')
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' });
    return;
  }

  const user = getSession(req);

  const auth = getAuth(process.env.AUTHORISED_MANAGER_GROUP as string, user);

  if (!('user' in auth)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
    return;
  }

  try {
    const fileName = req.query.fileName as string;
    // Axios rejects non-2xx into the catch below - a resolved response is
    // always a real AxiosResponse (the gateway's `| null` return type was
    // inaccurate), so the old `if (file)` / 404 else was unreachable.
    const file = await downloadNovaletExport(fileName);

    res.status(file.status);
    const contentType = file.headers['content-type'];
    res.setHeader(
      'Content-Type',
      typeof contentType === 'string'
        ? contentType
        : 'application/octet-stream',
    );
    const contentDisposition = file.headers['content-disposition'];
    res.setHeader(
      'Content-Disposition',
      typeof contentDisposition === 'string'
        ? contentDisposition
        : 'attachment',
    );
    res.send(file.data);
  } catch (error) {
    console.error('Unable to download report', {
      fileName: req.query.fileName,
      error,
    });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to download report' });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/novalet/download/[fileName]',
);

import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { downloadInternalReport } from '../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../lib/utils/googleAuth';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { InternalReportRequest } from '../../../../domain/HousingApi';

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

  const user = getSession(req);

  const auth = getAuth(process.env.AUTHORISED_MANAGER_GROUP as string, user);

  if (!('user' in auth)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
    return;
  }

  try {
    const reportData: InternalReportRequest = {
      ReportType: parseInt(req.body.ReportType),
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
    };

    if (Buffer.isBuffer(req.body)) {
      //For some reason, the body has been interpreted by NextJS as a buffer once its behind API Gateway
      const requestBodyAsString = req.body.toString();
      const formKeys = requestBodyAsString.split('&');
      formKeys.forEach((formKeyValuePair) => {
        const keyvaluepair = formKeyValuePair.split('=');
        if (keyvaluepair[0].toLowerCase() == 'reporttype') {
          reportData.ReportType = parseInt(keyvaluepair[1]);
        } else {
          reportData[keyvaluepair[0]] = keyvaluepair[1];
        }
      });
    }

    // Axios rejects non-2xx into the catch below - a resolved response is
    // always a real AxiosResponse (the gateway's `| null` return type is
    // inaccurate), so the old `if (fileResponse)` / 404 else was unreachable.
    const fileResponse = await downloadInternalReport(reportData, req);

    res.status(fileResponse.status);
    const contentType = fileResponse.headers['content-type'];
    res.setHeader(
      'Content-Type',
      typeof contentType === 'string'
        ? contentType
        : 'application/octet-stream',
    );
    const contentDisposition = fileResponse.headers['content-disposition'];
    res.setHeader(
      'Content-Disposition',
      typeof contentDisposition === 'string'
        ? contentDisposition
        : 'attachment',
    );
    res.send(fileResponse.data);
  } catch (error) {
    // Previously the raw Axios response and error were included in the
    // response body, leaking internal details to the client.
    console.error('Unable to download report', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Unable to download report',
    });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/internal/download',
);

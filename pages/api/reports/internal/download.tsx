import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { downloadInternalReport } from '../../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../../lib/utils/googleAuth';
import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { InternalReportRequest } from '../../../../domain/HousingApi';
import { AxiosResponse } from 'axios';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      {
        const user = getSession(req);

        const auth = getAuth(
          process.env.AUTHORISED_MANAGER_GROUP as string,
          user
        );

        if (!('user' in auth)) {
          res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
          return;
        }
        let fileResponse = {} as AxiosResponse;
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

          fileResponse = (await downloadInternalReport(
            reportData,
            req
          )) as AxiosResponse;

          if (fileResponse) {
            res.status(fileResponse.status);
            res.setHeader('Content-Type', fileResponse.headers['content-type']);
            res.setHeader(
              'Content-Disposition',
              fileResponse.headers['content-disposition']
            );
            res.send(fileResponse.data);
          } else {
            res.status(404);
            res.send({
              message: 'Unable to download report',
            });
          }
        } catch (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Request error: Unable to download report: ',
            response: fileResponse,
            error: error,
          });
        }
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/reports/internal/download'
);

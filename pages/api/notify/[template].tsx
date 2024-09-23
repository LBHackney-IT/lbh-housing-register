import { withSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  sendNewApplicationEmail,
  sendDisqualifyEmail,
  sendMedicalNeedEmail,
} from '../../../lib/gateways/notify-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        const notification = JSON.parse(req.body);
        const template = req.query.template as string;

        switch (template) {
          case 'new-application': {
            const sendNewApplicationData = await sendNewApplicationEmail(
              notification
            );
            res.status(StatusCodes.OK).json(sendNewApplicationData);
            break;
          }
          case 'medical': {
            const sendMedicalEmailData = await sendMedicalNeedEmail(
              notification
            );
            res.status(StatusCodes.OK).json(sendMedicalEmailData);
            break;
          }
          case 'disqualify': {
            const sendDisqualifyEmailData = await sendDisqualifyEmail(
              notification
            );
            res.status(StatusCodes.OK).json(sendDisqualifyEmailData);
            break;
          }
          default:
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: 'Invalid template request' });
            break;
        }
      } catch (error) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to send email' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default withSentry(endpoint);

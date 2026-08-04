import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  sendNewApplicationEmail,
  sendDisqualifyEmail,
  sendMedicalNeedEmail,
} from '../../../lib/gateways/notify-api';
import { getApplication } from '../../../lib/gateways/applications-api';
import {
  buildDisqualifyNotifyRequest,
  buildMedicalNeedNotifyRequest,
  buildNewApplicationNotifyRequest,
} from '../../../lib/utils/notifyRequestBuilders';
import { getUser } from '../../../lib/utils/users';

// This endpoint sends real emails via GOV.UK Notify, so it must not trust
// client-supplied email/personalisation/reference values - a caller could
// otherwise trigger arbitrary Hackney-branded emails to any address. Instead,
// it authorises the caller against their own application (via their session)
// and builds the entire NotifyRequest server-side from that stored record.
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

  let application: Awaited<ReturnType<typeof getApplication>>;

  try {
    const applicationId = getUser(req)?.application_id;
    if (!applicationId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    application = await getApplication(applicationId);
  } catch (error) {
    console.error('Unable to load application for Notify', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to load application' });
    return;
  }

  if (!application) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Application not found' });
    return;
  }

  const emailAddress =
    application.mainApplicant?.contactInformation?.emailAddress;
  if (!emailAddress?.trim()) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ message: 'Application has no email address' });
    return;
  }

  try {
    const template = req.query.template as string;

    switch (template) {
      case 'new-application': {
        const sendNewApplicationData = await sendNewApplicationEmail(
          buildNewApplicationNotifyRequest(application),
        );
        res.status(StatusCodes.OK).json(sendNewApplicationData);
        break;
      }
      case 'medical': {
        const sendMedicalEmailData = await sendMedicalNeedEmail(
          buildMedicalNeedNotifyRequest(application),
        );
        res.status(StatusCodes.OK).json(sendMedicalEmailData);
        break;
      }
      case 'disqualify': {
        const sendDisqualifyEmailData = await sendDisqualifyEmail(
          buildDisqualifyNotifyRequest(application),
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
    console.error('Unable to send Notify email', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to send email' });
  }
};

export default wrapApiHandlerWithSentry(endpoint, '/api/notify/[template]');

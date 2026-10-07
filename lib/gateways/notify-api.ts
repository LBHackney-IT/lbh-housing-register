import * as Sentry from '@sentry/nextjs';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';
import { NotifyClient } from 'notifications-node-client';

// Reference and template id identify the failed send. The request also
// contains the resident email, name, medical-need flag and disqualification
// text, which must not be attached to the event.
function captureNotifyError(
  err: unknown,
  templateId: string | undefined,
  request: NotifyRequest,
): void {
  Sentry.captureException(err, {
    tags: {
      notify_template: templateId ?? 'unknown',
      notify_reference: request.reference,
    },
  });
}

async function sendEmail(
  templateId: string | undefined,
  request: NotifyRequest,
): Promise<NotifyResponse> {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);

  try {
    const response = await notifyClient.sendEmail(
      templateId,
      request.emailAddress,
      {
        personalisation: request.personalisation,
        reference: request.reference,
      },
    );

    // sendEmail resolves with the raw Axios response - the NotifyResponse
    // shape (id/reference/content) lives on `.data`.
    return response.data as NotifyResponse;
  } catch (err) {
    // Previously this was swallowed here (logged/captured then treated as a
    // successful, empty response), so the caller always got a 200 with no
    // body regardless of whether the email actually sent. Capture to Sentry,
    // then rethrow so /api/notify/[template] can return a proper error status.
    captureNotifyError(err, templateId, request);
    throw err;
  }
}

export const sendNewApplicationEmail = (
  request: NotifyRequest,
): Promise<NotifyResponse> =>
  sendEmail(process.env.NOTIFY_TEMPLATE_NEW_APPLICATION, request);

export const sendMedicalNeedEmail = (
  request: NotifyRequest,
): Promise<NotifyResponse> =>
  sendEmail(process.env.NOTIFY_TEMPLATE_MEDICAL_NEED, request);

export const sendDisqualifyEmail = (
  request: NotifyRequest,
): Promise<NotifyResponse> =>
  sendEmail(process.env.NOTIFY_TEMPLATE_DISQUALIFY, request);

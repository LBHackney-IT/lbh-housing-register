import * as Sentry from '@sentry/nextjs';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';
import { NotifyClient } from 'notifications-node-client';

// Attaches the exact NotifyRequest that was sent to the failing exception
// itself (rather than relying on `console.error` + breadcrumbs), so the
// payload that caused a Notify failure is always visible on the event,
// regardless of breadcrumb/scope isolation health.
function captureNotifyError(err: unknown, request: NotifyRequest): void {
  Sentry.captureException(err, { extra: { notifyRequest: request } });
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
    // body regardless of whether the email actually sent. Capture to Sentry
    // with the payload attached, then rethrow so /api/notify/[template] can
    // return a proper error status to the client.
    captureNotifyError(err, request);
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

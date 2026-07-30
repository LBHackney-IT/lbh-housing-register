import * as Sentry from '@sentry/nextjs';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';
import { NotifyClient } from 'notifications-node-client';

// Attaches the exact NotifyRequest that was sent to the failing exception
// itself (rather than relying on `console.error` + breadcrumbs), so the
// payload that caused a Notify failure is always visible on the event,
// regardless of breadcrumb/scope isolation health.
function captureNotifyError(err: unknown, request: NotifyRequest) {
  Sentry.captureException(err, { extra: { notifyRequest: request } });
}

export const sendNewApplicationEmail = async (
  request: NotifyRequest,
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(
      process.env.NOTIFY_TEMPLATE_NEW_APPLICATION,
      request.emailAddress,
      {
        personalisation: request.personalisation,
        reference: request.reference,
      },
    )
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => captureNotifyError(err, request));

  return response as NotifyResponse;
};

export const sendMedicalNeedEmail = async (
  request: NotifyRequest,
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(process.env.NOTIFY_TEMPLATE_MEDICAL_NEED, request.emailAddress, {
      personalisation: request.personalisation,
      reference: request.reference,
    })
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => captureNotifyError(err, request));

  return response as NotifyResponse;
};

export const sendDisqualifyEmail = async (
  request: NotifyRequest,
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(process.env.NOTIFY_TEMPLATE_DISQUALIFY, request.emailAddress, {
      personalisation: request.personalisation,
      reference: request.reference,
    })
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => captureNotifyError(err, request));

  return response as NotifyResponse;
};

import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';
import { NotifyClient } from 'notifications-node-client';

export const sendNewApplicationEmail = async (
  request: NotifyRequest
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(
      process.env.NOTIFY_TEMPLATE_NEW_APPLICATION,
      request.emailAddress,
      {
        personalisation: request.personalisation,
        reference: request.reference,
      }
    )
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => console.error(err));

  return response as NotifyResponse;
};

export const sendMedicalNeedEmail = async (
  request: NotifyRequest
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(process.env.NOTIFY_TEMPLATE_MEDICAL_NEED, request.emailAddress, {
      personalisation: request.personalisation,
      reference: request.reference,
    })
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => console.error(err));

  return response as NotifyResponse;
};

export const sendDisqualifyEmail = async (
  request: NotifyRequest
): Promise<NotifyResponse> => {
  const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);
  const response = await notifyClient
    .sendEmail(process.env.NOTIFY_TEMPLATE_DISQUALIFY, request.emailAddress, {
      personalisation: request.personalisation,
      reference: request.reference,
    })
    .then((response: NotifyResponse) => console.log(response))
    .catch((err: NotifyResponse) => console.error(err));

  return response as NotifyResponse;
};

/**
 * @jest-environment node
 */

import * as Sentry from '@sentry/nextjs';
import { NotifyClient } from 'notifications-node-client';

import { NotifyRequest } from '../../../domain/govukNotify';
import {
  sendDisqualifyEmail,
  sendMedicalNeedEmail,
  sendNewApplicationEmail,
} from '../../../lib/gateways/notify-api';

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn(),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

const NotifyClientMock = NotifyClient as unknown as jest.Mock;
const captureExceptionMock = Sentry.captureException as jest.Mock;

const mockRequest: NotifyRequest = {
  emailAddress: 'jane@example.com',
  reference: 'REF123',
  personalisation: { resident_name: 'Jane' },
};

const mockNotifyResponseData = {
  id: 'notify-id',
  reference: 'REF123',
  content: {
    subject: 'subject',
    body: 'body',
    from_email: 'from@example.com',
  },
};

describe('notify-api gateway', () => {
  const sendEmailMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NOTIFY_TEMPLATE_NEW_APPLICATION = 'template-new-application';
    process.env.NOTIFY_TEMPLATE_MEDICAL_NEED = 'template-medical-need';
    process.env.NOTIFY_TEMPLATE_DISQUALIFY = 'template-disqualify';
    NotifyClientMock.mockImplementation(() => ({ sendEmail: sendEmailMock }));
  });

  it.each([
    [
      'sendNewApplicationEmail',
      sendNewApplicationEmail,
      'template-new-application',
    ],
    ['sendMedicalNeedEmail', sendMedicalNeedEmail, 'template-medical-need'],
    ['sendDisqualifyEmail', sendDisqualifyEmail, 'template-disqualify'],
  ] as const)(
    '%s resolves with the unwrapped Notify response data',
    async (_name, sendFn, expectedTemplateId) => {
      sendEmailMock.mockResolvedValue({
        status: 201,
        data: mockNotifyResponseData,
      });

      const result = await sendFn(mockRequest);

      expect(result).toStrictEqual(mockNotifyResponseData);
      expect(sendEmailMock).toHaveBeenCalledWith(
        expectedTemplateId,
        mockRequest.emailAddress,
        {
          personalisation: mockRequest.personalisation,
          reference: mockRequest.reference,
        },
      );
      expect(captureExceptionMock).not.toHaveBeenCalled();
    },
  );

  it('captures the failure to Sentry with the request attached and rethrows, rather than resolving as if it succeeded', async () => {
    const notifyError = new Error('Notify API rejected the request');
    sendEmailMock.mockRejectedValue(notifyError);

    await expect(sendDisqualifyEmail(mockRequest)).rejects.toThrow(notifyError);

    expect(captureExceptionMock).toHaveBeenCalledWith(notifyError, {
      extra: { notifyRequest: mockRequest },
    });
  });
});

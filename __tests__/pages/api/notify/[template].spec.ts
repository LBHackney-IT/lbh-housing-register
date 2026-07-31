/**
 * @jest-environment node
 */

import { StatusCodes } from 'http-status-codes';
import { createMocks, RequestMethod, RequestOptions } from 'node-mocks-http';

import { Application } from '../../../../domain/HousingApi';
import { NotifyRequest, NotifyResponse } from '../../../../domain/govukNotify';
import endpoint from '../../../../pages/api/notify/[template]';
import { ApiRequest, ApiResponse } from '../../../../testUtils/types';

jest.mock('../../../../lib/utils/users', () => ({
  getUser: jest.fn(),
}));

jest.mock('../../../../lib/gateways/applications-api', () => ({
  getApplication: jest.fn(),
}));

jest.mock('../../../../lib/gateways/notify-api', () => ({
  sendNewApplicationEmail: jest.fn(),
  sendMedicalNeedEmail: jest.fn(),
  sendDisqualifyEmail: jest.fn(),
}));

jest.mock('../../../../lib/utils/notifyRequestBuilders', () => ({
  buildNewApplicationNotifyRequest: jest.fn(),
  buildMedicalNeedNotifyRequest: jest.fn(),
  buildDisqualifyNotifyRequest: jest.fn(),
}));

import { getApplication } from '../../../../lib/gateways/applications-api';
import {
  sendDisqualifyEmail,
  sendMedicalNeedEmail,
  sendNewApplicationEmail,
} from '../../../../lib/gateways/notify-api';
import {
  buildDisqualifyNotifyRequest,
  buildMedicalNeedNotifyRequest,
  buildNewApplicationNotifyRequest,
} from '../../../../lib/utils/notifyRequestBuilders';
import { getUser } from '../../../../lib/utils/users';

const getUserMock = getUser as jest.Mock;
const getApplicationMock = getApplication as jest.Mock;
const sendNewApplicationEmailMock = sendNewApplicationEmail as jest.Mock;
const sendMedicalNeedEmailMock = sendMedicalNeedEmail as jest.Mock;
const sendDisqualifyEmailMock = sendDisqualifyEmail as jest.Mock;
const buildNewApplicationNotifyRequestMock =
  buildNewApplicationNotifyRequest as jest.Mock;
const buildMedicalNeedNotifyRequestMock =
  buildMedicalNeedNotifyRequest as jest.Mock;
const buildDisqualifyNotifyRequestMock =
  buildDisqualifyNotifyRequest as jest.Mock;

const applicationId = 'application-id-1';

const mockApplication: Application = {
  id: applicationId,
  reference: 'REF123',
  mainApplicant: {
    person: { firstName: 'Jane' },
    contactInformation: { emailAddress: 'jane@example.com' },
  },
};

const mockNotifyRequest: NotifyRequest = {
  emailAddress: 'jane@example.com',
  reference: 'REF123',
  personalisation: { resident_name: 'Jane' },
};

const mockNotifyResponse: NotifyResponse = {
  id: 'notify-id',
  reference: 'REF123',
  content: {
    subject: 'subject',
    body: 'body',
    from_email: 'from@example.com',
  },
};

function mockRequest(
  template: string,
  method: RequestMethod = 'POST',
  body?: unknown,
): { req: ApiRequest; res: ApiResponse } {
  return createMocks({
    method,
    query: { template },
    body: body as unknown as RequestOptions['body'],
  });
}

describe('/api/notify/[template]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUserMock.mockReturnValue({ application_id: applicationId });
    getApplicationMock.mockResolvedValue(mockApplication);
    buildNewApplicationNotifyRequestMock.mockReturnValue(mockNotifyRequest);
    buildMedicalNeedNotifyRequestMock.mockReturnValue(mockNotifyRequest);
    buildDisqualifyNotifyRequestMock.mockReturnValue(mockNotifyRequest);
    sendNewApplicationEmailMock.mockResolvedValue(mockNotifyResponse);
    sendMedicalNeedEmailMock.mockResolvedValue(mockNotifyResponse);
    sendDisqualifyEmailMock.mockResolvedValue(mockNotifyResponse);
  });

  it('returns 405 for non-POST methods without checking the session', async () => {
    const { req, res } = mockRequest('new-application', 'GET');

    await endpoint(req, res);

    expect(getUserMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('POST');
    expect(res._getJSONData()).toStrictEqual({
      message: 'Method not allowed',
    });
  });

  describe('authorisation', () => {
    it('returns 401 and never calls Notify when there is no session', async () => {
      getUserMock.mockReturnValue(undefined);

      const { req, res } = mockRequest('disqualify');

      await endpoint(req, res);

      expect(getApplicationMock).not.toHaveBeenCalled();
      expect(sendDisqualifyEmailMock).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(res._getJSONData()).toStrictEqual({ message: 'Unauthorized' });
    });

    it('returns 401 when the session has no application_id', async () => {
      getUserMock.mockReturnValue({});

      const { req, res } = mockRequest('disqualify');

      await endpoint(req, res);

      expect(getApplicationMock).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('returns 404 and never calls Notify when the application cannot be found', async () => {
      getApplicationMock.mockResolvedValue(null);

      const { req, res } = mockRequest('disqualify');

      await endpoint(req, res);

      expect(sendDisqualifyEmailMock).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Application not found',
      });
    });

    it('returns 422 and never calls Notify when the application has no email address', async () => {
      getApplicationMock.mockResolvedValue({
        ...mockApplication,
        mainApplicant: {
          ...mockApplication.mainApplicant,
          contactInformation: { emailAddress: '   ' },
        },
      });

      const { req, res } = mockRequest('disqualify');

      await endpoint(req, res);

      expect(buildDisqualifyNotifyRequestMock).not.toHaveBeenCalled();
      expect(sendDisqualifyEmailMock).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Application has no email address',
      });
    });

    it('never parses the request body and ignores any attacker-supplied fields', async () => {
      const attackerBody = JSON.stringify({
        emailAddress: 'attacker@evil.example',
        reference: 'attacker-ref',
        personalisation: { resident_name: 'Attacker' },
      });
      const jsonParseSpy = jest.spyOn(JSON, 'parse');

      const { req, res } = mockRequest('disqualify', 'POST', attackerBody);

      await endpoint(req, res);

      expect(jsonParseSpy).not.toHaveBeenCalled();
      expect(getApplicationMock).toHaveBeenCalledWith(applicationId);
      expect(buildDisqualifyNotifyRequestMock).toHaveBeenCalledWith(
        mockApplication,
      );
      expect(sendDisqualifyEmailMock).toHaveBeenCalledWith(mockNotifyRequest);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it("looks up the caller's own application by their session, not by any request input", async () => {
      const { req, res } = mockRequest('disqualify');

      await endpoint(req, res);

      expect(getUserMock).toHaveBeenCalledWith(req);
      expect(getApplicationMock).toHaveBeenCalledTimes(1);
      expect(getApplicationMock).toHaveBeenCalledWith(applicationId);
    });
  });

  describe.each([
    [
      'new-application',
      buildNewApplicationNotifyRequestMock,
      sendNewApplicationEmailMock,
    ],
    ['medical', buildMedicalNeedNotifyRequestMock, sendMedicalNeedEmailMock],
    ['disqualify', buildDisqualifyNotifyRequestMock, sendDisqualifyEmailMock],
  ] as const)('template=%s', (template, buildMock, sendMock) => {
    it('builds the notify request from the fetched application and sends it', async () => {
      const { req, res } = mockRequest(template);

      await endpoint(req, res);

      expect(buildMock).toHaveBeenCalledWith(mockApplication);
      expect(sendMock).toHaveBeenCalledWith(mockNotifyRequest);
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res._getJSONData()).toStrictEqual(mockNotifyResponse);
    });
  });

  it('returns 400 for an unknown template without calling Notify', async () => {
    const { req, res } = mockRequest('not-a-real-template');

    await endpoint(req, res);

    expect(sendNewApplicationEmailMock).not.toHaveBeenCalled();
    expect(sendMedicalNeedEmailMock).not.toHaveBeenCalled();
    expect(sendDisqualifyEmailMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Invalid template request',
    });
  });

  it('returns 500 when fetching the application throws', async () => {
    getApplicationMock.mockRejectedValue(new Error('boom'));

    const { req, res } = mockRequest('disqualify');

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to load application',
    });
  });

  it('returns 500 when the Notify send fails', async () => {
    sendDisqualifyEmailMock.mockRejectedValue(new Error('notify down'));

    const { req, res } = mockRequest('disqualify');

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Unable to send email',
    });
  });
});

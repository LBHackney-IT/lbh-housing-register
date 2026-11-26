/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import * as applicationApi from '../../../../../lib/gateways/applications-api';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/evidence';
import { generateMockRequestResponseWithStaffSession } from '../../../../../testUtils/apiHelper';
import {
  UserRole,
  generateSignedTokenByRole,
} from '../../../../../testUtils/userHelper';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return { ...actualAxios, isAxiosError: jest.fn() };
});
const mockAxiosInstance = axios as jest.Mocked<typeof axios>;

const applicationId = faker.string.uuid();

// claims in the token don't matter in these tests, it just need to exist
const { signedToken } = generateSignedTokenByRole(UserRole.Officer);

const validBody = JSON.stringify({
  documentTypes: ['proof-of-id', 'proof-of-address'],
});

function mockEvidenceRequest(body: string | undefined) {
  const { req, res } = generateMockRequestResponseWithStaffSession({
    sessionToken: signedToken,
    requestBody: body,
    method: 'POST',
  });
  req.query.id = applicationId;
  return { req, res };
}

describe('/api/applications/[id]/evidence', () => {
  let createEvidenceRequestSpy: jest.SpyInstance;
  let accessSpy: jest.SpyInstance;

  beforeEach(() => {
    createEvidenceRequestSpy = jest
      .spyOn(applicationApi, 'createEvidenceRequest')
      .mockResolvedValue([]);
    accessSpy = jest
      .spyOn(requestAuth, 'getResidentApplicationAccess')
      .mockReturnValue('allowed');
  });

  describe('authorization', () => {
    it('returns status code 403 and error message when access is forbidden', async () => {
      accessSpy.mockReturnValue('forbidden');

      const { req, res } = mockEvidenceRequest(validBody);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(res._getJSONData()).toStrictEqual({ message: 'Access denied' });
      expect(createEvidenceRequestSpy).not.toHaveBeenCalled();
    });

    it('returns status code 401 and never creates a request when there is no resident session', async () => {
      accessSpy.mockReturnValue('unauthenticated');

      const { req, res } = mockEvidenceRequest(validBody);

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(res._getJSONData()).toStrictEqual({ message: 'Unauthorized' });
      expect(createEvidenceRequestSpy).not.toHaveBeenCalled();
    });

    it('returns status code 200 when access is allowed', async () => {
      const { req, res } = mockEvidenceRequest(validBody);

      await endpoint(req, res);

      expect(accessSpy).toHaveBeenCalledWith(req, applicationId);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('returns 400 without checking authorisation when the request body cannot be parsed', async () => {
      const { req, res } = mockEvidenceRequest('not-json');

      await endpoint(req, res);

      expect(accessSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Unable to parse request',
      });
    });
  });

  describe('document types', () => {
    it('forwards only the document types and drops client-supplied fields such as userRequestedBy', async () => {
      const body = JSON.stringify({
        documentTypes: ['proof-of-pension'],
        userRequestedBy: 'Hackney Council Finance <phish@example.test>',
      });
      const { req, res } = mockEvidenceRequest(body);

      await endpoint(req, res);

      expect(createEvidenceRequestSpy).toHaveBeenCalledWith(
        applicationId,
        { documentTypes: ['proof-of-pension'] },
        expect.anything(),
      );
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it.each([
      ['no document types', {}],
      ['an empty list', { documentTypes: [] }],
      ['a value that is not a list', { documentTypes: 'proof-of-id' }],
      [
        'a document type that is not offered to residents',
        {
          documentTypes: ['proof-of-id', 'bank-statement-from-another-person'],
        },
      ],
    ])(
      'returns 400 and creates no request when the body has %s',
      async (_description, body) => {
        const { req, res } = mockEvidenceRequest(JSON.stringify(body));

        await endpoint(req, res);

        expect(createEvidenceRequestSpy).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res._getJSONData()).toStrictEqual({
          message: 'Invalid document types',
        });
      },
    );
  });

  it('forwards the backend status and body when createEvidenceRequest fails with an axios error', async () => {
    const axiosErrorStatusCode = StatusCodes.BAD_GATEWAY;
    const axiosErrorData = { message: 'upstream failure' };
    const mockAxiosError = {
      response: { status: axiosErrorStatusCode, data: axiosErrorData },
    } as AxiosError;

    createEvidenceRequestSpy.mockImplementationOnce(() => {
      throw mockAxiosError;
    });
    mockAxiosInstance.isAxiosError.mockReturnValueOnce(true);

    const { req, res } = mockEvidenceRequest(validBody);

    await endpoint(req, res);

    expect(res.statusCode).toBe(axiosErrorStatusCode);
    expect(res._getJSONData()).toStrictEqual(axiosErrorData);
  });
});

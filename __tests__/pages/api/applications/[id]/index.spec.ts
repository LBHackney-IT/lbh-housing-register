/** @jest-environment node */

import axios, { type AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import {
  createMocks,
  type RequestMethod,
  type RequestOptions,
} from 'node-mocks-http';

import * as staffAuth from '../../../../../lib/auth/staff';
import * as applicationApi from '../../../../../lib/gateways/applications-api';
import { ApplicationStatus } from '../../../../../lib/types/application-status';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/index';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../../../../testUtils/userHelper';

const applicationId = 'application-id';

function request(method: RequestMethod = 'PATCH') {
  const { req, res } = createMocks({
    method,
    query: { id: applicationId },
    body: JSON.stringify({
      id: applicationId,
    }) as unknown as RequestOptions['body'],
  });
  return { req, res };
}

describe('PATCH /api/applications/[id]', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('updates an application when access is allowed', async () => {
    jest
      .spyOn(requestAuth, 'getApplicationAccess')
      .mockResolvedValue('allowed');
    const update = jest
      .spyOn(applicationApi, 'updateApplication')
      .mockResolvedValue({ id: applicationId });
    const { req, res } = request();

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(update).toHaveBeenCalledWith(
      { id: applicationId },
      applicationId,
      req,
    );
    expect(res._getJSONData()).toEqual({ id: applicationId });
  });

  it('parses the request body before checking application access', async () => {
    const parse = jest.spyOn(JSON, 'parse');
    const access = jest
      .spyOn(requestAuth, 'getApplicationAccess')
      .mockResolvedValue('allowed');
    jest
      .spyOn(applicationApi, 'updateApplication')
      .mockResolvedValue({ id: applicationId });
    const { req, res } = request();

    await endpoint(req, res);

    expect(parse).toHaveBeenCalledWith(req.body);
    expect(access).toHaveBeenCalledWith(req, applicationId);
  });

  it.each([
    ['unauthenticated', StatusCodes.UNAUTHORIZED, 'Unauthorized'],
    ['forbidden', StatusCodes.FORBIDDEN, 'Access denied'],
  ] as const)(
    'returns the correct status for %s access',
    async (access, status, message) => {
      jest.spyOn(requestAuth, 'getApplicationAccess').mockResolvedValue(access);
      const update = jest.spyOn(applicationApi, 'updateApplication');
      const { req, res } = request();

      await endpoint(req, res);

      expect(res.statusCode).toBe(status);
      expect(res._getJSONData()).toEqual({ message });
      expect(update).not.toHaveBeenCalled();
    },
  );

  it('forbids an officer from updating an application assigned to someone else', async () => {
    const officer = generateHRUserWithPermissions(UserRole.Officer);
    jest.spyOn(staffAuth, 'getSession').mockResolvedValue(officer);
    jest.spyOn(applicationApi, 'getApplication').mockResolvedValue({
      id: applicationId,
      status: ApplicationStatus.SUBMITTED,
      assignedTo: 'someone-else@hackney.gov.uk',
      sensitiveData: false,
    });
    const update = jest.spyOn(applicationApi, 'updateApplication');
    const { req, res } = request();

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toEqual({ message: 'Access denied' });
    expect(update).not.toHaveBeenCalled();
  });

  it('rejects unsupported methods before authorization', async () => {
    const access = jest.spyOn(requestAuth, 'getApplicationAccess');
    const { req, res } = request('GET');

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('PATCH');
    expect(access).not.toHaveBeenCalled();
  });

  describe('error handling', () => {
    it('returns 400 when the request body cannot be parsed', async () => {
      const access = jest.spyOn(requestAuth, 'getApplicationAccess');
      const update = jest.spyOn(applicationApi, 'updateApplication');
      const { req, res } = request();
      req.body = 'not-json';
      jest.spyOn(console, 'error').mockImplementation();

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({
        message: 'Unable to parse request',
      });
      expect(access).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    });

    it('forwards the status and body from an Axios response error', async () => {
      const upstreamBody = { message: 'Bad gateway error thrown by axios' };
      const axiosError = {
        response: {
          status: StatusCodes.BAD_GATEWAY,
          data: upstreamBody,
        },
      } as AxiosError;
      jest
        .spyOn(requestAuth, 'getApplicationAccess')
        .mockResolvedValue('allowed');
      jest
        .spyOn(applicationApi, 'updateApplication')
        .mockRejectedValue(axiosError);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      const { req, res } = request();

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_GATEWAY);
      expect(res._getJSONData()).toEqual(upstreamBody);
    });

    it.each([
      [
        'an Axios request error with no response',
        { request: { data: 'request error from axios' } } as AxiosError,
      ],
      [
        'an Axios setup error with neither request nor response',
        { message: 'error code from axios' } as AxiosError,
      ],
      ['a non-Axios error', new Error('boom')],
    ])('logs and returns 500 for %s', async (_description, thrownError) => {
      jest
        .spyOn(requestAuth, 'getApplicationAccess')
        .mockResolvedValue('allowed');
      jest
        .spyOn(applicationApi, 'updateApplication')
        .mockRejectedValue(thrownError);
      jest
        .spyOn(axios, 'isAxiosError')
        .mockReturnValue(!(thrownError instanceof Error));
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const { req, res } = request();

      await endpoint(req, res);

      expect(consoleError).toHaveBeenCalledWith(
        'Unable to update application',
        thrownError,
      );
      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res._getJSONData()).toEqual({
        message: 'Unable to update application',
      });
    });
  });
});

/** @jest-environment node */

import axios, { type AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { createMocks, type RequestOptions } from 'node-mocks-http';

import * as apiAuth from '../../../../lib/auth/api';
import * as applicationApi from '../../../../lib/gateways/applications-api';
import endpoint from '../../../../pages/api/applications/index';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../../../testUtils/userHelper';

const application = { id: 'application-id' };
const applicationWithAssessment = {
  ...application,
  assessment: { reason: 'test' },
};

describe('POST /api/applications', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 401 and does not call the backend without a staff session', async () => {
    jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockImplementation(async (_req, res) => {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return undefined;
      });
    const add = jest.spyOn(applicationApi, 'addApplication');
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(application) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(add).not.toHaveBeenCalled();
  });

  it('returns 403 for read-only staff', async () => {
    jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockResolvedValue(generateHRUserWithPermissions(UserRole.ReadOnly));
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(application) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  it('returns the assessment-specific 403 for a read-only staff action', async () => {
    jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockResolvedValue(generateHRUserWithPermissions(UserRole.ReadOnly));
    const add = jest.spyOn(applicationApi, 'addApplication');
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(
        applicationWithAssessment,
      ) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toEqual({
      message: 'Unable to add application with assessment',
    });
    expect(add).not.toHaveBeenCalled();
  });

  it('adds an application for staff with write access', async () => {
    jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockResolvedValue(generateHRUserWithPermissions(UserRole.Officer));
    const add = jest
      .spyOn(applicationApi, 'addApplication')
      .mockResolvedValue(application);
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(application) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(add).toHaveBeenCalledWith(application, req);
  });

  it('parses the body and checks staff authentication once', async () => {
    const parse = jest.spyOn(JSON, 'parse');
    const requireStaff = jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockResolvedValue(generateHRUserWithPermissions(UserRole.Officer));
    jest.spyOn(applicationApi, 'addApplication').mockResolvedValue(application);
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(application) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(parse).toHaveBeenCalledWith(req.body);
    expect(requireStaff).toHaveBeenCalledTimes(1);
    expect(requireStaff).toHaveBeenCalledWith(req, res);
  });

  it('rejects malformed request bodies before calling the backend', async () => {
    const add = jest.spyOn(applicationApi, 'addApplication');
    jest.spyOn(console, 'error').mockImplementation();
    const { req, res } = createMocks({
      method: 'POST',
      body: '{' as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(add).not.toHaveBeenCalled();
  });

  it('forwards the status and body from an Axios response error', async () => {
    const upstreamBody = { message: 'upstream failure' };
    const axiosError = {
      response: {
        status: StatusCodes.BAD_GATEWAY,
        data: upstreamBody,
      },
    } as AxiosError;
    jest
      .spyOn(apiAuth, 'requireApiStaff')
      .mockResolvedValue(generateHRUserWithPermissions(UserRole.Officer));
    jest.spyOn(applicationApi, 'addApplication').mockRejectedValue(axiosError);
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    const { req, res } = createMocks({
      method: 'POST',
      body: JSON.stringify(application) as unknown as RequestOptions['body'],
    });

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.BAD_GATEWAY);
    expect(res._getJSONData()).toEqual(upstreamBody);
  });

  it.each([
    ['an Axios error without a response', { request: {} } as AxiosError],
    ['a non-Axios error', new Error('boom')],
  ])(
    'returns 500 when addApplication throws %s',
    async (_description, error) => {
      jest
        .spyOn(apiAuth, 'requireApiStaff')
        .mockResolvedValue(generateHRUserWithPermissions(UserRole.Officer));
      jest.spyOn(applicationApi, 'addApplication').mockRejectedValue(error);
      jest
        .spyOn(axios, 'isAxiosError')
        .mockReturnValue(!(error instanceof Error));
      jest.spyOn(console, 'error').mockImplementation();
      const { req, res } = createMocks({
        method: 'POST',
        body: JSON.stringify(application) as unknown as RequestOptions['body'],
      });

      await endpoint(req, res);

      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res._getJSONData()).toEqual({
        message: 'Unable to add application',
      });
    },
  );
});

describe('unsupported application request methods', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 405 and advertises both supported methods', async () => {
    const add = jest.spyOn(applicationApi, 'addApplication');
    const { req, res } = createMocks({ method: 'DELETE' });

    await endpoint(req, res);

    expect(add).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res.getHeader('Allow')).toBe('GET, POST');
    expect(res._getJSONData()).toEqual({ message: 'Method not allowed' });
  });
});

/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

import * as applicationApi from '../../../../../lib/gateways/applications-api';
import * as requestAuth from '../../../../../lib/utils/requestAuth';
import endpoint from '../../../../../pages/api/applications/[id]/evidence';
import { generateMockRequestResponseWithHackneyToken } from '../../../../../testUtils/apiHelper';
import {
  UserRole,
  generateSignedTokenByRole,
} from '../../../../../testUtils/userHelper';

const applicationId = faker.string.uuid();

describe('authorization', () => {
  //claims in the token don't matter in these tests, it just need to exist
  const { signedToken } = generateSignedTokenByRole(UserRole.Officer);
  jest.spyOn(applicationApi, 'createEvidenceRequest').mockResolvedValue(null);

  it('returns status code 403 and error message when canUpdateApplication returns false', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(false);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    const expectedErrorMessage = { message: 'Unable to update application' };

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toStrictEqual(expectedErrorMessage);
  });

  it('returns status code 200 when canUpdateApplication returns true', async () => {
    jest.spyOn(requestAuth, 'canUpdateApplication').mockReturnValue(true);

    const { req, res } = generateMockRequestResponseWithHackneyToken({
      hackneyToken: signedToken,
      requestBody: undefined,
      method: 'POST',
    });

    req.query.id = applicationId;

    await endpoint(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});

/** @jest-environment node */

import type { GetServerSidePropsContext } from 'next';
import { createRequest, createResponse } from 'node-mocks-http';

import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import { getSession } from './staff';
import { authorizeStaffPage } from './page';

jest.mock('./staff', () => ({
  ...jest.requireActual('./staff'),
  getSession: jest.fn(),
}));

const getSessionMock = getSession as jest.MockedFunction<typeof getSession>;
const context = {
  req: createRequest(),
  res: createResponse(),
  query: {},
  resolvedUrl: '/applications/view/application-id',
} as GetServerSidePropsContext;

describe('authorizeStaffPage', () => {
  it('redirects unauthenticated requests before page rendering', async () => {
    getSessionMock.mockResolvedValue(undefined);

    await expect(authorizeStaffPage(context)).resolves.toEqual({
      redirect: {
        permanent: false,
        destination: '/login?returnTo=%2Fapplications%2Fview%2Fapplication-id',
      },
    });
  });

  it('redirects a user without the required group', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.Officer),
    );

    await expect(
      authorizeStaffPage(context, {
        requiredGroup: 'authorized-manager-group',
      }),
    ).resolves.toEqual({
      redirect: { permanent: false, destination: '/access-denied' },
    });
  });

  it('returns an authenticated user with the required group', async () => {
    const user = generateHRUserWithPermissions(UserRole.Manager);
    getSessionMock.mockResolvedValue(user);

    await expect(
      authorizeStaffPage(context, {
        requiredGroup: 'authorized-manager-group',
      }),
    ).resolves.toEqual({ user });
  });

  it('redirects authenticated staff with no configured role', async () => {
    getSessionMock.mockResolvedValue(generateHRUserWithPermissions());

    await expect(authorizeStaffPage(context)).resolves.toEqual({
      redirect: { permanent: false, destination: '/access-denied' },
    });
  });

  it('redirects read-only staff away from write pages', async () => {
    getSessionMock.mockResolvedValue(
      generateHRUserWithPermissions(UserRole.ReadOnly),
    );

    await expect(authorizeStaffPage(context, { write: true })).resolves.toEqual(
      {
        redirect: { permanent: false, destination: '/access-denied' },
      },
    );
  });

  it.each([UserRole.Admin, UserRole.Manager, UserRole.Officer])(
    'allows writable role %s through a write page',
    async (role) => {
      const user = generateHRUserWithPermissions(role);
      getSessionMock.mockResolvedValue(user);

      await expect(
        authorizeStaffPage(context, { write: true }),
      ).resolves.toEqual({ user });
    },
  );
});

/** @jest-environment node */

import type { GetServerSidePropsContext } from 'next';
import { createRequest, createResponse } from 'node-mocks-http';

import { getSession } from './staff';
import { authorizeStaffPage } from './page';

jest.mock('./staff', () => ({
  getSession: jest.fn(),
  getRedirect: (
    user: unknown,
    write: boolean,
    returnTo: string,
  ): string | undefined => {
    if (!user) return `/login?returnTo=${encodeURIComponent(returnTo)}`;
    if (
      write &&
      (user as { hasReadOnlyPermissions: boolean }).hasReadOnlyPermissions
    ) {
      return '/access-denied';
    }
    return undefined;
  },
  hasUserGroup: (group: string, user: { groups: string[] }) =>
    user.groups.includes(group),
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
    getSessionMock.mockResolvedValue({
      groups: ['officers'],
      hasReadOnlyPermissions: false,
    } as Awaited<ReturnType<typeof getSession>>);

    await expect(
      authorizeStaffPage(context, { requiredGroup: 'managers' }),
    ).resolves.toEqual({
      redirect: { permanent: false, destination: '/access-denied' },
    });
  });

  it('returns an authenticated user with the required group', async () => {
    const user = {
      groups: ['managers'],
      hasReadOnlyPermissions: false,
    } as Awaited<ReturnType<typeof getSession>>;
    getSessionMock.mockResolvedValue(user);

    await expect(
      authorizeStaffPage(context, { requiredGroup: 'managers' }),
    ).resolves.toEqual({ user });
  });
});

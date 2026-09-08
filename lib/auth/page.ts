import type { GetServerSidePropsContext, Redirect } from 'next';

import type { StaffUserWithPermissions } from './staff';
import { getRedirect, getSession, hasUserGroup } from './staff';

type StaffPageOptions = {
  requiredGroup?: string;
  write?: boolean;
};

export async function authorizeStaffPage(
  context: GetServerSidePropsContext,
  options: StaffPageOptions = {},
): Promise<{ user: StaffUserWithPermissions } | { redirect: Redirect }> {
  const user = await getSession(context.req);
  const destination = getRedirect(user, options.write, context.resolvedUrl);

  if (destination) {
    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  if (options.requiredGroup && !hasUserGroup(options.requiredGroup, user!)) {
    return {
      redirect: {
        permanent: false,
        destination: '/access-denied',
      },
    };
  }

  return { user: user! };
}

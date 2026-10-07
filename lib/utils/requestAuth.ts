import { NextApiRequest } from 'next';

import {
  getSession,
  hasAnyPermissions,
  hasReadOnlyPermissionOnly,
} from '../auth/staff';
import { getUser } from './users';

export type ApplicationAccess = 'allowed' | 'unauthenticated' | 'forbidden';

export const getApplicationAccess = async (
  req: NextApiRequest,
  id: string,
): Promise<ApplicationAccess> => {
  const staff = await getSession(req);
  if (staff && hasAnyPermissions(staff) && !hasReadOnlyPermissionOnly(staff)) {
    return 'allowed';
  }

  const resident = getUser(req);
  if (resident?.application_id === id) return 'allowed';
  if (!staff && !resident) return 'unauthenticated';
  return 'forbidden';
};

export const canUpdateApplication = async (
  req: NextApiRequest,
  id: string,
): Promise<boolean> => {
  return (await getApplicationAccess(req, id)) === 'allowed';
};

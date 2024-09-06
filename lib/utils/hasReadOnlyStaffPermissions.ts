import { NextApiRequest } from 'next';

import { getSession, hasReadOnlyPermissionOnly } from './googleAuth';

export const hasReadOnlyStaffPermissions = (req: NextApiRequest): boolean => {
  const staff = getSession(req);
  if (!staff) return false;

  return hasReadOnlyPermissionOnly(staff);
};

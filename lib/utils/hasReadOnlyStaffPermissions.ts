import { NextApiRequest } from 'next';

import { getSession, hasReadOnlyPermissions } from './googleAuth';

export const hasReadOnlyStaffPermissions = (req: NextApiRequest): boolean => {
  const staff = getSession(req);
  if (!staff) return false;

  return hasReadOnlyPermissions(staff);
};

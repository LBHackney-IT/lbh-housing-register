import { NextApiRequest } from 'next';

import { getSession, hasAnyPermissions } from './googleAuth';

export const hasStaffPermissions = (req: NextApiRequest): boolean => {
  const staff = getSession(req);
  if (!staff) return false;

  return hasAnyPermissions(staff);
};

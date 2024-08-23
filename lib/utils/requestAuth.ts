import { NextApiRequest } from 'next';

import { hasReadOnlyStaffPermissions } from './hasReadOnlyStaffPermissions';
import { hasStaffPermissions } from './hasStaffPermissions';
import { getUser } from './users';

export const canUpdateApplication = (
  req: NextApiRequest,
  id: string
): boolean => {
  if (hasStaffPermissions(req) && !hasReadOnlyStaffPermissions(req))
    return true;

  const user = getUser(req);
  return user?.application_id === id;
};

import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  type StaffUserWithPermissions,
  getSession,
  hasAnyPermissions,
  hasUserGroup,
} from './staff';

export async function requireApiStaff(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<StaffUserWithPermissions | undefined> {
  const user = await getSession(req);
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  if (!hasAnyPermissions(user)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    return;
  }

  return user;
}

export async function requireApiStaffGroup(
  req: NextApiRequest,
  res: NextApiResponse,
  group: string,
): Promise<StaffUserWithPermissions | undefined> {
  const user = await requireApiStaff(req, res);
  if (!user) return;

  if (!hasUserGroup(group, user)) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    return;
  }

  return user;
}

import { NextApiRequest } from 'next';

import {
  getSession,
  hasAnyPermissions,
  hasReadOnlyPermissionOnly,
} from '../auth/staff';
import { getUser } from './users';

export type ApplicationAccess = 'allowed' | 'unauthenticated' | 'forbidden';

const isWritableStaff = (
  staff: Awaited<ReturnType<typeof getSession>>,
): boolean =>
  Boolean(
    staff && hasAnyPermissions(staff) && !hasReadOnlyPermissionOnly(staff),
  );

export const getApplicationAccess = async (
  req: NextApiRequest,
  id: string,
): Promise<ApplicationAccess> => {
  const staff = await getSession(req);
  if (isWritableStaff(staff)) return 'allowed';

  const resident = getUser(req);
  if (resident?.application_id === id) return 'allowed';
  if (!staff && !resident) return 'unauthenticated';
  return 'forbidden';
};

/**
 * For routes only writable staff should call, such as adding a note to an application's
 * history. Residents are refused even for their own application, so a resident can't write
 * entries that appear in staff history.
 */
export const getStaffWriteAccess = async (
  req: NextApiRequest,
): Promise<ApplicationAccess> => {
  const staff = await getSession(req);
  if (isWritableStaff(staff)) return 'allowed';

  const resident = getUser(req);
  if (!staff && !resident) return 'unauthenticated';
  return 'forbidden';
};

/**
 * For steps only a resident takes for their own application, such as requesting evidence
 * while they submit. Staff are refused even when they hold a writable role.
 */
export const getResidentApplicationAccess = (
  req: NextApiRequest,
  id: string,
): ApplicationAccess => {
  const resident = getUser(req);
  if (resident?.application_id === id) return 'allowed';
  if (!resident) return 'unauthenticated';
  return 'forbidden';
};

export const canUpdateApplication = async (
  req: NextApiRequest,
  id: string,
): Promise<boolean> => {
  return (await getApplicationAccess(req, id)) === 'allowed';
};

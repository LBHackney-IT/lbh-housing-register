import { NextApiRequest } from 'next';
import { getSession, hasAnyPermissions } from './googleAuth';
import { getUser } from './users';

export const canUpdateApplication = (
  req: NextApiRequest,
  id: string
): boolean => {
  const user = getUser(req);
  const staff = getSession(req);

  return user?.application_id === id || hasAnyPermissions(staff!);
};

import { NextApiRequest } from 'next';
import { Application } from '../../domain/HousingApi';
import { ApplicationStatus } from '../types/application-status';
import { getSession, hasAnyPermissions } from './googleAuth';
import { getUser } from './users';

export const canUpdateApplication = (
  req: NextApiRequest,
  id: string
): boolean => {
  if (hasStaffPermissions(req)) return true;

  const user = getUser(req);
  return user?.application_id === id;
};

export const hasStaffPermissions = (req: NextApiRequest): boolean => {
  const staff = getSession(req);
  if (!staff) return false;

  return hasAnyPermissions(staff);
};

export const isStaffAction = (application: Application): boolean => {
  if (
    application.sensitiveData ||
    application.assessment ||
    application.assignedTo ||
    (application.status && application.status !== ApplicationStatus.DRAFT)
  ) {
    return true;
  }

  return false;
};

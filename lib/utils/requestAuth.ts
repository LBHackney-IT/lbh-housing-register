import axios from 'axios';
import { NextApiRequest } from 'next';

import {
  canEditApplications,
  canViewSensitiveApplication,
  getSession,
  hasAnyPermissions,
  hasReadOnlyPermissionOnly,
} from '../auth/staff';
import { getApplication } from '../gateways/applications-api';
import { getUser } from './users';

export type ApplicationAccess = 'allowed' | 'unauthenticated' | 'forbidden';

const loadApplication = async (id: string) => {
  try {
    return await getApplication(id);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getApplicationAccess = async (
  req: NextApiRequest,
  id: string,
): Promise<ApplicationAccess> => {
  const staff = await getSession(req);
  if (staff && hasAnyPermissions(staff) && !hasReadOnlyPermissionOnly(staff)) {
    const application = await loadApplication(id);
    if (!application) return 'forbidden';

    if (
      application.sensitiveData &&
      application.assignedTo &&
      !canViewSensitiveApplication(application.assignedTo, staff)
    ) {
      return 'forbidden';
    }

    if (!canEditApplications(staff, application)) return 'forbidden';
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

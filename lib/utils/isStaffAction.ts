import { Application } from 'domain/HousingApi';

import { ApplicationStatus } from '../types/application-status';

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

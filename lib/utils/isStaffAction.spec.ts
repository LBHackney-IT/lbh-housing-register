import { Application } from '../../domain/HousingApi';
import { ApplicationStatus } from '../types/application-status';
import { isStaffAction } from './isStaffAction';

describe('isStaffAction', () => {
  it('returns true when application is flagged to contain sensitive data', () => {
    const application: Application = {
      sensitiveData: true,
    };
    expect(isStaffAction(application)).toBeTruthy();
  });

  it('returns true when application has assessment', () => {
    const application: Application = {
      assessment: {
        reason: 'test',
      },
    };
    expect(isStaffAction(application)).toBeTruthy();
  });

  it('returns true when application is assigned to staff member', () => {
    const application: Application = {
      assignedTo: 'member of staff',
    };
    expect(isStaffAction(application)).toBeTruthy();
  });

  it('returns true when application has status and it is not draft', () => {
    const application: Application = {
      status: ApplicationStatus.ACTIVE,
    };
    expect(isStaffAction(application)).toBeTruthy();
  });

  it('returns false when application has status and it is draft', () => {
    const application: Application = {
      status: ApplicationStatus.DRAFT,
    };
    expect(isStaffAction(application)).toBeFalsy();
  });

  it('returns false when application does not have sensitive data, assessment, assigned to or status set', () => {
    const application: Application = {};
    expect(isStaffAction(application)).toBeFalsy();
  });
});

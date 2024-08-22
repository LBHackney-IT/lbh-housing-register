import { ApplicationStatus, lookupStatus } from './application-status';

describe('lookupStatus', () => {
  it('returns Incomplete for ApplicationStatus.DRAFT', () => {
    expect(lookupStatus(ApplicationStatus.DRAFT)).toBe('Incomplete');
  });

  it('returns Added by officer for ApplicationStatus.MANUAL_DRAFT', () => {
    expect(lookupStatus(ApplicationStatus.MANUAL_DRAFT)).toBe(
      'Added by officer'
    );
  });

  it('returns Awaiting assessment for ApplicationStatus.SUBMITTED', () => {
    expect(lookupStatus(ApplicationStatus.SUBMITTED)).toBe(
      'Awaiting assessment'
    );
  });

  it('returns Referred for approval for ApplicationStatus.REFERRED', () => {
    expect(lookupStatus(ApplicationStatus.REFERRED)).toBe(
      'Referred for approval'
    );
  });

  it('returns Rejected by officer for ApplicationStatus.REJECTED', () => {
    expect(lookupStatus(ApplicationStatus.REJECTED)).toBe(
      'Rejected by officer'
    );
  });

  it('returns Rejected by system for ApplicationStatus.DISQUALIFIED', () => {
    expect(lookupStatus(ApplicationStatus.DISQUALIFIED)).toBe(
      'Rejected by system'
    );
  });

  it('returns Active and under appeal for ApplicationStatus.ACTIVE_UNDER_APPEAL', () => {
    expect(lookupStatus(ApplicationStatus.ACTIVE_UNDER_APPEAL)).toBe(
      'Active and under appeal'
    );
  });

  it('returns Inactive and under appeal for ApplicationStatus.INACTIVE_UNDER_APPEAL', () => {
    expect(lookupStatus(ApplicationStatus.INACTIVE_UNDER_APPEAL)).toBe(
      'Inactive and under appeal'
    );
  });

  it('returns Awaiting reassessment for ApplicationStatus.AWAITING_REASSESSMENT', () => {
    expect(lookupStatus(ApplicationStatus.AWAITING_REASSESSMENT)).toBe(
      'Awaiting reassessment'
    );
  });

  it('returns given status when not match found', () => {
    const nonMatchingString = 'non matching string';
    expect(lookupStatus(nonMatchingString)).toBe(nonMatchingString);
  });
});

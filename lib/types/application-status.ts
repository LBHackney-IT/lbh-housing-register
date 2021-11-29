export enum ApplicationStatus {
  DRAFT = 'New',
  MANUAL_DRAFT = 'ManualDraft',
  SUBMITTED = 'Submitted',
  ACTIVE = 'Active',
  PENDING = 'Pending',
  REFERRED = 'Referred',
  REJECTED = 'Rejected',
  DISQUALIFIED = 'Disqualified',
  CANCELLED = 'Cancelled',
  SUSPENDED = 'Suspended',
  HOUSED = 'Housed',
  ACTIVE_UNDER_APPEAL = 'ActiveUnderAppeal',
  INACTIVE_UNDER_APPEAL = 'InactiveUnderAppeal',
}

export const lookupStatus = (status: string): string => {
  switch (status) {
    case ApplicationStatus.DRAFT:
      return 'Incomplete';
    case ApplicationStatus.MANUAL_DRAFT:
      return 'Added by officer';
    case ApplicationStatus.SUBMITTED:
      return 'Awaiting assessment';
    case ApplicationStatus.REFERRED:
      return 'Referred for approval';
    case ApplicationStatus.REJECTED:
      return 'Rejected by officer';
    case ApplicationStatus.DISQUALIFIED:
      return 'Rejected by system';
    case ApplicationStatus.ACTIVE_UNDER_APPEAL:
      return 'Active and under appeal';
    case ApplicationStatus.INACTIVE_UNDER_APPEAL:
      return 'Inactive and under appeal';
    default:
      return status;
  }
};

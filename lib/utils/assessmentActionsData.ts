import { ApplicationStatus } from '../types/application-status';

export const reasonInitialValue = (disqualificationReason: string): string => {
  switch (disqualificationReason) {
    case 'inUkToStudy':
    case 'inUkOnVisa':
    case 'notGrantedSettledStatus':
    case 'sponseredToStayInUk':
    case 'limitedLeaveToRemainInUk':
      return 'not-eligible';

    case 'notResidingInHackneyLast3Years':
    case 'hasCourtOrder':
    case 'ableToBuyProperty':
      return 'failed-residential-criteria';

    case 'ownOrSoldProperty':
      return 'owner-occupier';

    case 'under18YearsOld':
      return 'under-18yrs';

    case 'squatting':
      return 'squatter-unauthorised-occupant';

    case 'haveSubletAccomodation':
      return 'unauthorised-subletting';

    case 'incomeOver80000':
    case 'incomeOver100000':
      return 'household-income-exceeds-80-000-100-000-pa';

    case 'assetsOver80000':
      return 'capital-assets-exceeds-80-000';

    case 'notLackingRooms':
      return 'adequately-housed';

    case 'onAnotherHousingRegister':
      return 'another-la-register';

    case 'intentionallyHomeless':
      return 'intentionally-homeless';

    case 'rentArrears':
      return 'arrears';

    default:
      return '';
  }
};

export const statusOptions = [
  {
    label: 'Select an option',
    value: '',
  },
  {
    label: 'Incomplete',
    value: ApplicationStatus.DRAFT,
  },
  {
    label: 'Added by officer',
    value: ApplicationStatus.MANUAL_DRAFT,
  },
  {
    label: 'Awaiting assessment',
    value: ApplicationStatus.SUBMITTED,
  },
  {
    label: 'Active',
    value: ApplicationStatus.ACTIVE,
  },
  {
    label: 'Referred for approval',
    value: ApplicationStatus.REFERRED,
  },
  {
    label: 'Rejected by officer',
    value: ApplicationStatus.REJECTED,
  },
  {
    label: 'Rejected by system',
    value: ApplicationStatus.DISQUALIFIED,
  },
  {
    label: 'Pending',
    value: ApplicationStatus.PENDING,
  },
  {
    label: 'Cancelled',
    value: ApplicationStatus.CANCELLED,
  },
  {
    label: 'Housed',
    value: ApplicationStatus.HOUSED,
  },
  {
    label: 'Active and under appeal',
    value: ApplicationStatus.ACTIVE_UNDER_APPEAL,
  },
  {
    label: 'Inactive and under appeal',
    value: ApplicationStatus.INACTIVE_UNDER_APPEAL,
  },
  {
    label: 'Suspended',
    value: ApplicationStatus.SUSPENDED,
  },
  {
    label: 'Awaiting reassessment',
    value: ApplicationStatus.AWAITING_REASSESSMENT,
  },
];

export const reasonOptions = [
  { label: 'Select an option', value: '' },
  { label: '"A" disrepair', value: 'a-disrepair' },
  { label: '"A" medical awarded', value: 'a-medical-awarded' },
  { label: '"A" Overcrowding', value: 'a-overcrowding' },
  { label: '"A" social', value: 'a-social' },
  {
    label: 'Accepted Part V1 Application',
    value: 'accepted-part-v1-application',
  },
  {
    label: 'Accepted Homeless Application',
    value: 'accepted-homeless-application',
  },
  { label: 'Adequately housed', value: 'adequately-housed' },
  { label: 'Appeal overturned', value: 'appeal-overturned' },
  { label: 'Appeal upheld', value: 'appeal-upheld' },
  { label: 'Arrears', value: 'arrears' },
  {
    label: 'Awaiting further information',
    value: 'awaiting-further-information',
  },
  { label: '"B" medical awarded', value: 'b-medical-awarded' },
  { label: '"B" social', value: 'b-social' },
  {
    label: 'Capital assets exceeds £80,000',
    value: 'capital-assets-exceeds-80-000',
  },
  { label: 'Change of address', value: 'change-of-address' },
  {
    label: 'Change of name/title',
    value: 'change-of-name-title',
  },
  { label: 'Connected carer', value: 'connected-carer' },
  { label: 'ECP', value: 'ecp' },
  {
    label: 'Extensive support needs',
    value: 'extensive-support-needs',
  },
  {
    label: 'Failed residential criteria',
    value: 'failed-residential-criteria',
  },
  {
    label: 'Failed to provide information',
    value: 'failed-to-provide-information',
  },
  { label: 'Foster carer', value: 'foster-carer' },
  { label: 'Fraud', value: 'fraud' },
  {
    label: 'Housed into Council property',
    value: 'housed-into-council-property',
  },
  {
    label: 'Housed into Housing Association property',
    value: 'housed-into-housing-association-property',
  },
  {
    label: 'Housed into private rented sector',
    value: 'housed-into-private-rented-sector',
  },
  {
    label: 'Household income exceeds £80,000/£100,000 pa',
    value: 'household-income-exceeds-80-000-100-000-pa',
  },
  {
    label: 'Household member moved in',
    value: 'household-member-moved-in',
  },
  {
    label: 'Household member moved out',
    value: 'household-member-moved-out',
  },
  { label: 'Intentionally homeless', value: 'intentionally-homeless' },
  { label: 'Misrepresentation', value: 'misrepresentation' },
  { label: 'Multiple needs', value: 'multiple-needs' },
  { label: 'New born baby', value: 'new-born-baby' },
  { label: 'No medical awarded', value: 'no-medical-awarded' },
  {
    label: 'Non-TNT underoccupation',
    value: 'non-tnt-underoccupation',
  },
  { label: 'Not eligible', value: 'not-eligible' },
  { label: 'Permanent decant', value: 'permanent-decant' },
  {
    label: 'Reduced Priority - worsened housing situation',
    value: 'reduced-priority-worsened-housing-situation',
  },
  { label: 'On another LA register', value: 'another-la-register' },
  {
    label: "Over 55ys - Older Person's Housing",
    value: 'over-55ys-older-person-s-housing',
  },
  { label: 'Owner Occupier', value: 'owner-occupier' },
  { label: 'Quota', value: 'quota' },
  {
    label: 'Significant household member birthday',
    value: 'significant-household-member-birthday',
  },
  {
    label: 'Squatter/Unauthorised occupant',
    value: 'squatter-unauthorised-occupant',
  },
  { label: 'Temporary decant', value: 'temporary-decant' },
  { label: 'TNT underoccpation', value: 'tnt-underoccpation' },
  {
    label: 'Unauthorised subletting',
    value: 'unauthorised-subletting',
  },
  { label: 'Under 18yrs', value: 'under-18yrs' },
  { label: 'Other', value: 'other' },
];

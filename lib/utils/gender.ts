import { Applicant } from '../../domain/HousingApi';

/**
 * Get the applicants gender as a string
 * @param {Applicant} applicant The applicant
 * @returns {string}
 */
export const getGenderName = (applicant: Applicant): string => {
  const gender = applicant?.person?.gender?.toString() ?? '';
  switch (gender) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
    case 'self':
    default:
      return applicant.person?.genderDescription ?? '';
  }
};

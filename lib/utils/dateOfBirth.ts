import { Applicant } from '../../domain/HousingApi';

export function formatDob(date: Date) {
  return `${date.toLocaleString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

/**
 * Get the applicants age as a number
 * @param {Applicant} applicant The applicant
 * @returns {string}
 */
export const getAgeInYears = (applicant: Applicant): number => {
  const dateString = applicant.person?.dateOfBirth ?? '';

  if (dateString === '') {
    return 0;
  }

  var dateOfBirth = new Date(dateString);
  return getAgeInYearsFromDate(dateOfBirth);
};

export const getAgeInYearsFromDate = (date: Date): number => {
  var today = new Date();
  var dateOfBirth = new Date(date);
  if (isNaN(+dateOfBirth)) {
    return NaN;
  }

  var age = today.getFullYear() - dateOfBirth.getFullYear();
  var monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today < dateOfBirth)) {
    age--;
  }
  return age;
};

const applicantEqualToOrOlderThanAge = (
  applicant: Applicant,
  age: number
): boolean => {
  return getAgeInYears(applicant) >= age;
};

export const isOver18 = (applicant: Applicant): boolean => {
  return applicantEqualToOrOlderThanAge(applicant, 18);
};

export const isOver16 = (applicant: Applicant): boolean => {
  return applicantEqualToOrOlderThanAge(applicant, 16);
};

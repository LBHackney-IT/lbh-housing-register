import { Applicant } from '../../domain/HousingApi';

export function formatDate(date: string | undefined) {
  if (!date) return '';
  return `${new Date(date).toLocaleString('default', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function formatDob(date: Date) {
  return `${date.toLocaleString('default', {
    timeZone: 'UTC',
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

  const dateOfBirth = new Date(dateString);
  return getAgeInYearsFromDate(dateOfBirth);
};

export const getAgeInYearsFromDate = (birthDate: Date): number => {
  const today = new Date();

  if (isNaN(+birthDate)) {
    return NaN;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const isDayDiff = today.getDate() < birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && isDayDiff)) {
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

export const isOver55 = (applicant: Applicant): boolean => {
  return applicantEqualToOrOlderThanAge(applicant, 55);
};

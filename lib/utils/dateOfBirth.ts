import { Applicant } from "../../domain/HousingApi";

/**
 * Get the applicants age as a number
 * @param {Applicant} applicant The applicant
 * @returns {string}
 */
export const getAgeInYears = (
  applicant: Applicant
): number => {
  const dateString = applicant.person?.dateOfBirth ?? '';
  var today = new Date();
  var dateOfBirth = new Date(dateString);
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

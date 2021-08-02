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

  var age = today.getFullYear() - dateOfBirth.getFullYear();
  var m = today.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && today < dateOfBirth)) {
    age--;
  }
  return age;
};

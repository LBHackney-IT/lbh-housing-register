import { Applicant } from "../../domain/HousingApi";
import { getQuestionValue } from "../store/applicant";
import { FormID } from "./form-data";

/**
 * Get the applicants gender as a string
 * @param {Applicant} applicant The applicant
 * @returns {string}
 */
export const getGenderName = (
  applicant: Applicant
): string => {
  const gender = applicant.person?.gender?.toString();
  switch (gender) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
    default:
    case 'self':
      return getQuestionValue(applicant.questions, FormID.PERSONAL_DETAILS, 'self-describe');
  }
};

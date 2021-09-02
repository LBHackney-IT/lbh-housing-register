import { Applicant } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormData, FormField } from '../types/form';
import { FormID, getEligibilityCriteria } from './form-data';
import { applicantEqualToOrOlderThanAge } from '../../lib/utils/dateOfBirth';

/**
 * Determines if the field should be displayed based on the values passed in
 * @param {FormField} field - The field
 * @param {FormData} values - The form values
 * @returns {boolean} - should the field be displayed?
 */
export function getDisplayStateOfField(
  field: FormField,
  values: FormData
): boolean {
  let display = true;

  if (field.conditionalDisplay) {
    field.conditionalDisplay.forEach((condition) => {
      if (display && condition.is) {
        display = values[condition.field] === condition.is;
      }

      if (display && condition.isNot) {
        display = values[condition.field] !== condition.isNot;
      }
    });
  }

  return display;
}

/**
 * Is the form data for the applicant eligible?
 * @param applicant The applicant
 * @returns {[boolean, string[]]} - A tuple of state (isValid) and error message
 */
export function checkEligible(
  applicant: Applicant,
  isMainApplicant: boolean
): [boolean, string[]] {
  let isValid = true;
  let reasons: string[] = [];

  const setInvalid = (reasoning?: string): void => {
    isValid = false;

    if (reasoning) {
      reasons.push(reasoning);
    }
  };

  if (isMainApplicant) {
    if (!applicantEqualToOrOlderThanAge(applicant, 18)) {
      setInvalid('Main Applicant is not over 18');
    }
  }

  for (const [form, values] of Object.entries(FormID)) {
    const eligibilityCriteria = getEligibilityCriteria(values);
    eligibilityCriteria?.forEach((criteria) => {
      const fieldValue = getQuestionValue(
        applicant.questions,
        values,
        criteria.field
      );

      if (Array.isArray(fieldValue) && fieldValue.indexOf(criteria.is) !== -1) {
        setInvalid(criteria.reasoning);
      }

      if (criteria.is && criteria.is === fieldValue) {
        setInvalid(criteria.reasoning);
      }

      if (criteria.isNot && criteria.isNot === fieldValue) {
        setInvalid(criteria.reasoning);
      }
    });
  }

  return [isValid, reasons];
}

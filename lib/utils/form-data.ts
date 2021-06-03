import agreementFormData from '../../data/forms/agreement.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
import addressDetailsFormData from '../../data/forms/address-details.json';
import testFormData from '../../data/forms/_test-form.json';
import yourSituationFormData from '../../data/forms/your-situation.json';
import signInFormData from '../../data/forms/sign-in.json';
import signInVerifyFormData from '../../data/forms/sign-in-verify.json';
import signUpDetailsFormData from '../../data/forms/sign-up-details.json';
import { EligibilityCriteria, MultiStepForm } from '../types/form';
import residentialStatusFormData from '../../data/forms/residential-status.json';

export const AGREEMENT = 'agreement';
export const SIGN_IN = 'sign-in';
export const SIGN_IN_VERIFY = 'sign-in-verify';
export const SIGN_UP_DETAILS = 'sign-up-details';
export const IMMIGRATION_STATUS = 'immigration-status';
export const PERSONAL_DETAILS = 'personal-details';
export const ADDRESS_DETAILS = 'address-details';
export const YOUR_SITUATION = 'your-situation';
export const RESIDENTIAL_STATUS = 'residential-status';

/**
 * Get the eligibility criteria from the requested form
 * @param {string} formId - The requested eligibility criteria
 * @returns {EligibilityCriteria}
 */
export function getEligibilityCriteria(
  formId: string
): EligibilityCriteria[] | undefined {
  const formData = getFormData(formId);
  return formData?.eligibility;
}

/**
 * Get the form data that makes up the requested form
 * @param {string} form - The requested form data
 * @returns {MultiStepForm}
 */
export function getFormData(form: string): MultiStepForm {
  switch (form.toLowerCase()) {
    case AGREEMENT:
      return agreementFormData;

    case SIGN_IN:
      return signInFormData;

    case SIGN_IN_VERIFY:
      return signInVerifyFormData;

    case SIGN_UP_DETAILS:
      return signUpDetailsFormData;

    case IMMIGRATION_STATUS:
      return immigrationStatusFormData;

    case PERSONAL_DETAILS:
      return personalDetailsFormData;

    case ADDRESS_DETAILS:
      return addressDetailsFormData;

    case YOUR_SITUATION:
      return yourSituationFormData;

    case RESIDENTIAL_STATUS:
      return residentialStatusFormData;

    default:
      return testFormData;
  }
}

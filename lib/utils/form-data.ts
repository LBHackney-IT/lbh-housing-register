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
import houseHoldOverview from '../../data/forms/household-details.json';
import peopleInApplication_1 from '../../data/forms/household/people-in-application-1.json';
import peopleInApplication_2 from '../../data/forms/household/people-in-application-2.json';
import peopleInApplication_3 from '../../data/forms/household/people-in-application-3.json';
import peopleInApplication_4 from '../../data/forms/household/people-in-application-4.json';
import peopleInApplication_5 from '../../data/forms/household/people-in-application-5.json';
import peopleInApplication_6 from '../../data/forms/household/people-in-application-6.json';
import peopleInApplication_7 from '../../data/forms/household/people-in-application-7.json';
import addressHistory from '../../data/forms/address-history.json';

export const AGREEMENT = 'agreement';
export const SIGN_IN = 'sign-in';
export const SIGN_IN_VERIFY = 'sign-in-verify';
export const SIGN_UP_DETAILS = 'sign-up-details';
export const IMMIGRATION_STATUS = 'immigration-status';
export const PERSONAL_DETAILS = 'personal-details';
export const ADDRESS_DETAILS = 'address-details';
export const YOUR_SITUATION = 'your-situation';
export const RESIDENTIAL_STATUS = 'residential-status';
export const HOUSEHOLD_OVERVIEW = 'household-overview';
export const PEOPLE_IN_APPLICATION = 'people-in-application';
export const ADDRESS_HISTORY = 'address-history';

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

    case HOUSEHOLD_OVERVIEW:
      return houseHoldOverview;

    case ADDRESS_HISTORY:
      return addressHistory;

    default:
      throw new Error('Unknown form step: ' + form);
  }
}

export function getHouseHoldData(form: any): any {
  switch (parseInt(form)) {
    case 1:
      return peopleInApplication_1;
    case 2:
      return peopleInApplication_2;
    case 3:
      return peopleInApplication_3;
    case 4:
      return peopleInApplication_4;
    case 5:
      return peopleInApplication_5;
    case 6:
      return peopleInApplication_6;
    case 7:
      return peopleInApplication_7;
  }
}

import addressDetailsFormData from '../../data/forms/address-details.json';
import addressHistory from '../../data/forms/address-history.json';
import agreementFormData from '../../data/forms/agreement.json';
import houseHoldOverview from '../../data/forms/household-details.json';
import peopleInApplication from '../../data/forms/people-in-application.json';
import immigrationStatusFormData from '../../data/forms/immigration-status.json';
import incomeSavings from '../../data/forms/income.json';
import medicalNeeds from '../../data/forms/medical-needs.json';
import personalDetailsFormData from '../../data/forms/person-details.json';
import residentialStatusFormData from '../../data/forms/residential-status.json';
import signInVerifyFormData from '../../data/forms/sign-in-verify.json';
import signInFormData from '../../data/forms/sign-in.json';
import signUpDetailsFormData from '../../data/forms/sign-up-details.json';
import yourSituationFormData from '../../data/forms/your-situation.json';
import { EligibilityCriteria, FormField, MultiStepForm } from '../types/form';

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
export const INCOME_SAVINGS = 'income-savings';
export const MEDICAL_NEEDS = 'medical-needs';

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

    case INCOME_SAVINGS:
      return incomeSavings;

    case MEDICAL_NEEDS:
      return medicalNeeds;

    default:
      throw new Error('Unknown form step: ' + form);
  }
}

export function getPeopleInApplicationForm(
  additionalResidents: number
): MultiStepForm {
  const formFields = peopleInApplication.steps[0].fields;

  const headerField = (n: number): FormField => ({
    as: 'paragraph',
    label: `Person ${n + 1}`,
    name: `person${n + 1}`,
  });

  const mainApplicantFields = [
    headerField(0),
    ...formFields.map((field) => ({
      ...field,
      name: `mainApplicant.${field.name}`,
    })),
  ];

  const additionalResidentsFields = new Array(additionalResidents)
    .fill(undefined)
    .flatMap((_, i) => [
      headerField(i + 1),
      ...formFields.map((field) => ({
        ...field,
        name: `otherMembers[${i}].${field.name}`,
      })),
    ]);

  return {
    ...peopleInApplication,
    steps: [
      {
        fields: [...mainApplicantFields, ...additionalResidentsFields],
      },
    ],
  };
}

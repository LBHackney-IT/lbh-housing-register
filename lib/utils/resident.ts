import { Applicant } from '../../domain/HousingApi';
import { ApplicationSteps } from '../types/application';
import { getFormIdsFromApplicationSteps } from './application-forms';
import { FormID } from './form-data';

export const applicationStepsRemaining = (
  applicant: Applicant,
  isMainApplicant: boolean
): number => {
  const steps = getFormIdsFromApplicationSteps(
    getApplicationStepsForResident(isMainApplicant)
  );
  let completeSteps = 0;

  steps.map((step) =>
    hasResidentAnsweredForm(applicant, step) ? completeSteps++ : null
  );

  return steps.length - completeSteps;
};

/**
 * Generate a slug from an input
 * @param {string} input The input value we wish to modify
 * @returns {string} The modified value
 */
export const generateSlug = (input: string): string => {
  return encodeURI(input.toLowerCase().replaceAll(' ', '-'));
};

/**
 * Get the application form steps required by this resident
 * @param {Resident} applicant The resident we wish to get the steps for
 * @returns {ApplicationSteps[]} An object of steps, grouped
 */
export const getApplicationStepsForResident = (
  isMainApplicant: boolean
): ApplicationSteps[] => {
  if (isMainApplicant) {
    return [
      {
        heading: 'Identity',
        steps: [
          {
            heading: 'Personal details',
            id: FormID.PERSONAL_DETAILS,
          },
          {
            heading: 'Immigration status',
            id: FormID.IMMIGRATION_STATUS,
          },
          {
            heading: 'Employment',
            id: FormID.EMPLOYMENT,
          },
        ],
      },
      {
        heading: 'Living Situation',
        steps: [
          {
            heading: 'Residential status',
            id: FormID.RESIDENTIAL_STATUS,
          },
          {
            heading: 'Address history',
            id: FormID.ADDRESS_HISTORY,
          },
          {
            heading: 'Current accommodation',
            id: FormID.ADDRESS_DETAILS,
          },
          {
            heading: 'Your situation',
            id: FormID.YOUR_SITUATION,
          },
        ],
      },
      {
        heading: 'Money',
        steps: [
          {
            heading: 'Income and savings',
            id: FormID.INCOME_SAVINGS,
          },
        ],
      },
      {
        heading: 'Health',
        steps: [
          {
            heading: 'Medical needs',
            id: FormID.MEDICAL_NEEDS,
          },
        ],
      },
    ];
  } else {
    return [
      {
        heading: 'Identity',
        steps: [
          {
            heading: 'Personal details',
            id: FormID.PERSONAL_DETAILS,
          },
          {
            heading: 'Immigration status',
            id: FormID.IMMIGRATION_STATUS,
          },
        ],
      },
      {
        heading: 'Health',
        steps: [
          {
            heading: 'Medical needs',
            id: FormID.MEDICAL_NEEDS,
          },
        ],
      },
    ];
  }
};

/**
 * Has the user answered any of the questions from the form data / section?
 * @param {Resident} resident The resident
 * @param {string} form ID of the form data / section
 * @returns {boolean}
 */
export const hasResidentAnsweredForm = (
  applicant: Applicant,
  form: string
): boolean => {
  // TODO how are we going to structure this nested array of questions. And how are we going to record that a section has been answered?
  // Will we store each section as a JSON encoded string? We'll use a dot notation. E.g. residential-status.moved-borough.
  // You've answered the form if you've answered at least one question within it.

  return applicant.questions?.find((q) => q.id?.startsWith(form)) !== undefined;
};
